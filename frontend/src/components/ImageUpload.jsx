// import React, { useState } from 'react';
// import { postsAPI } from '../services/api';

// const ImageUpload = ({ onImageUploaded, currentImage }) => {
//   const [uploading, setUploading] = useState(false);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
    
//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await postsAPI.uploadImage(formData);
//       onImageUploaded(response.data.imageUrl);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Image upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Featured Image
//       </label>
      
//       {currentImage && (
//         <div className="mb-3">
//           <img 
//             src={currentImage} 
//             alt="Preview" 
//             className="w-full h-48 object-cover rounded-lg mb-2"
//           />
//         </div>
//       )}
      
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         disabled={uploading}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//       />
      
//       {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
//     </div>
//   );
// };

// export default ImageUpload;

// components/ImageUpload.jsx
// import React, { useState, useRef } from 'react';
// import { postsAPI } from '../services/api';

// const ImageUpload = ({ onImageUploaded, currentImage }) => {
//   const [uploading, setUploading] = useState(false);
//   const [preview, setPreview] = useState(currentImage || '');
//   const fileInputRef = useRef(null);

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file (JPEG, PNG, GIF, etc.)');
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreview(e.target.result);
//     };
//     reader.readAsDataURL(file);

//     // Upload the image
//     uploadImage(file);
//   };

//   const uploadImage = async (file) => {
//     setUploading(true);
    
//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await postsAPI.uploadImage(formData);
//       // Assuming your API returns { imageUrl: 'url' } or similar
//       const imageUrl = response.data.imageUrl || response.data.url;
//       onImageUploaded(imageUrl);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Image upload failed. Please try again.');
//       setPreview(''); // Clear preview on error
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemoveImage = () => {
//     setPreview('');
//     onImageUploaded('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleClickUpload = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="mb-6">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Featured Image
//       </label>

//       {preview ? (
//         <div className="relative mb-3">
//           <img 
//             src={preview} 
//             alt="Preview" 
//             className="w-full h-64 object-cover rounded-lg border"
//           />
//           {!uploading && (
//             <button
//               type="button"
//               onClick={handleRemoveImage}
//               className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           )}
//         </div>
//       ) : (
//         <div
//           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
//           onClick={handleClickUpload}
//         >
//           <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//           <p className="text-gray-600">Click to upload an image</p>
//           <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
//         </div>
//       )}

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleImageSelect}
//         disabled={uploading}
//         className="hidden"
//       />
      
//       {uploading && (
//         <div className="mt-2 flex items-center text-sm text-gray-500">
//           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Uploading...
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;




import React, { useState, useRef } from 'react';
import { postsAPI } from '../services/api';

const ImageUpload = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload the image
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setUploadError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('🔄 Starting image upload...');
      const response = await postsAPI.uploadImage(formData);
      
      // Handle different response formats
      const imageUrl = response.data?.imageUrl || 
                       response.data?.url || 
                       response.data?.image;

      if (imageUrl) {
        console.log('✅ Image uploaded successfully:', imageUrl);
        onImageUploaded(imageUrl);
      } else {
        // If no URL returned, use base64 fallback
        console.log('⚠️ No image URL returned, using base64 fallback');
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        onImageUploaded(base64Image);
      }
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Use base64 as fallback
      try {
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        
        setUploadError('Upload failed. Using local image reference.');
        onImageUploaded(base64Image);
        
      } catch (fallbackError) {
        setUploadError('Image processing failed. Please try a different image.');
        setPreview('');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setUploadError('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>

      {preview ? (
        <div className="relative mb-3">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg border"
          />
          {!uploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
          onClick={handleClickUpload}
        >
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">Click to upload an image</p>
          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        disabled={uploading}
        className="hidden"
      />
      
      {uploading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </div>
      )}

      {uploadError && (
        <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          ⚠️ {uploadError}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Image will be stored with your post even if upload fails.
      </p>
    </div>
  );
};

export default ImageUpload;