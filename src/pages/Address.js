import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Address.css';

const Address = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    telephone_number: '',
  });

  const [errors, setErrors] = useState({}); // To track validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!address.street.trim()) newErrors.street = 'Street Address is required.';
    if (!address.city.trim()) newErrors.city = 'City is required.';
    if (!address.postalCode) newErrors.postalCode = 'Postal Code is required.';
    if (!address.telephone_number)
      newErrors.telephone_number = 'Telephone Number is required.';
    else if (address.telephone_number.length !== 8)
      newErrors.telephone_number = 'Telephone Number must be 8 digits.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleNext = () => {
    if (validateForm()) {
      localStorage.setItem('address', JSON.stringify(address));
      navigate('/payment');
    }
  };

  return (
    <div className="address-container">
      {/* Helmet for SEO */}
      <Helmet>
        <title>Shipping Address - Secure Online Checkout | Electrozone</title>
        <meta
          name="description"
          content="Enter your shipping address for a smooth checkout experience at Electrozone. Securely complete your purchase with our easy-to-fill address form."
        />
        <meta
          name="keywords"
          content="shipping address, online checkout, secure shopping, Electrozone, address form"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Shipping Address - Electrozone" />
        <meta
          property="og:description"
          content="Fill out your shipping address to proceed with your purchase. Enjoy secure and fast checkout at Electrozone."
        />
        <meta property="og:url" content="https://www.yoursite.com/address" />
        <meta property="og:image" content="URL of the image" />
        <link rel="canonical" href="https://www.yoursite.com/address" />
        {/* Structured Data for Address Form */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Shipping Address - Electrozone",
            "description": "Fill out your shipping address for a smooth checkout experience at Electrozone.",
            "url": "https://www.yoursite.com/address",
            "mainEntity": {
              "@type": "PostalAddress",
              "streetAddress": address.street,
              "addressLocality": address.city,
              "postalCode": address.postalCode,
              "telephone": address.telephone_number,
            },
          })}
        </script>
      </Helmet>

      <h2 className="address-title">Shipping Address</h2>
      <form className="address-form" noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={address.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="street">Street Address</label>
          <input
            name="street"
            type="text"
            placeholder="1234 Main St"
            value={address.street}
            onChange={handleChange}
            required
          />
          {errors.street && <span className="error-message">{errors.street}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            name="city"
            type="text"
            placeholder="New York"
            value={address.city}
            onChange={handleChange}
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              name="postalCode"
              type="number"
              placeholder="10001"
              value={address.postalCode}
              onChange={handleChange}
              required
            />
            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="telephone_number">Telephone Number</label>
            <input
              name="telephone_number"
              type="number"
              placeholder="1234567890"
              value={address.telephone_number}
              onChange={handleChange}
              required
            />
            {errors.telephone_number && (
              <span className="error-message">{errors.telephone_number}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="address-button"
          onClick={handleNext}
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default Address;
