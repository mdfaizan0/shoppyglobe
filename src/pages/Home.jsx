import { useEffect, useState } from "react";
import useFetchProducts from "../utils/useFetchProducts";
import { Link } from "react-router-dom";

function Home() {
  // array of carousel images
  const slides = [
    "https://img.freepik.com/free-photo/excited-girl-scream-joy-making-fist-pump-holding-shopping-bag-rejoicing-standing-dress-ove_1258-120529.jpg?t=st=1752680918~exp=1752684518~hmac=f4aaa696b9e5b9db7eee53d1fc5caf8b8690fa6ae6f82623f343ee22f29459a7&w=1380",
    "https://img.freepik.com/free-photo/image-cheerful-girl-going-shopping-holding-bags-with-purchases-smiling-camera-standing-aga_1258-118086.jpg?t=st=1752680774~exp=1752684374~hmac=a9b016940ebf899cb9eadfe8136e38171248008c1d4301748612892560ceec32&w=1380",
    "https://img.freepik.com/free-photo/portrat-trendy-feminine-girl-posing-with-shopping-bags-from-store-credit-card-paying-contactl_1258-127340.jpg?t=st=1752680864~exp=1752684464~hmac=8ed2616d54f77e8c61e1eeb4c771c6ba1f28ad0392e56e2c420946d4127fa10d&w=1380",
  ];

  // setting currentIndex state and fetching list of products
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, err, loading } = useFetchProducts("https://dummyjson.com/products?limit=60");
  // getting array of topRated products
  const topRated = data?.products
    ?.slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // setting settimeout to change the slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <div className="carousel-wrapper">
        <div className="carousel-text">
          <h1>Unbox Confidence.</h1>
          <p>Discover products that match your style and energy.<br />Curated for you.</p>
          <Link to="/products/all" className="carousel-btn">Shop Now</Link>
        </div>
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((src, i) => (
            <img key={i} src={src} alt={`slide-${i}`} className="carousel-slide" />
          ))}
        </div>
      </div>
      <div className="home-intro">
        <h1>Welcome to ShoppyGlobe</h1>
        <p>Your one-stop shop for style, savings, and smiles.</p>
        <div className="home-cta">
          <Link to="/products/all" className="cta-btn primary">Shop Now</Link>
          <Link to="/about" className="cta-btn secondary">Learn More</Link>
        </div>
      </div>
      <div className="featured-products" id="features">
        <h2>Top Rated Products</h2>
        {loading ? (
          <p>Loading top products...</p>
        ) : err ? (
          <p>Failed to load products.</p>
        ) : (
          <div className="featured-grid">
            {topRated?.map((item) => (
              <div className="featured-card" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <h3>{item.title}</h3>
                <p>★ {(item.rating).toFixed(1)} — ${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;