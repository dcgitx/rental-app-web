import { ref } from 'vue'

export function useImageResizer({ maxWidth = 400, maxHeight = 400, quality = 0.8 }) {
  const previewImages = ref([])
  const resizedFiles = ref([])

  async function resizeImages(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')

          let width = img.width
          let height = img.height
          const aspect = width / height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              width = maxWidth
              height = maxWidth / aspect
            } else {
              height = maxHeight
              width = maxHeight * aspect
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject('Failed to create blob.')

              const resizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now(),
              })

              const preview = URL.createObjectURL(resizedFile)

              resizedFiles.value = [resizedFile]
              previewImages.value = [preview]

              // Resolve here, when both are ready
              resolve({ file: resizedFile, preview })
            },
            'image/webp',
            quality,
          )
        }

        img.onerror = reject
        img.src = e.target.result
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return { resizeImages, previewImages, resizedFiles }
}
