// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SearchBar = () => {
//   const [query, setQuery] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//       setIsOpen(false);
//       setQuery('');
//     }
//   };

//   return (
//     <div className="relative">
//       <form onSubmit={handleSubmit} className="flex">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search articles..."
//           className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-48"
//         />
//         <button
//           type="submit"
//           className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
//         >
//           <i className="fas fa-search"></i>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SearchBar;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('🔍 Searching for:', query.trim());
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-48"
        />
        <button
          type="submit"
          className="bg-blue-400 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
          title="Search articles"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;