import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import './ProductForm.css'; 
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { Helmet } from 'react-helmet';

const storage = getStorage();

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // Declare imageUrl in state
  const [userEmail, setUserEmail] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email);
      } else {
        toast.error("Please log in to add a product.");
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = '';
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      uploadedImageUrl = await getDownloadURL(storageRef);
      setImageUrl(uploadedImageUrl); // Set the imageUrl state after upload
    }

    const product = {
      title,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl: uploadedImageUrl,
      userEmail
    };

    try {
      if (category) {
        await addDoc(collection(db, 'Products'), product); 
        toast.success("Product created successfully!");
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setImage(null);
        setImageUrl(''); // Reset imageUrl after product creation
        navigate(`/${category}`);
      } else {
        console.error('Category is undefined. Cannot add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Error adding product. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <Helmet>
        <title>Create New Product - Electrozone</title>
        <meta
          name="description"
          content="Add your product to Electrozone and get it listed for thousands of customers to see. Manage your inventory and boost sales."
        />
        <meta
          name="keywords"
          content="add product, create product, electrozone, sell products online"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Create a New Product on Electrozone" />
        <meta
          property="og:description"
          content="Add your product to Electrozone and get it listed for thousands of customers to see. Manage your inventory and boost sales."
        />
        <meta property="og:image" content={imageUrl || 'URL of a default image'} />
        <meta property="og:url" content="https://www.yoursite.com/createproduct" />
        <link rel="canonical" href="https://www.yoursite.com/createproduct" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": description,
            "category": category,
            "price": price,
            "quantity": quantity,
            "image": imageUrl || 'URL of a default image',
            "url": "https://www.yoursite.com/createproduct"
          })}
        </script>
      </Helmet>

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Add a New Product</h2>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="Laptop"
                checked={category === 'Laptop'}
                onChange={(e) => setCategory(e.target.value)}
              />
              Laptop
            </label>
            <label>
              <input
                type="radio"
                value="Climatiseur"
                checked={category === 'Climatiseur'}
                onChange={(e) => setCategory(e.target.value)}
              />
              Climatiseur
            </label>
            <label>
              <input
                type="radio"
                value="TV"
                checked={category === 'TV'}
                onChange={(e) => setCategory(e.target.value)}
              />
              TV
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required min={0}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required min={1}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
