import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import './SearchResult.css'; // Assuming you have similar styling
import { Helmet } from 'react-helmet';

const SearchResult = () => {
  const { searchQuery } = useParams(); // Extract the search query from the URL
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Create a query to get all products from Firestore
        const productsRef = collection(db, 'Products');
        const querySnapshot = await getDocs(productsRef);

        // Filter the products based on whether the search query matches the full phrase in the title or description
        const filteredProducts = querySnapshot.docs
          .map(doc => {
            const product = doc.data();
            const titleLower = product.title.toLowerCase();
            const descriptionLower = product.description.toLowerCase();
            const queryLower = searchQuery.toLowerCase();

            // Check if the search query exists as a whole phrase in the title or description
            const isMatch =
              titleLower.includes(queryLower) || // Check if the entire query is in the title
              descriptionLower.includes(queryLower); // Check if the entire query is in the description

            if (isMatch) {
              return { id: doc.id, ...product };
            }
            return null;
          })
          .filter(product => product !== null); // Remove null values

        setSearchResults(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (loading) {
    return <p>Loading results...</p>;
  }

  return (
    <>
      {/* SEO meta tags */}
      <head>
        <Helmet>
        <title>Search Results for "{searchQuery}" - [electrozone]</title>
        <meta name="description" content={`Browse through our search results for "${searchQuery}" and find the best deals on products.`} />
        <meta property="og:title" content={`Search Results for "${searchQuery}" - [electrozone]`} />
        <meta property="og:description" content={`Browse through our search results for "${searchQuery}" and find the best deals on products.`} />
        <meta property="og:image" content="URL of an image representing your store" />
        <meta property="og:url" content={`https://www.yoursite.com/search/${searchQuery}`} />
        <link rel="canonical" href={`https://www.yoursite.com/search/${searchQuery}`} />
        </Helmet>
      </head>

      <div className="search-results-container">
        <h1>Search Results for "{searchQuery}"</h1>
        {searchResults.length === 0 ? (
          <p>No products found matching "{searchQuery}"</p>
        ) : (
          <ul className="search-results-list">
            {searchResults.map((product) => (
              <li key={product.id} className="product-item">
                <div className="product-image-container">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="product-image" />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="product-info">
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <p className="product-price">Price: {product.price} DT</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchResult;
