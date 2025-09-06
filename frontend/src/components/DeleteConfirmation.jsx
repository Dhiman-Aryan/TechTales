import React from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-dark mb-4">Confirm Deletion</h3>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the post "{title}"? This action cannot be undone.
        </p>
        
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;