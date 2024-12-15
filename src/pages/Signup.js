import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify"; 
import { Helmet } from "react-helmet"; // Import Helmet for SEO management
import Layout2 from '../components/Layout2'; 

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(auth.currentUser, { displayName: name });
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      
      toast.success("Signup Successful!"); // Success notification
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Error signing up. Please try again."); // Error notification
    }
  };

  return (
    <>
      <Helmet>
        <title>Create an Account | Sign Up</title>
        <meta name="description" content="Create your account to enjoy the benefits of our services. Sign up now and get started!" />
        <meta name="keywords" content="sign up, create account, register, join, online services" />
        <meta property="og:title" content="Sign Up for Your Account" />
        <meta property="og:description" content="Create your account to enjoy the benefits of our services. Sign up now!" />
        <meta property="og:image" content="https://example.com/path-to-image.jpg" />
        <meta property="og:url" content="https://example.com/signup" />
      </Helmet>

      <Layout2>
        <div className="d-flex align-items-center justify-content-center w-100 mt-4">
          <form className="signup-form" onSubmit={onSubmitHandler}>
            <h4 className="form-title">Sign Up</h4>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label" aria-label="Enter Name">
                Enter Name
              </label>
              <input
                type="text"
                value={name}
                className="form-control"
                id="name"
                onChange={onChange}
                aria-describedby="nameHelp"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label" aria-label="Email Address">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={onChange}
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label" aria-label="Password">
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
                  alt="Toggle password visibility"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>

            <div className="text-center mt-3">
              <span>Already have an account?</span> <Link to="/signin">Login</Link>
            </div>
          </form>
        </div>

        {/* Custom CSS */}
        <style>
          {`
            .signup-form {
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

export default Signup;
