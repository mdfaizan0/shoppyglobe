import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'
import { clearCart } from '../utils/cartSlice'
import { useEffect } from 'react'

function Cart() {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  // getting array of items already in items of cart state of redux
  const cartItems = useSelector(store => store.cart.items)
  const dispatch = useDispatch()

  // handling clear cart
  function handleClearCart() {
    if (window.confirm("Are you sure?")) {
      dispatch(clearCart())
    }
  }

  // rendering
  return (
    <div className="cart-wrapper">
      <div className="cart-nav">
        <Link to="/products/all" className="back-to-shop">← Back to Shop</Link>
      </div>

      <div className="cart-items-container">
        {cartItems.length === 0 ? (
          <h2 className="cart-empty-msg">🛒 Cart is Empty, please add an item!</h2>
        ) : (
          <>
            <h1 className="cart-heading">My Cart</h1>
            {cartItems.map(item => (
              <CartItem item={item} key={item.id} />
            ))}
            <div className="cart-action-btns">
              <button onClick={handleClearCart} className="clear-cart-btn">Clear Cart</button>
              <Link to="/checkout">
                <button className="checkout-btn">Proceed to Checkout</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart