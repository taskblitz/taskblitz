'use client'
import { useState, useRef } from 'react'
import { Upload, X, File, Image as ImageIcon } from 'lucide-react'
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
    if (!file) return

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setFileName(file.name)

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    // Upload to Supabase Storage
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `submissions/${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from('task-submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('task-submissions')
        .getPublicUrl(filePath)

      onFileUploaded(urlData.publicUrl, file.name, file.size, file.type)
      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      setPreview(null)
      setFileName(null)
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
    <div>
      {!preview && !fileName ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">
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
      ) : (
        <div className="border border-white/20 rounded-xl p-6 bg-white/5">
          <div className="flex items-start gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                <File className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <p className="font-medium mb-1">{fileName}</p>
              <p className="text-sm text-gray-400">
                {uploading ? 'Uploading...' : 'Upload complete'}
              </p>
            </div>

            {!uploading && (
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-white transition-colors"
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
