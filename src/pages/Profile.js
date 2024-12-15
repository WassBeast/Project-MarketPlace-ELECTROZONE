import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Layout2 from '../components/Layout2'; 
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { BsPencilSquare } from "react-icons/bs"; 
import { CgEnter } from "react-icons/cg"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";


const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const logouthandler = () => {
    auth.signOut();
    toast.success('Successfully Logged Out');
    navigate("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setFormData({
            name: userDoc.data().name || 'No name provided',
            email: currentUser.email
          });
        }
        fetchUserProducts(currentUser.email);
      } else {
        toast.error("You are not logged in!");
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchUserProducts = async (userEmail) => {
    try {
      const productCategories = ["Laptop", "Climatiseur", "TV"];
      let allProducts = [];
      for (const category of productCategories) {
        const q = query(
          collection(db, "Products"),
          where("userEmail", "==", userEmail),
          where("category", "==", category) // Filter by category within the Products collection
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          allProducts.push({ id: doc.id, ...doc.data(), category });
        });
      }
      setUserProducts(allProducts);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSave = async () => {
    const { name, email } = formData;

    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await setDoc(doc(db, "users", auth.currentUser.uid), { name, email }, { merge: true });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setFormData({
          name: userDoc.data().name || 'No name provided',
          email: auth.currentUser.email
        });
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleNavigateToCreateProduct = () => {
    navigate("/createproduct");
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'Products', productId))
      setUserProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    
    <Layout2>
      <Helmet>
        <title>User Profile - Manage Your Account | electrozone</title>
        <meta
          name="description"
          content="Manage your account, update your profile, view your products, and more on your user profile page at electrozone."
        />
        <meta
          name="keywords"
          content="user profile, manage account, update profile, view products, electrozone"
        />
        <meta name="robots" content="index, follow" />
        {/* Open Graph Tags */}
        <meta property="og:title" content="User Profile - Manage Your Account" />
        <meta
          property="og:description"
          content="Manage your profile, view products, and more on your user profile page at electrozone."
        />
        <meta property="og:image" content="URL of the image" />
        <meta property="og:url" content="https://www.yoursite.com/profile" />
        <link rel="canonical" href="https://www.yoursite.com/profile" />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": formData.name,
            "email": formData.email,
            "url": "https://www.yoursite.com/profile"
          })}
        </script>
      </Helmet>
      <div className="d-flex align-items-center justify-content-center w-100 mt-4">
        <div className="profile-card">
          <h4 className="form-title">Profile Details</h4>
          <div className="profile-content text-center mt-4">
            <p>
              <strong>Name:</strong> {isEditing ? (
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              ) : (
                formData.name
              )}
            </p>
            <p>
              <strong>Email:</strong> {isEditing ? (
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              ) : (
                formData.email
              )}
            </p>
          </div>
          <div className="button-container text-center">
            <button className="btn btn-primary mb-2" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
              {isEditing ? 'Save' : 'Edit'} <BsPencilSquare />
            </button>
            <button className="btn btn-primary mb-2" onClick={handleNavigateToCreateProduct}>
            Sell an item <CgEnter />
            </button>
            <button className="btn btn-secondary mb-2" onClick={() => setShowModal(true)}>View My Products</button>
            <button className="btn btn-danger" onClick={logouthandler}>Logout</button>
          </div>
        </div>

        {/* Modal for displaying products */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">My Products</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {userProducts.length > 0 ? (
                    <ul className="list-group">
                      {userProducts.map((product) => (
                        <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                style={{ width: '50px', height: '50px', marginRight: '15px' }}
                              />
                            )}
                            <span>{product.title}</span>
                          </div>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id, product.category)}>Delete</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No products added yet.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .profile-card {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            max-width: 100%;
          }

          .form-title {
            background-color: #fc0845;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            font-size: 1.5rem;
          }

          .form-control {
            border: 2px solid #fc0845;
            border-radius: 5px;
            padding: 10px;
          }

          .form-control:focus {
            border-color: #fc0845;
            box-shadow: 0 0 5px rgba(252, 8, 69, 0.2);
          }

          .btn-primary {
            background-color: #fc0845;
            border-color: #fc0845;
            font-size: 1.2rem;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }

          .btn-primary:hover {
            background-color: #e00d3b;
            border-color: #e00d3b;
          }

          .text-center {
            margin-top: 20px;
          }

          .text-center a {
            color: #fc0845;
            font-weight: bold;
          }

          .text-center a:hover {
            color: #e00d3b;
          }

          .button-container {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .modal-content {
            border-radius: 10px;
          }

          .modal-header {
            background-color: #fc0845;
            color: white;
            border-radius: 10px;
          }
        `}
      </style>
    </Layout2>
  );
};

export default Profile;
