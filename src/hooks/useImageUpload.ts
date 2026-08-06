import { useState, ChangeEvent } from 'react';

export const useImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set local temporary preview for immediate visual feedback
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setIsUploading(true);

      // Prepare form data upload
      const formData = new FormData();
      formData.append('file', file);

      // Resolve base API URL dynamically (localhost:5000 locally, relative on Vercel prod)
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

      try {
        const response = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // Update previewUrl to backend/Cloudinary url
          setPreviewUrl(data.url);
          console.log('Image successfully uploaded & synchronized:', data.url);
        } else {
          console.error('File upload failed on server');
          alert('Gagal mengunggah gambar ke server.');
        }
      } catch (error) {
        console.error('Error uploading image to server:', error);
        alert('Gagal menghubungi server upload. Gambar menggunakan pratinjau lokal.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const clearImage = () => setPreviewUrl(null);

  return { previewUrl, handleImageChange, clearImage, setPreviewUrl, isUploading };
};
