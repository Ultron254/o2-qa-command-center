/**
 * File upload utility for attaching screenshots and evidence.
 * Uses Supabase Storage when configured, falls back to local handling.
 */

import { supabase } from '../supabase';

const BUCKET_NAME = 'attachments';

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadFile(
  file: File,
  entityType: string,
  entityId: string
): Promise<UploadResult> {
  const path = `${entityType}/${entityId}/${Date.now()}-${file.name}`;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (supabaseUrl) {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, { upsert: false });
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  // Fallback: create object URL for local preview
  return {
    url: URL.createObjectURL(file),
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ACCEPTED_FILE_TYPES = {
  images: 'image/jpeg,image/png,image/gif,image/webp',
  documents: 'application/pdf,text/plain,text/csv',
  all: 'image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,text/csv',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
