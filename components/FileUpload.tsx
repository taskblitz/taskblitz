'use client'
import { useState, useRef } from 'react'
import { Upload, X, File } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface FileUploadProps {
  onFileUploaded: (fileUrl: string, fileName: string, fileSize: number, fileType: string) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({ onFileUploaded, accept = 'image/*,.pdf', maxSizeMB = 2 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    // Set filename immediately
    setFileName(file.name)
    console.log('Filename set:', file.name)

    // Show preview for images
    if (file.type.startsWith('image/')) {
      console.log('Creating image preview...')
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log('Preview loaded, setting state')
        setPreview(reader.result as string)
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('Not an image, skipping preview')
    }

    // Upload to Supabase Storage
    console.log('Starting upload...')
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `submissions/${uniqueFileName}`

      // Upload file
      const { error } = await supabase.storage
        .from('task-submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Supabase upload error:', error)
        // Don't clear preview on error - keep it visible
        toast.error(`Upload failed: ${error.message}. File preview kept for retry.`)
        setUploading(false)
        return
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('task-submissions')
        .getPublicUrl(filePath)

      onFileUploaded(urlData.publicUrl, file.name, file.size, file.type)
      toast.success('File uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading file:', error)
      // Keep preview visible even on error
      toast.error(`Upload error: ${error.message || 'Unknown error'}. File preview kept.`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        handleFileSelect({ target: input } as any)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearFile = () => {
    setPreview(null)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          uploading 
            ? 'border-purple-500 bg-purple-500/10 cursor-wait' 
            : 'border-white/20 cursor-pointer hover:border-purple-500 hover:bg-white/5'
        }`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${uploading ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
        <p className="text-white mb-2 font-medium">
          {uploading ? 'Uploading...' : 'Drag and drop file here or click to browse'}
        </p>
        <p className="text-sm text-gray-500">
          Max {maxSizeMB}MB • {accept.includes('image') ? 'Images' : 'Files'} {accept.includes('.pdf') && '& PDFs'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Preview Area */}
      {(preview || fileName) && (
        <div className="border-2 border-green-500/50 rounded-xl p-4 bg-green-500/10">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-green-500/30"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center border-2 border-green-500/30">
                  <File className="w-8 h-8 text-green-400" />
                </div>
              )}
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate mb-1">{fileName}</p>
              <div className="flex items-center gap-2">
                {uploading ? (
                  <>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-purple-300">Uploading...</p>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm text-green-300">Upload complete ✓</p>
                  </>
                )}
              </div>
            </div>

            {/* Remove Button */}
            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
