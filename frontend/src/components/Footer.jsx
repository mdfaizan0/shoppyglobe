import { faFacebook, faGithub, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/shoppyGlobe-logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Footer() {
  // handling subcribed state to greet for subscribing
  const [subscribed, setSubscribed] = useState(false)

  // handling subscription form submission and setting subscribed state to true
  function handleSubmit(e) {
    e.preventDefault()
    setSubscribed(true)
  }

  // redering the footer
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section brand">
          <img src={logo} alt="logo" className="footer-logo" loading="lazy" />
          <p className="footer-desc">
            ShoppyGlobe isn't just a marketplace — it's a carefully curated space where value meets style. Whether you're browsing, buying, or building your wishlist, our goal is simple: make every click worth it.
          </p>
          <ul className="social-links">
            <li><a href="https://x.com/"><FontAwesomeIcon icon={faTwitter} inverse /></a></li>
            <li><a href="https://www.facebook.com/"><FontAwesomeIcon icon={faFacebook} inverse /></a></li>
            <li><a href="https://www.instagram.com/"><FontAwesomeIcon icon={faInstagram} inverse /></a></li>
            <li><a href="https://github.com/"><FontAwesomeIcon icon={faGithub} inverse /></a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Works</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Delivery Details</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h4>Subscribe to Newsletter</h4>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email" />
            {subscribed ? <p>Thank you for subscribing.</p> : <button type="submit">Subscribe</button>}
          </form>
        </div>
      </div>

      <hr />
      <p className="footer-bottom">© {new Date().getFullYear()} ShoppyGlobe. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
