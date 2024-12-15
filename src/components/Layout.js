import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

// Import images
import climatiseurImage from "../assets/images/climatiseur.png";
import tvImage from "../assets/images/tvs.png";
import laptopImage from "../assets/images/laptops.png";
import climBanner from "../assets/images/clim.png";
import tvvBanner from "../assets/images/tvv.png";
import cl1Image from "../assets/images/cl1.PNG";
import cl2Image from "../assets/images/cl2.PNG";
import cl3Image from "../assets/images/cl3.PNG";
import tv1Image from "../assets/images/tv1.PNG";
import tv2Image from "../assets/images/tv2.PNG";
import tv3Image from "../assets/images/tv3.PNG";
import home1Image from "../assets/images/home1.png";
import home2Image from "../assets/images/home2.png";
import home3Image from "../assets/images/home3.png";
import underImage from "../assets/images/under.png";

const Layout = () => {
  const [searchText, setSearchText] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearchClick = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setShowSearchResult(true); // Toggle to display only the search result
  };

  if (showSearchResult) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        {searchText ? <h1>Results for "{searchText}"</h1> : <h1>No results found</h1>}
      </div>
    );
  }

  const climatiseurs = [
    { src: cl1Image, name: "TCL Climatiseur", price: "From 4,199", link: "/Climatiseur" },
    { src: cl2Image, name: "Samsung Climatiseur", price: "From 5,199", link: "/Climatiseur" },
    { src: cl3Image, name: "LG Climatiseur", price: "From 6,299", link: "/Climatiseur" },
  ];

  const tvs = [
    { src: tv1Image, name: "Sony Smart TV", price: "From 6,599", link: "/Tv" },
    { src: tv2Image, name: "Samsung Smart TV", price: "From 7,199", link: "/Tv" },
    { src: tv3Image, name: "LG OLED TV", price: "From 8,399", link: "/Tv" },
  ];

  return (
    <>
    {/* Inline CSS for Layout */}
    <style>{`
        /* Layout and Font Improvements */
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        .layout-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
          color: #333;
          background-color: #f9f9f9;
        }

        h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: #2d2d2d;
        }

        .carousel-inner img {
          max-height: 450px;
          object-fit: cover;
        }

        .categories-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 50px;
        }

        .category-item {
          text-align: center;
        }

        .category-item p {
          margin-top: 15px;
          font-size: 1.2rem;
          font-weight: 500;
          color: #444;
        }

        .category-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .category-image:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .banner-container img {
          max-height: 350px;
          object-fit: cover;
        }

        .product-container {
          margin-top: 50px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          color: #2d2d2d;
          margin-bottom: 30px;
        }

        .products {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .article-item {
          text-align: center;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          transition: box-shadow 0.3s ease;
          text-decoration: none; /* Ensure no underline on links */
          color: inherit; /* Use inherited color */
        }

        .article-item:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .article-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .product-name {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .product-price {
          font-size: 1.1rem;
          color: #555;
        }

        .under-image-container {
          text-align: center;
          margin-top: 50px;
        }

        .under-image {
          width: 100%;
          height: auto;
        }
      `}</style>
<Helmet>
  <title>Best Electronics: Climatiseurs, TVs, and Laptops at Affordable Prices</title>
  <meta
    name="description"
    content="Discover unbeatable deals on Climatiseurs, TVs, and Laptops. Shop the latest electronics with high-quality performance and competitive prices, perfect for every need."
  />
  <meta
    name="keywords"
    content="Climatiseur, TVs, Laptops, Electronics, Affordable Deals, Best Electronics, Top-quality Electronics, Best Laptop Deals, Buy TVs Online, Best Climatiseurs"
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Best Electronics: Climatiseurs, TVs, and Laptops at Affordable Prices" />
  <meta property="og:description" content="Shop the best electronics including Climatiseurs, TVs, and Laptops at unbeatable prices. Quality guaranteed for every product." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="URL_TO_AN_IMAGE_THAT_REPRESENTS_YOUR_PAGE" />
  <meta property="og:url" content="YOUR_PAGE_URL" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Best Electronics: Climatiseurs, TVs, and Laptops at Affordable Prices" />
  <meta name="twitter:description" content="Shop the best electronics including Climatiseurs, TVs, and Laptops at unbeatable prices." />
  <meta name="twitter:image" content="URL_TO_AN_IMAGE_THAT_REPRESENTS_YOUR_PAGE" />
  <link rel="canonical" href="YOUR_PAGE_URL" />
</Helmet>


      <div className="layout-container">
        {/* Hero Carousel */}
        <section id="hero-carousel" aria-label="Homepage Hero">
          <div id="homeCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={home1Image} alt="Affordable Electronics Deals" className="d-block w-100" loading="lazy" />
              </div>
              <div className="carousel-item">
                <img src={home2Image} alt="High-Quality Products" className="d-block w-100" loading="lazy" />
              </div>
              <div className="carousel-item">
                <img src={home3Image} alt="Best Prices Online" className="d-block w-100" loading="lazy" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" aria-label="Product Categories" className="text-center mb-4">
          <h2>Choose Your Category</h2>
          <div className="categories-container">
            <Link to="Climatiseur" aria-label="Explore Climatiseur products">
              <div className="category-item">
                <img src={climatiseurImage} alt="Shop Climatiseurs" className="img-fluid category-image" />
                <p>Climatiseur</p>
              </div>
            </Link>
            <Link to="Tv" aria-label="Explore TV products">
              <div className="category-item">
                <img src={tvImage} alt="Shop TVs" className="img-fluid category-image" />
                <p>TVs</p>
              </div>
            </Link>
            <Link to="Laptop" aria-label="Explore Laptop products">
              <div className="category-item">
                <img src={laptopImage} alt="Shop Laptops" className="img-fluid category-image" />
                <p>Laptops</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Banner and Products Section */}
        <section id="climatiseurs" aria-label="Climatiseurs Section">
          <div className="banner-container text-center mt-5">
            <img src={climBanner} alt="Top Climatiseurs Deals" className="img-fluid clim-banner" loading="lazy" />
          </div>
          <div className="product-container">
            <h3 className="section-title">Affordable Climatiseurs – Top Brands</h3>
            <div className="products">
              {climatiseurs.map((product, index) => (
                <Link to={product.link} key={index} className="article-item" aria-label={`View details of ${product.name}`}>
                  <img src={product.src} alt={product.name} className="img-fluid article-image small" loading="lazy" />
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TV Section */}
        <section id="tvs" aria-label="TVs Section">
          <div className="banner-container text-center mt-5">
            <img src={tvvBanner} alt="Smart TVs at Affordable Prices" className="img-fluid tv-banner" loading="lazy" />
          </div>
          <div className="product-container">
            <h3 className="section-title">Best Smart TVs – Affordable Prices</h3>
            <div className="products">
              {tvs.map((product, index) => (
                <Link to={product.link} key={index} className="article-item" aria-label={`View details of ${product.name}`}>
                  <img src={product.src} alt={product.name} className="img-fluid article-image small" loading="lazy" />
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="under-image-container">
          <img src={underImage} alt="Footer Banner" className="img-fluid under-image" loading="lazy" />
        </footer>
      </div>
    </>
  );
};

export default Layout;
