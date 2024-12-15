import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Helmet } from "react-helmet"; // Import Helmet for SEO management

// Import Layout2 from the correct path
import Layout2 from '../components/Layout2'; 

import { toast } from "react-toastify"; // Import toast for notifications

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (email === 'admin@admin.com' && password === '123456') 
      navigate("/admin"); // Redirect to admin page
    else{
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login Successful!"); // Show success notification 
        navigate("/"); // Redirect to home or desired page
      } catch (error) {
        toast.error("Login Failed! Please check your credentials."); // Show error notification
        console.log(error);
      }
    }
  };

  return (
    <>
      {/* SEO Meta tags */}
      <head>
      <Helmet>
        <title>Sign In - Access Your Account | electrozone</title>
        <meta name="description" content="Sign in to your account to access personalized services and manage your settings on electrozone." />
        <meta name="robots" content="noindex, nofollow" /> {/* Prevent indexing if the page is login specific */}
        <meta property="og:title" content="Sign In - Access Your Account | electrozone" />
        <meta property="og:description" content="Sign in to your account to access personalized services and manage your settings on electrozone." />
        <meta property="og:image" content="URL of an image representing your site" />
        <meta property="og:url" content="https://www.yoursite.com/signin" />
        <link rel="canonical" href="https://www.yoursite.com/signin" />
        </Helmet>
      </head>

      <Layout2>
        <div className="d-flex align-items-center justify-content-center w-100 mt-4">
          <form className="signin-form" onSubmit={onSubmitHandler}>
            <h4 className="form-title">Sign In</h4>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={onChange}
                className="form-control"
                id="email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onChange}
                  className="form-control"
                  id="password"
                  required
                />
                <BsFillEyeFill
                  className="toggle-password"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
            <div className="text-center mt-3">
              <span>New User?</span> <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>

        {/* Custom CSS */}
        <style>
          {`
            .signin-form {
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

            .form-label {
              font-weight: bold;
              color: #333;
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

            .password-wrapper {
              position: relative;
            }

            .toggle-password {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              cursor: pointer;
              color: #fc0845;
              font-size: 1.25rem;
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
          `}
        </style>
      </Layout2>
    </>
  );
};

export default Signin;
