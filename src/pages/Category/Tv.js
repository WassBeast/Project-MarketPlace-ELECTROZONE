import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { db } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Helmet } from 'react-helmet'; // Import react-helmet for SEO management
import './LaptopPage.css'; 
import { toast } from 'react-toastify';

const TV = () => {
  const [tvs, setTvs] = useState([]);
  const [filteredTvs, setFilteredTvs] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxQuantities, setMaxQuantities] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchTvs = async () => {
      try {
        const tvCollection = query(
          collection(db, 'Products'),
          where('category', '==', 'TV')
        );

        const tvSnapshot = await getDocs(tvCollection);
        const tvList = tvSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTvs(tvList);
        setFilteredTvs(tvList);

        const max = tvList.reduce((acc, tv) => Math.max(acc, tv.price), 0);
        setMaxPrice(max);
        setPriceRange([0, max]);

        const maxQuantitiesMap = {};
        tvList.forEach((tv) => {
          maxQuantitiesMap[tv.id] = tv.quantity;
        });
        setMaxQuantities(maxQuantitiesMap);
      } catch (error) {
        console.error('Error fetching TVs:', error);
      }
    };

    fetchTvs();
  }, []);

  const handleFilterByPrice = (values) => {
    const [min, max] = values;
    setPriceRange([min, max]);

    const filtered = tvs.filter(
      (tv) => tv.price >= min && tv.price <= max
    );
    setFilteredTvs(filtered);
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1;
      const maxQuantity = maxQuantities[id] || Infinity;
      return {
        ...prev,
        [id]: Math.min(currentQuantity + 1, maxQuantity),
      };
    });
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const handleAddToCart = async (tv) => {
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

    try {
      const tvRef = doc(db, 'Products', tv.id);
      const tvDoc = await getDoc(tvRef);

      const maxQuantity = tvDoc.exists() ? tvDoc.data().quantity : 0;

      const itemToAdd = { ...tv, quantity: quantities[tv.id] || 1, maxQuantity };

      const existingItem = cartItemsFromStorage.find((item) => item.id === tv.id);

      if (!existingItem) {
        const updatedCartItems = [...cartItemsFromStorage, itemToAdd];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        toast.success('Product added to shopping cart');
      } else {
        toast.info('Product is already in the cart');
      }
    } catch (error) {
      console.error('Error fetching TV document:', error);
      toast.error('Failed to add product to cart');
    }
  };

  // Structured Data
  const generateStructuredData = () => {
    return filteredTvs.map(tv => ({
      "@context": "http://schema.org",
      "@type": "Product",
      "name": tv.title,
      "image": tv.imageUrl,
      "description": tv.description,
      "sku": tv.id,
      "offers": {
        "@type": "Offer",
        "url": `/tv/${tv.id}`,
        "priceCurrency": "TND",
        "price": tv.price,
        "itemCondition": "http://schema.org/NewCondition",
        "availability": tv.quantity > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
      }
    }));
  };

  return (
    <div className="laptop-container">
      {/* SEO Meta Tags */}
      <Helmet>
    <title>Smart TVs for Sale - Shop the Best TVs Online | electrozone</title>
    <meta
      name="description"
      content="Explore our collection of smart TVs. Find the best deals on top-rated TVs from popular brands. Upgrade your viewing experience today."
    />
    <meta
      name="keywords"
      content="Smart TV, TV, LED TV, OLED TV, Electronics, Best TV prices, TV deals"
    />
    <meta name="robots" content="index, follow" />
    {/* Open Graph Tags */}
    <meta property="og:title" content="Shop Smart TVs - Best Deals on TVs" />
    <meta
      property="og:description"
      content="Shop for the best smart TVs. Get amazing deals on popular brands and enjoy premium viewing experiences."
    />
    <meta property="og:image" content="https://www.yoursite.com/assets/images/tv1.png" />
    <meta property="og:url" content="https://www.yoursite.com/Tv" />
    <link rel="canonical" href="https://www.yoursite.com/Tv" />
    {/* Structured Data */}
    <script type="application/ld+json">
      {JSON.stringify(generateStructuredData())}
    </script>
  </Helmet>

      <h1 className="laptop-title">TVs</h1>

      <div className="price-slider-container">
        <h2>Filter by Price</h2>
        <ReactSlider
          className="price-slider"
          thumbClassName="price-slider-thumb"
          trackClassName="price-slider-track"
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={handleFilterByPrice}
          ariaLabel={['Min Price', 'Max Price']}
          ariaValuetext={(state) => `Price: ${state.valueNow}`}
        />
        <div className="price-range-display">
          <span>${priceRange[0]}</span> - <span>${priceRange[1]}</span>
        </div>
      </div>

      {filteredTvs.length === 0 ? (
        <p>No TVs found.</p>
      ) : (
        <ul className="laptop-list">
          {filteredTvs.map((tv) => (
            <li key={tv.id} className="laptop-item">
              <div className="laptop-image-container">
                {tv.imageUrl ? (
                  <img
                    src={tv.imageUrl}
                    alt={`Buy ${tv.title} online - Top TV brands`}
                    className="laptop-image"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="laptop-info">
                <h2>{tv.title}</h2>
                <p>{tv.description}</p>
                <p className="laptop-price">Price: {tv.price} DT</p>
                <div className="quantity-control">
                  <button
                    className="quantity-button"
                    onClick={() => handleDecrement(tv.id)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantities[tv.id] || 1}
                    readOnly
                    className="quantity-input"
                  />
                  <button
                    className="quantity-button"
                    onClick={() => handleIncrement(tv.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(tv)}
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TV;
