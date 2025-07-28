import { useDispatch, useSelector } from "react-redux"
import { removeItem, updateSingleItem } from "../utils/cartSlice"
import Counter from "./Counter"
import toast from "react-hot-toast"

function CartItem({ item }) {
  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)

  // handling remove from cart
  async function handleRemoveFromCart() {
    const confirmRemove = window.confirm("You want to remove the item from cart?")
    if (!confirmRemove) return
    try {
      await fetch(`http://localhost:5000/api/cart/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
      dispatch(removeItem(item._id))
      toast.success(`${item.title} removed from cart`)
    } catch (error) {
      toast.error("Error occured while deleting.")
      console.error("Error occured while deleting:", error)
    }
  }

  async function handleDecreaseQuantity() {
    if (item.quantity === 1) {
      handleRemoveFromCart()
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: "decrease" })
        })
        const data = await res.json()
        dispatch(updateSingleItem(data.cartItem))
      } catch (error) {
        toast.error("Error occured while decreasing quantity")
        console.error("Error occured:", error)
      }
    }
  }

  async function handleIncreaseQuantity() {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "increase" })
      })
      const data = await res.json()
      dispatch(updateSingleItem(data.cartItem))
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