// getting all the utilities
import { useDispatch, useSelector } from "react-redux"
import { removeItem, updateSingleItem } from "../utils/cartSlice"
import Counter from "./Counter"
import toast from "react-hot-toast"
import { ENDPOINTS } from "../utils/config"

function CartItem({ item }) {
  // declaring dispatch and selector from redux
  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)

  // handling remove from cart
  async function handleRemoveFromCart() {
    // confirming to remove the item
    const confirmRemove = window.confirm("You want to remove the item from cart?")
    // if not, return
    if (!confirmRemove) return
    try {
      // if yes, proceed with calling the backend with cartitem id
      await fetch(`${ENDPOINTS.CART}${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
      // after removed from backend, remove from redux and show success toast
      dispatch(removeItem(item._id))
      toast.success(`${item.title} removed from cart`)
      // if any error, show on toast as well as on console
    } catch (error) {
      toast.error("Error occured while deleting.")
      console.error("Error occured while deleting:", error)
    }
  }

  // handling decrease in quantity
  async function handleDecreaseQuantity() {
    // if quantity is 1, fallover to handleRemoveFromCart
    if (item.quantity === 1) {
      handleRemoveFromCart()
    } else {
      try {
        // if quantity more than one, call API and update quantity with relevant action
        const res = await fetch(`${ENDPOINTS.CART}${item._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: "decrease" })
        })
        const data = await res.json()
        // updating item in redux
        dispatch(updateSingleItem(data.cartItem))
        // if any error, show on toast as well as on console
      } catch (error) {
        toast.error("Error occured while decreasing quantity")
        console.error("Error occured:", error)
      }
    }
  }

  // handling increase in quantity
  async function handleIncreaseQuantity() {
    try {
      // if quantity more than one, call API and update quantity with relevant action
      const res = await fetch(`${ENDPOINTS.CART}${item._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "increase" })
      })
      const data = await res.json()
      // updating item in redux
      dispatch(updateSingleItem(data.cartItem))
      // if any error, show on toast as well as on console
    } catch (error) {
      toast.error("Error occured while increasing quantity")
      console.error("Error occured:", error)
    }
  }

  // rendering
  return (
    <div className="cart-item">
      <div className="cart-item-img">
        <img src={item.thumbnail} alt={item.title || "cart item"} loading="lazy" />
      </div>
      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
        <Counter
          handleDecreaseQuantity={handleDecreaseQuantity}
          handleIncreaseQuantity={handleIncreaseQuantity}
          quantity={item.quantity}
        />
        <button className="remove-item-btn" onClick={handleRemoveFromCart}>Remove</button>
      </div>
    </div>
  )
}

export default CartItem