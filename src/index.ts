import { put, del } from '@vercel/blob'

interface ProviderOptions {
  accessToken: string
  pathname?: string
}

interface File {
  hash: string
  ext: string
  mime: string
  buffer?: Buffer
  stream?: ReadableStream
  url?: string
  provider_metadata?: {
    public_id: string
    resource_type: 'image' | 'video' | 'raw' | 'auto'
  }
}

interface BlobResponse {
  url: string
}

module.exports = {
  init(providerOptions: ProviderOptions) {
    if (!providerOptions.accessToken) {
      throw new Error('Access token is required')
    }

    const { accessToken, pathname = '' } = providerOptions

    const generateFileName = (file: File): string => {
      if (!file.hash || !file.ext) {
        throw new Error('File hash and extension are required')
      }
      return `${pathname ? pathname + '/' : ''}${Date.now()}-${file.hash}${
        file.ext
      }`
    }

    const handleUpload = async (
      file: File,
      data: Buffer | ReadableStream
    ): Promise<void> => {
      const fileName = generateFileName(file)

      const blob: BlobResponse = await put(fileName, data, {
        access: 'public',
        token: accessToken,
        contentType: file.mime,
      })

      file.url = blob.url
      file.provider_metadata = {
        public_id: fileName,
        resource_type: 'auto',
      }
    }

    return {
      async upload(file: File): Promise<void> {
        try {
          if (!file.buffer) {
            throw new Error('No buffer provided in file object')
          }
          await handleUpload(file, file.buffer)
        } catch (error) {
          throw new Error(`Failed to upload file: ${(error as Error).message}`)
        }
      },

      async uploadStream(file: File): Promise<void> {
        try {
          if (!file.stream) {
            throw new Error('No stream provided in file object')
          }
          await handleUpload(file, file.stream)
        } catch (error) {
          throw new Error(
            `Failed to upload stream: ${(error as Error).message}`
          )
        }
      },

      async delete(file: File): Promise<void> {
        try {
          if (!file.url) {
            throw new Error('No URL found in file metadata')
          }

          await del(file.url, {
            token: accessToken,
          })
        } catch (error) {
          throw new Error(`Failed to delete file: ${(error as Error).message}`)
        }
      },
    }
  },
}
