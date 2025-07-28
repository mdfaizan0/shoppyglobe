import { Link, Navigate, useNavigate } from "react-router-dom"
import "../utils/style.css"
import { useEffect, useState } from "react"
import Search from "./Search"
import { useSelector } from "react-redux"
import logo from "../assets/globe-logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListUl } from "@fortawesome/free-solid-svg-icons"

function Header() {
  // States defined for searchbar and menu (mobile) and accessing cart state from Redux
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const cartItems = useSelector(state => state.cart.items)
  const token = useSelector(state => state.user.token)
  const isLoggedIn = Boolean(token)


  // Handling searchbar visibility
  function handleSearchBar() {
    setShowSearch(!showSearch)
  }

  // Rendering the header
  return (
    <nav className="header">
      <button className="toggle-page-links" onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <div className={`page-links ${showMenu ? "show-menu" : ""}`}>
        <Link to="/" className="home">Home</Link>
        <Link to="/products/all" className="header-shop">Shop</Link>
        <Link to="/about" className="about">About</Link>
      </div>
      <div className="header-logo">
        <Link to="/"><img src={logo} alt="shop-logo" width="50px" loading="lazy"/></Link>
      </div>
      {/* Handling Search component and items/quantity counter on cart icon */}
      <div className="header-action-btns">
        <img src="https://img.icons8.com/?size=100&id=132&format=png&color=000000" alt="search-logo" title="Search" width="40px" className="search-icon" onClick={handleSearchBar} loading="lazy"/>
        {showSearch ? <Search setShowSearch={setShowSearch} showSearch={showSearch} /> : ""}
        <Link to="/cart"><div className="cart">
          <img src="https://img.icons8.com/?size=100&id=8386&format=png&color=000000" alt="cart-logo" title="Cart" width="40px" loading="lazy"/>
          {cartItems?.length > 0 && <span className="cart-item-counter" style={token? {display: "block"} : {display: "none"}}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
        </div></Link>
        <Link to={isLoggedIn ? "/profile" : "/login"}><div className="login">
          <img src="https://img.icons8.com/?size=100&id=111473&format=png&color=000000" alt="login-logo" title={isLoggedIn ? "Profile" : "Login"} width="40px" loading="lazy"/>
          <span className="user-online" style={isLoggedIn ? { display: "block" } : { display: "none" }}></span>
        </div></Link>
      </div>
    </nav>
  )
}

export default Header