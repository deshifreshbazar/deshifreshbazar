import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Generate public URL for Supabase Storage file
 * @param filePath - The file path stored in database (e.g., "1234567890-abc123-image.jpg")
 * @param bucket - The storage bucket name (default: "product-images")
 * @returns Public URL or placeholder if path is invalid
 */
export function getSupabaseImageUrl(filePath: string | null | undefined, bucket = "product-images"): string {
  // Return placeholder for null/undefined/empty paths
  if (!filePath || filePath.trim() === "") {
    return "/placeholder.svg?height=400&width=400"
  }

  // If it's already a full URL, return as is (for backward compatibility)
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath
  }

  // Generate public URL from Supabase Storage
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl || "/placeholder.svg?height=400&width=400"
}

/**
 * Upload file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @returns Promise with file path or error
 */
export async function uploadToSupabase(
  file: File,
  bucket = "product-images",
): Promise<{ path: string } | { error: string }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return { error: error.message }
    }

    return { path: data.path }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload file" }
  }
}

/**
 * Delete file from Supabase Storage
 * @param filePath - Path of file to delete
 * @param bucket - Storage bucket name
 * @returns Promise with success/error status
 */
export async function deleteFromSupabase(
  filePath: string,
  bucket = "product-images",
): Promise<{ success: boolean; error?: string }> {
  try {
    // Don't try to delete placeholder URLs or full URLs
    if (!filePath || filePath.includes("placeholder.svg") || filePath.startsWith("http")) {
      return { success: true }
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      console.error("Supabase delete error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete file" }
  }
}

/**
 * List files in Supabase Storage bucket
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path
 * @returns Promise with file list or error
 */
export async function listSupabaseFiles(bucket = "product-images", folder?: string) {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
    })

    if (error) {
      console.error("Supabase list error:", error)
      return { error: error.message }
    }

    return { files: data }
  } catch (error) {
    console.error("List files error:", error)
    return { error: "Failed to list files" }
  }
}
