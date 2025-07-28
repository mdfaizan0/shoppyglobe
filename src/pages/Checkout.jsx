import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearCart } from '../utils/cartSlice'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Checkout() {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    document.title = `Checkout | ShoppyGlobe`
  }, [])

  // declaring dispatch and getting existing cart items from redux state
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(store => store.cart.items)
  // state to check if payment option have been clicked even once
  const [payChecked, setPayChecked] = useState(0)
  // calculating subtotal based on price and quantity
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  //calculating taxes
  const taxes = subtotal * 0.18
  const delivery = 20
  // deriving finalTotal
  const finalTotal = subtotal + taxes + delivery
  const token = useSelector(state => state.user.token)

  async function handleConfirmOrder() {
    const orderNo = Math.floor(100000 + Math.random() * 900000)
    try {
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderNo })
      })
      const data = await res.json()
      toast.success(data.message, { icon: "🎉" })
      handleClearCart()
    } catch (error) {
      toast.error("Failed to create the order")
      console.error("Failed to create the order", error)
    }
  }

  // removing items from cart and setting orderPlaced to true to sessionStorage to show ThankYou page only true.
  async function handleClearCart() {
    sessionStorage.setItem("orderPlaced", "true")
    try {
      await fetch("http://localhost:5000/api/cartclear", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
    } catch (error) {
      toast.error("Error while clearing cart")
      console.error("Error while clearing cart:", error)
    }

    dispatch(clearCart())
    navigate("/thank-you")
  }

  // increasing payChecked state
  function handlePayment() {
    setPayChecked(prev => prev = prev + 1)
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-nav-links">
        <Link to="/products/all">Back to Shop</Link> | <Link to="/cart">Back to Cart</Link>
      </div>
      {cartItems.length === 0 ? <h2 className="cart-empty-msg">📩 Please Proceed to Checkout again from the cart!</h2> : (
        <>
          <h2 className="checkout-title">Review Your Order</h2>
          <div className="checkout-item-list">
            {cartItems.map(item => (
              <div className="checkout-item" key={item.productId}>
                <div className="checkout-item-img">
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                </div>
                <div className="checkout-item-info">
                  <h3>{item.title}</h3>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ${item.price.toFixed(2)} each</p>
                  <p><strong>Total:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-container">
            <h3>How you'll pay?</h3>
            <div className="payment-options" onClick={handlePayment}>
              <div className="payment-upi payment">
                <input type="radio" name="payment_method" id="upi" />
                <label htmlFor="upi">
                  <img src="https://img.icons8.com/?size=100&id=5RcHTSNy4fbL&format=png&color=000000" alt="bhim" loading="lazy" />
                  <img src="https://img.icons8.com/?size=100&id=XYVoikUs9vba&format=png&color=000000" alt="gpay" loading="lazy" />
                  <img src="https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000" alt="phonepe" loading="lazy" />
                </label>
              </div>
              <div className="payment-card payment">
                <input type="radio" name="payment_method" id="card" />
                <label htmlFor="card">
                  <img src="https://img.icons8.com/?size=100&id=9huLL0OVNRPY&format=png&color=000000" alt="visa" loading="lazy" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" loading="lazy" />
                  <img src="https://img.icons8.com/?size=100&id=13607&format=png&color=000000" alt="amex" loading="lazy" />
                </label>
              </div>
              <div className="payment-cod payment">
                <input type="radio" name="payment_method" id="cod" />
                <label htmlFor="cod">Cash on delivery</label>
              </div>
            </div>
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-container">
              <div className="summary-childs">
                <p>Subtotal:</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="summary-childs">
                <p>VAT + Taxes (18%):</p>
                <p>${taxes.toFixed(2)}</p>
              </div>
              <div className="summary-childs">
                <p>Delivery Charges:</p>
                <p>${delivery.toFixed(2)}</p>
              </div>
            </div>
            <div className="summary-childs">
              <h2>Total:</h2>
              <h2>${finalTotal.toFixed(2)}</h2>
            </div>
          </div>
          <div className="confirm-order-btn">
            <button onClick={handleConfirmOrder} disabled={payChecked === 0}>Confirm Order</button>
          </div>
        </>
      )}

    </div>
  )
}

export default Checkout