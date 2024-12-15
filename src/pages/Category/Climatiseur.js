import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { db } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './LaptopPage.css'; 
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';



const Climatiseur = () => {
  const [climatiseurs, setClimatiseurs] = useState([]);
  const [filteredClimatiseurs, setFilteredClimatiseurs] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxQuantities, setMaxQuantities] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchClimatiseurs = async () => {
      try {
        const climatiseurCollection = query(
          collection(db, 'Products'),
          where('category', '==', 'Climatiseur')
        );

        const climatiseurSnapshot = await getDocs(climatiseurCollection);
        const climatiseurList = climatiseurSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClimatiseurs(climatiseurList);
        setFilteredClimatiseurs(climatiseurList);

        const max = climatiseurList.reduce((acc, climatiseur) => Math.max(acc, climatiseur.price), 0);
        setMaxPrice(max);
        setPriceRange([0, max]);

        const maxQuantitiesMap = {};
        climatiseurList.forEach((climatiseur) => {
          maxQuantitiesMap[climatiseur.id] = climatiseur.quantity;
        });
        setMaxQuantities(maxQuantitiesMap);
      } catch (error) {
        console.error('Error fetching climatiseurs:', error);
      }
    };

    fetchClimatiseurs();
  }, []);

  const handleFilterByPrice = (values) => {
    const [min, max] = values;
    setPriceRange([min, max]);

    const filtered = climatiseurs.filter(
      (climatiseur) => climatiseur.price >= min && climatiseur.price <= max
    );
    setFilteredClimatiseurs(filtered);
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

  const handleAddToCart = async (climatiseur) => {
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems')) || [];

    try {
      const climatiseurRef = doc(db, 'Products', climatiseur.id);
      const climatiseurDoc = await getDoc(climatiseurRef);

      const maxQuantity = climatiseurDoc.exists() ? climatiseurDoc.data().quantity : 0;

      const itemToAdd = { ...climatiseur, quantity: quantities[climatiseur.id] || 1, maxQuantity };

      const existingItem = cartItemsFromStorage.find((item) => item.id === climatiseur.id);

      if (!existingItem) {
        const updatedCartItems = [...cartItemsFromStorage, itemToAdd];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        toast.success('Product added to shopping cart');
      } else {
        toast.info('Product is already in the cart');
      }
    } catch (error) {
      console.error('Error fetching climatiseur document:', error);
      toast.error('Failed to add product to cart');
    }
  };

 // Add structured data (JSON-LD) for SEO
 const generateStructuredData = () => {
  return filteredClimatiseurs.map((climatiseur) => ({
    "@context": "http://schema.org",
    "@type": "Product",
    "name": climatiseur.title,
    "image": climatiseur.imageUrl,
    "description": climatiseur.description,
    "sku": climatiseur.id,
    "offers": {
      "@type": "Offer",
      "url": `/climatiseur/${climatiseur.id}`,
      "priceCurrency": "TND",
      "price": climatiseur.price,
      "itemCondition": "http://schema.org/NewCondition",
      "availability": climatiseur.quantity > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
    }
  }));
};
  return (
    <>
      <head>
      <Helmet>
    <title>Shop Air Conditioners Online - Best Deals on Climatiseurs | electrozone</title>
    <meta
      name="description"
      content="Explore our collection of air conditioners (climatiseurs) for home and office use. Find the best deals on high-efficiency models and stay cool this summer."
    />
    <meta
      name="keywords"
      content="Air Conditioner, Climatiseur, Cooling System, AC, HVAC, Home Appliances, Best AC prices"
    />
    <meta name="robots" content="index, follow" />
    {/* Open Graph Tags */}
    <meta property="og:title" content="Shop Air Conditioners - Best Deals on Climatiseurs" />
    <meta
      property="og:description"
      content="Shop for the best air conditioners. Get great deals on popular brands and enjoy the ultimate cooling experience in your home or office."
    />
    <meta property="og:image" content="https://www.yoursite.com/assets/images/cl3.png" />
    <meta property="og:url" content="https://www.yoursite.com/Climatiseur" />
    <link rel="canonical" href="https://www.yoursite.com/Climatiseur" />
    {/* Structured Data */}
    <script type="application/ld+json">
      {JSON.stringify(generateStructuredData())}
    </script>
  </Helmet>
      </head>
      <div className="laptop-container">
        <h1 className="laptop-title">Climatiseurs</h1>

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

        {filteredClimatiseurs.length === 0 ? (
          <p>No climatiseurs found.</p>
        ) : (
          <ul className="laptop-list">
            {filteredClimatiseurs.map((climatiseur) => (
              <li key={climatiseur.id} className="laptop-item">
                <div className="laptop-image-container">
                  {climatiseur.imageUrl ? (
                    <img
                      src={climatiseur.imageUrl}
                      alt={`Climatiseur ${climatiseur.title}`} // SEO-friendly alt text
                      className="laptop-image"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="laptop-info">
                  <h3>{climatiseur.title}</h3> {/* Use h3 for product titles */}
                  <p>{climatiseur.description}</p>
                  <p className="laptop-price">Price: {climatiseur.price} DT</p>
                  <div className="quantity-control">
                    <button
                      className="quantity-button"
                      onClick={() => handleDecrement(climatiseur.id)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[climatiseur.id] || 1}
                      readOnly
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button"
                      onClick={() => handleIncrement(climatiseur.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(climatiseur)}
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Climatiseur;
