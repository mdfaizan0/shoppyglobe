import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import { ENDPOINTS } from "../utils/config"

function ThankYou() {
  const [isOrderPlaced, setIsOrderPlaced] = useState(() => {
    return sessionStorage.getItem("orderPlaced") === "true"
  })

  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const res = await fetch(ENDPOINTS.ORDER_LATEST, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()
        setOrderDetails(data.latestItem)
      } catch (error) {
        toast.error("Error while fetching recent order")
        console.error("Error while fetching recent order:", error)
      } finally {
        setLoading(false)
        sessionStorage.removeItem("orderPlaced")
      }
    }

    if (isOrderPlaced) {
      fetchOrderDetail()
    }
  }, [isOrderPlaced, token])

  if (!isOrderPlaced) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <h1>Thank You for shopping with us!</h1>
        <p>Your order has been successfully placed.</p>
        <h2>Order Details</h2>
        {loading ? (
          <div className="loading-container"><div className="loading-msg"></div></div>
        ) : (
          <>
            <p><strong>Order ID:</strong> #{orderDetails?.orderNo}</p>
            <div className="final-order-summary">
              {orderDetails?.orderItems?.map((item, index) => (
                <div className="final-order-item" key={index}>
                  <div className="foi-img">
                    <img src={item.thumbnail} alt={item.title} loading="lazy"/>
                  </div>
                  <div className="foi-details">
                    <h3>{item.title}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <p><strong>Estimated Delivery: </strong>7–10 business days</p>
            <p>We hope to see you soon!</p>
          </>
        )}
      </div>

      <Link to="/products/all" className="notfound-btn">Buy More!</Link>
    </div>
  )
}

export default ThankYou