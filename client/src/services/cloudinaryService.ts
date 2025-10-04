// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  eager?: Array<{
    transformation: string;
    width: number;
    height: number;
    url: string;
    secure_url: string;
  }>;
}

export interface CloudinaryError {
  message: string;
  name: string;
  http_code: number;
}

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = CLOUDINARY_UPLOAD_PRESET;

    if (!this.cloudName || !this.uploadPreset) {
      console.warn('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file');
    }
  }

  /**
   * Upload an image file to Cloudinary
   * @param file - The image file to upload
   * @param folder - Optional folder to organize uploads
   * @param transformation - Optional transformation parameters
   * @returns Promise<CloudinaryUploadResponse>
   */
  async uploadImage(
    file: File,
    folder?: string,
    transformation?: string
  ): Promise<CloudinaryUploadResponse> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    
    if (folder) {
      formData.append('folder', folder);
    }

    if (transformation) {
      formData.append('transformation', transformation);
    }

    // Add tags for better organization
    formData.append('tags', 'z-challenge,profile-picture');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result: CloudinaryUploadResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns Promise<void>
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!this.cloudName) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Note: For security reasons, image deletion typically requires backend implementation
    // with API key and secret. This is a placeholder for the frontend.
    console.warn('Image deletion should be implemented on the backend for security');
    
    // In a real implementation, you would call your backend API endpoint
    // that handles Cloudinary deletion with proper authentication
    throw new Error('Image deletion must be implemented on the backend');
  }

  /**
   * Generate optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Transformation parameters
   * @returns string - Optimized image URL
   */
  getOptimizedImageUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
      quality?: 'auto' | number;
      format?: 'auto' | 'jpg' | 'png' | 'webp';
      radius?: number | 'max';
    } = {}
  ): string {
    if (!this.cloudName) {
      return '';
    }

    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      radius
    } = transformations;

    let transformationString = '';
    const params: string[] = [];

    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    if (crop) params.push(`c_${crop}`);
    if (quality) params.push(`q_${quality}`);
    if (format) params.push(`f_${format}`);
    if (radius !== undefined) params.push(`r_${radius}`);

    if (params.length > 0) {
      transformationString = params.join(',') + '/';
    }

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformationString}${publicId}`;
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary image URL
   * @returns string - Public ID
   */
  extractPublicId(url: string): string {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return '';
      
      // Skip transformation parameters and get the public ID
      let publicIdParts = urlParts.slice(uploadIndex + 1);
      
      // Remove transformation parameters (they start with w_, h_, c_, etc.)
      while (publicIdParts.length > 0 && publicIdParts[0].includes('_')) {
        publicIdParts.shift();
      }
      
      // Join the remaining parts and remove file extension
      const publicIdWithExtension = publicIdParts.join('/');
      const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
      
      return lastDotIndex > 0 
        ? publicIdWithExtension.substring(0, lastDotIndex)
        : publicIdWithExtension;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return '';
    }
  }

  /**
   * Check if Cloudinary is properly configured
   * @returns boolean
   */
  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset);
  }
}

export const cloudinaryService = new CloudinaryService();