import { useDispatch } from "react-redux"
import { decreaseQuantity, increaseQuantity, removeItem } from "../utils/cartSlice"
import Counter from "./Counter"

function CartItem({ item }) {
  const dispatch = useDispatch()

  // handling remove from cart
  function handleRemoveFromCart() {
    dispatch(removeItem(item.id))
  }

  function handleDecreaseQuantity() {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item.id))
    } else {
      if (window.confirm("Do you want to remove the item from cart?")) {
        dispatch(decreaseQuantity(item.id))
      }
    }
  }

  function handleIncreaseQuantity() {
    dispatch(increaseQuantity(item.id))
  }

  // rendering
  return (
    <div className="cart-item">
      <div className="cart-item-img">
        <img src={item.thumbnail} alt={item.title || "cart item"} />
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