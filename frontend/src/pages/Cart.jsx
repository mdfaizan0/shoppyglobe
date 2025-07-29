import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../components/CartItem'
import { Link, Navigate } from 'react-router-dom'
import { clearCart, setCart } from '../utils/cartSlice'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { ENDPOINTS } from '../utils/config'

function Cart() {
  // scrolling to the top on every re-render
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  // setting relevant document title
  useEffect(() => {
    document.title = `Cart | ShoppyGlobe`
  }, [])

  // getting array of items and token already in redux state
  const cartItems = useSelector(store => store.cart.items)
  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)
  
  // handling clear cart
  async function handleClearCart() {
    // confirming if clear cart
    if (window.confirm("Are you sure you want to remove all items?")) {
      try {
        // if yes, call backend and remove items
        const res = await fetch(ENDPOINTS.CLEAR_CART, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${token}`
          }
        })
        const data = await res.json()
        // after backend clear, call clearCart redux action with toast message
        dispatch(clearCart())
        toast.success(data.message)
        // if any error, show error on toast as well as on console
      } catch (error) {
        toast.error("Error occurred while clearing cart")
        console.error("Error while clearing cart:", error)
      }
    }
  }

  // only allow user to visit this page, if they are logged in
  if (!token) {
    toast("Looks like you are not logged in, please login first.")
    return <Navigate to="/login"></Navigate>
  }

  // if logged in, proceed to fetch their cartitems
  useEffect(() => {
    async function fetchCartItems() {
      const res = await fetch(ENDPOINTS.CART, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
      const data = await res.json()
      // setting cart state with redux setCart action
      dispatch(setCart(data.cartItems))
    }
    fetchCartItems()
  }, [])

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
              <CartItem item={item} key={item._id} />
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