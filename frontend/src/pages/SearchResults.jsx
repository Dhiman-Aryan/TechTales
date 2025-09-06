


import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { postsAPI } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allPosts, setAllPosts] = useState([]);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';


  useEffect(() => {
    const loadAllPosts = async () => {
      try {
        setLoading(true);
        console.log('📦 Loading all posts for client-side search...');
        
        const response = await postsAPI.getAll();
        const posts = response.data.posts || response.data || [];
        console.log('✅ Loaded posts:', posts.length);
        
        setAllPosts(posts);
      } catch (error) {
        console.error('❌ Error loading posts:', error);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();
  }, []);


  useEffect(() => {
    if (allPosts.length === 0) return; 

    console.log('🔍 Performing client-side search with:', {
      query,
      category,
      author,
      totalPosts: allPosts.length
    });

    const performSearch = () => {
      try {
        let filteredPosts = allPosts;

        
        if (query) {
          const searchTerm = query.toLowerCase();
          filteredPosts = filteredPosts.filter(post =>
            (post.title && post.title.toLowerCase().includes(searchTerm)) ||
            (post.content && post.content.toLowerCase().includes(searchTerm)) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) ||
            (post.tags && Array.isArray(post.tags) && post.tags.some(tag =>
              tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
            ))
          );
        }

        
        if (category) {
          const categoryTerm = category.toLowerCase();
          filteredPosts = filteredPosts.filter(post =>
            post.category && post.category.toLowerCase() === categoryTerm
          );
        }

        
        if (author) {
          const authorTerm = author.toLowerCase();
          filteredPosts = filteredPosts.filter(post =>
            post.author && 
            ((post.author.username && post.author.username.toLowerCase() === authorTerm) ||
             (post.author.name && post.author.name.toLowerCase() === authorTerm))
          );
        }

        console.log('✅ Search results:', filteredPosts.length);
        setResults(filteredPosts);
        setError(''); 

      } catch (searchError) {
        console.error('❌ Search error:', searchError);
        setError('Search failed. Please try again.');
        setResults([]);
      }
    };

    performSearch();
  }, [query, category, author, allPosts]); 

  const hasFilters = query || category || author;

  if (loading && allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-4">Search Results</h1>
        
        {hasFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              {results.length} result{results.length !== 1 ? 's' : ''} found for:
              {query && <span className="font-semibold ml-2">"{query}"</span>}
              {category && <span className="ml-2">in {category}</span>}
              {author && <span className="ml-2">by {author}</span>}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              🔍 Searching through {allPosts.length} posts locally
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-gray-600 mb-4">
            {hasFilters ? 'No results found' : 'Search for articles'}
          </h2>
          <p className="text-gray-500 mb-4">
            {hasFilters 
              ? `No posts found matching your search criteria. Try different keywords.` 
              : 'Use the search bar to find posts by title, content, or tags.'
            }
          </p>
          <div className="space-y-2">
            <Link to="/articles" className="text-primary hover:underline block">
              Browse All Articles
            </Link>
            {hasFilters && (
              <button
                onClick={() => window.location.href = '/search'} 
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {results.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          
          {results.length > 12 && (
            <div className="text-center text-gray-600">
              <p>Showing all {results.length} results</p>
            </div>
          )}
        </>
      )}

      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Info</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Total Posts: {allPosts.length}</p>
            <p>Search Query: "{query}"</p>
            <p>Category: {category || 'None'}</p>
            <p>Author: {author || 'None'}</p>
            <p>Results: {results.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;