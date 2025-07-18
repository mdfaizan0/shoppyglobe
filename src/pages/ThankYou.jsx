import { useEffect } from "react"
import { Link, Navigate } from "react-router-dom"

function ThankYou() {
  // getting order placed to check if order placed or not
  const isOrderPlaced = sessionStorage.getItem("orderPlaced") === "true"

  // if yes, remove orderPlaced from sessionStorage
  useEffect(() => {
    if (isOrderPlaced) {
      sessionStorage.removeItem("orderPlaced")
    }
  }, [isOrderPlaced])

  // if not, navigate to home
  if (!isOrderPlaced) {
    return <Navigate to="/" replace />
  }

  // getting 6 digit random order ID
  const orderId = Math.floor(100000 + Math.random() * 900000)

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <h1>Thank You for shopping with us!</h1>
        <p>Your order has been successfully placed.</p>
        <p><strong>Order ID:</strong> #{orderId}</p>
        <p>We hope to see you again soon!</p>
      </div>
      <Link to="/products/all" className="notfound-btn">Buy More!</Link>
    </div>
  )
}

export default ThankYou