function About() {
  // rendering
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>Who We Are</h1>
        <p>
          ShoppyGlobe isn't just a marketplace — it's a carefully curated space where value meets style. Whether you're browsing, buying, or building your wishlist, our goal is simple: make every click worth it.
        </p>
      </section>
      <section className="about-highlights">
        <div className="highlight">✅ 1000+ Curated Products</div>
        <div className="highlight">⚡ Fast & Smooth Checkout</div>
        <div className="highlight">🔒 Secure Payments</div>
        <div className="highlight">💬 24/7 Support (Pretend, but shh)</div>
      </section>

      <div className="about-cta">
        <a href="/products/all">Explore Our Products</a>
      </div>
    </div>
  );
}

export default About;