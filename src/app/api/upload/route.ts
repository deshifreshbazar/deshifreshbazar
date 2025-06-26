import { type NextRequest, NextResponse } from "next/server"
import { uploadToSupabase } from "@/lib/supabase-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Upload to Supabase Storage
    const result = await uploadToSupabase(file, "product-images")

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Return only the file path (not the full URL)
    return NextResponse.json({
      success: true,
      filePath: result.path, // This is just the filename/path
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    // Delete from Supabase Storage
    const { deleteFromSupabase } = await import("@/lib/supabase-storage")
    const result = await deleteFromSupabase(filePath, "product-images")

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
