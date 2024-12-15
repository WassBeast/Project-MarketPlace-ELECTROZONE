import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { db } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './LaptopPage.css';
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Helmet } from 'react-helmet';

const Laptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxQuantities, setMaxQuantities] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [maxPrice, setMaxPrice] = useState(1000); 
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const laptopCollection = query(collection(db, 'Products'), where('category', '==', 'Laptop'));
        const laptopSnapshot = await getDocs(laptopCollection);
        const laptopList = laptopSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setLaptops(laptopList);
        setFilteredLaptops(laptopList);

        // Find maximum price and set max quantities from database
        const max = laptopList.reduce((acc, laptop) => Math.max(acc, laptop.price), 0);
        setMaxPrice(max); 
        setPriceRange([0, max]); 
        
        const maxQuantitiesMap = {};
        laptopList.forEach((laptop) => {
          maxQuantitiesMap[laptop.id] = laptop.quantity; // quantity is max quantity in DB
        });
        setMaxQuantities(maxQuantitiesMap);

      } catch (error) {
        console.error("Error fetching laptops:", error);
      }
    };

    fetchLaptops();
  }, []);

  const handleFilterByPrice = (values) => {
    const [min, max] = values;
    setPriceRange([min, max]);

    const filtered = laptops.filter(laptop =>
      laptop.price >= min && laptop.price <= max
    );
    setFilteredLaptops(filtered);
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

  const handleAddToCart = async (laptop) => {
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
  
    try {
      // Reference to the specific Firestore document for the laptop
      const laptopRef = doc(db, 'Products', laptop.id);
      const laptopDoc = await getDoc(laptopRef);
  
      // Fetch the maximum quantity available
      const maxQuantity = laptopDoc.exists() ? laptopDoc.data().quantity : 0;
  
      // Add maxQuantity to the item being added to the cart
      const itemToAdd = { ...laptop, quantity: quantities[laptop.id] || 1, maxQuantity };
  
      // Check if the item is already in the cart
      const existingItem = cartItemsFromStorage.find(item => item.id === laptop.id);
  
      if (!existingItem) {
        const updatedCartItems = [...cartItemsFromStorage, itemToAdd];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        toast.success("Product added to shopping cart");
      } else {
        toast.info("Product is already in the cart");
      }
    } catch (error) {
      console.error("Error fetching laptop document:", error);
      toast.error("Failed to add product to cart");
    }
  };

  // Add structured data (JSON-LD) for SEO
 
    const generateStructuredData = () => {
      const structuredData = filteredLaptops.map(laptop => ({
        "@context": "http://schema.org",
        "@type": "Product",
        "name": laptop.title,
        "image": laptop.imageUrl,
        "description": laptop.description,
        "sku": laptop.id,
        "offers": {
          "@type": "Offer",
          "url": `/laptop/${laptop.id}`,
          "priceCurrency": "TND",
          "price": laptop.price,
          "itemCondition": "http://schema.org/NewCondition",
          "availability": laptop.quantity > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
        }
      }));

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

  return (
    <>
      <head>
      <Helmet>
    <title>Shop Laptops Online - Best Deals on Laptops | electrozone</title>
    <meta
      name="description"
      content="Browse our wide selection of laptops for work, gaming, and personal use. Find the best deals on top brands like Dell, HP, Lenovo, and more."
    />
    <meta
      name="keywords"
      content="Laptop, Notebook, Gaming Laptop, Work Laptop, Electronics, Best Laptop deals"
    />
    <meta name="robots" content="index, follow" />
    {/* Open Graph Tags */}
    <meta property="og:title" content="Shop Laptops - Best Deals on Laptops" />
    <meta
      property="og:description"
      content="Find the best laptops for work, gaming, and more. Get amazing deals on popular laptop brands and enjoy premium performance and features."
    />
    <meta property="og:image" content="https://www.yoursite.com/assets/images/laptop.png" />
    <meta property="og:url" content="https://www.yoursite.com/Laptop" />
    <link rel="canonical" href="https://www.yoursite.com/Laptop" />
    {/* Structured Data */}
    <script type="application/ld+json">
      {JSON.stringify(generateStructuredData())}
    </script>
  </Helmet>
      </head>
      <div className="laptop-container">
        <h1 className="laptop-title">Laptops</h1>
        
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
            ariaValuetext={state => `Price: ${state.valueNow}`}
          />
          <div className="price-range-display">
            <span>${priceRange[0]}</span> - <span>${priceRange[1]}</span>
          </div>
        </div>
        
        {filteredLaptops.length === 0 ? (
          <p>No laptops found.</p>
        ) : (
          <ul className="laptop-list">
            {filteredLaptops.map((laptop) => (
              <li key={laptop.id} className="laptop-item">
                <div className="laptop-image-container">
                  {laptop.imageUrl ? (
                    <img src={laptop.imageUrl} alt={`Laptop ${laptop.title}`} className="laptop-image" />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="laptop-info">
                  <h2>{laptop.title}</h2>
                  <p>{laptop.description}</p>
                  <p className="laptop-price">Price: {laptop.price} DT</p>
                  <div className="quantity-control">
                    <button className="quantity-button" onClick={() => handleDecrement(laptop.id)}>-</button>
                    <input type="number" value={quantities[laptop.id] || 1} readOnly className="quantity-input" />
                    <button className="quantity-button" onClick={() => handleIncrement(laptop.id)}>+</button>
                  </div>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(laptop)}>Add to Cart</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Laptop;
