import React from "react";
import paypalImage from "../assets/images/paypal.png"; 

const Footer = () => {
  return (
    <footer className="footer bg-light">
      <div className="container-fluid">
        <div className="row">
          {/* Contact and Social Icons */}
          <div className="col-md-3">
            <p>
            Call us Monday to Friday from 9:00 AM to 7:00 PM and Saturday from 9:00 AM to 12:30 PM.
            </p>
            <p>
              <strong>Follow us on social media.</strong>
            </p>
          </div>

          {/* Categories */}
          <div className="col-md-2">
            <ul className="list-unstyled">
              <li><a href="/climatiseur">Climatiseurs</a></li>
              <li><a href="/tv">Tv</a></li>
              <li><a href="/laptop">Laptops</a></li>
            </ul>
          </div>

          {/* Informations */}
          <div className="col-md-2">
            <h5><strong>Information</strong></h5>
            <ul className="list-unstyled">
              <li><a href="/contact">Contact us</a></li>
              <li><a href="/search">Search Specefic Product</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-md-2">
            <h5><strong>Useful links.</strong></h5>
            <ul className="list-unstyled">
              <li><a href="/terms">Terms and Conditions</a></li>
              <li><a href="/privacy-policy">privacy-policy</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-3">
            <h5><strong>Receive the latest news!</strong></h5>
            <p>Subscribe to our newsletter and get 10% off your first purchase.</p>
            <div className="subscribe">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
            <div className="payment-icons mt-3">
              <img
                src={paypalImage} 
                alt="Logo PayPal"
                height="30"
                width="50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rights Reserved Footer */}
      <div className="d-flex align-items-center justify-content-center bg-white text-light p-4 mt-3">
        <h6 style={{ color: '#fc0845' }}>
          All rights reserved. &copy; Electrozone - 2024
        </h6>
      </div>

      {/* Inline Styles */}
      <style>{`
        .footer {
          padding: 40px 0;
          background-color: #f5f5ff;
          color: #fc0845;
          font-family: 'Arial', sans-serif;
        }
        .footer a {
          color: #fc0845;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .social-icons a {
          font-size: 20px;
          margin-right: 10px;
        }
        .subscribe input[type="email"] {
          border: 1px solid #fc0845;
          border-radius: 20px;
          padding: 5px 10px;
          margin-right: 10px;
        }
        .subscribe button {
          background-color: #fc0845;
          border: none;
          border-radius: 20px;
          color: white;
          padding: 5px 20px;
        }
        .payment-icons img {
          height: 30px;
          margin-right: 10px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
