import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import './ShoppingPage.css';
import { Helmet } from 'react-helmet';

const Shopping = () => {
  const navigate = useNavigate();
  const [panierItems, setPanierItems] = useState([]);
  const [quantities, setQuantities] = useState({});
 

  const syncPanierItems = (updatedQuantities) => {
    const updatedItems = panierItems.map((item) => ({
      ...item,
      quantity: updatedQuantities[item.id] || 1,
    }));
  
    setPanierItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Update localStorage
  };

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setPanierItems(savedItems);
    
    const initialQuantities = {};
    savedItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1; 
    });
    
    setQuantities(initialQuantities);
  }, []);

  const handleIncrement = (id) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id] || 1;
      const item = panierItems.find(item => item.id === id);
      const maxQuantity = item ? item.maxQuantity : Infinity;  // Get maxQuantity from the item in the cart
  
      if (currentQuantity < maxQuantity) {
        const updatedQuantities = {
          ...prevQuantities,
          [id]: currentQuantity + 1,
        };
        syncPanierItems(updatedQuantities); // Sync updated quantities
        return updatedQuantities;
      } else {
        toast.info('Maximum quantity reached for this product.');
        return prevQuantities;
      }
    });
  };

  const handleDecrement = (id) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id] || 1;

      if (currentQuantity > 1) {
        const updatedQuantities = {
          ...prevQuantities,
          [id]: currentQuantity - 1,
        };
        syncPanierItems(updatedQuantities); // Sync updated quantities
        return updatedQuantities;
      } else {
        toast.info('Quantity cannot be less than 1.');
        return prevQuantities;
      }
    });
  };

  const handleDelete = (itemId) => {
    // Remove item from panierItems and quantities
    const updatedItems = panierItems.filter((item) => item.id !== itemId);
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[itemId];
  
    // Update state and localStorage
    setPanierItems(updatedItems);
    setQuantities(updatedQuantities);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Update localStorage
    toast.success('Item removed from cart');
  };

  const handleOrder = () => {
    const auth = getAuth(); // Get Firebase authentication instance
    const currentUser = auth.currentUser; // Check if the user is logged in
    if (!currentUser) 
      toast.error('You need to sign in to search!');
    else{
      const updatedPanierItems = panierItems.map((item) => ({
        ...item,
        quantity: quantities[item.id] || 1,
      }));

      setPanierItems(updatedPanierItems);
      sessionStorage.setItem('cartItems', JSON.stringify(updatedPanierItems)); // Save final state
      navigate('/address');
    }
  };

  const totalPrice = panierItems.reduce(
    (total, item) => total + item.price * (quantities[item.id] || 1),
    0
  );

  return (
    <>
      {/* SEO meta tags */}
      <head>
      <Helmet>
  <title>Your Shopping Cart - Shop for Products Online | Electrozone</title>
  <meta
    name="description"
    content="View, manage, and customize your shopping cart at Electrozone. Add, remove, or adjust quantities before placing your order for top products at unbeatable prices."
  />
  <meta
    name="keywords"
    content="shopping cart, online shopping, manage cart, shop online, products, checkout, Electrozone"
  />
  <meta name="robots" content="index, follow" />
  {/* Open Graph Tags */}
  <meta property="og:title" content="Your Shopping Cart - Shop Now" />
  <meta
    property="og:description"
    content="View and manage items in your cart, and enjoy great deals on products. Easy checkout for a seamless shopping experience."
  />
  <meta property="og:image" content="URL of the image" />
  <meta property="og:url" content="https://www.yoursite.com/cart" />
  <link rel="canonical" href="https://www.yoursite.com/cart" />

  {/* Structured Data for Shopping Cart */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ShoppingCart",
      "name": "Electrozone Shopping Cart",
      "description": "Your shopping cart at Electrozone with all the items you've added, ready to check out.",
      "url": "https://www.yoursite.com/cart",
      "image": "URL of the image",
      "totalPrice": "PRICE_PLACEHOLDER",  // This can be dynamically set based on the cart's total
      "itemListElement": [
        // Example for adding products, you would dynamically fill this list based on the cart items
        {
          "@type": "Product",
          "name": "Product Name",
          "url": "https://www.yoursite.com/product/1",
          "price": "PRODUCT_PRICE",
          "quantity": "QUANTITY",
          "image": "PRODUCT_IMAGE_URL"
        },
        // More products here
      ]
    })}
  </script>
</Helmet>

      </head>

      <div className="shopping-container">
        <h1 className="shopping-title">Your Shopping Cart</h1>

        {panierItems.length === 0 ? (
          <p>No items in your cart.</p>
        ) : (
          <>
           

            <ul className="shopping-list">
              {panierItems.map((item) => (
                <li key={item.id} className="shopping-item">
                  <div className="shopping-image-container">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={`Image of ${item.title}`}
                        className="shopping-image"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                  <div className="shopping-info">
                    <h2>{item.title}</h2>
                    <p className="shopping-price">Price: {item.price} DT</p>
                  </div>
                  <div className="quantity-control">
                    <button
                      className="quantity-button"
                      onClick={() => handleDecrement(item.id)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[item.id] || 1}
                      readOnly
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button"
                      onClick={() => handleIncrement(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            <h2 className="total-price">Total Price: {totalPrice.toFixed(2)} DT</h2>
            <button onClick={handleOrder} className="order-button">
              🛒 Place Order
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Shopping;
