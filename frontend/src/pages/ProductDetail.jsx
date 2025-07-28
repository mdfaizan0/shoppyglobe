import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addItem, removeItem, updateSingleItem } from '../utils/cartSlice'
import Counter from '../components/Counter'
import toast from 'react-hot-toast'
import { ENDPOINTS } from '../utils/config'

function ProductDetail() {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  // Defined states
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)
  // accessing :id from path using React Router
  const { id } = useParams()
  // useDispatch to dispatch an action and useSelector to access states using reducers 
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  // finding the item with same id from cart state
  const cartItem = cartItems.find(item => item.productId === Number(id))
  const navigate = useNavigate()
  const token = useSelector(state => state.user.token)

  // calling the API using custom hook to get details about the item and re-renders when id is changed
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const resp = await fetch(`${ENDPOINTS.ONE_PRODUCT}${id}`)
        const json = await resp.json()
        // if API fails, fallback to NotFound component (/404) as API error does not fall under React Router error boundary
        if (!resp.ok) navigate("/404", { replace: true, state: { from: window.location.pathname, status: 404, message: `Product with id ${id} not found` } })
        setProduct(json)
      } catch (error) {
        navigate("/404", { replace: true, state: { from: window.location.pathname, status: 404, message: `Product with id ${id} not found` } })
      } finally {
        setLoading(false)
      }
    }
    fetchProductDetails()
  }, [id])

  // destructuring relevant properties
  const { title, description, price, rating, returnPolicy, stock, thumbnail, brand } = product

  useEffect(() => {
    document.title = `${title} | ShoppyGlobe`
  }, [title])

  // dispatching action to items by using addItem action
  async function handleAddToCart() {
    if (!token) {
      toast("Looks like you are not logged in, please login first.")
      navigate("/login")
      return
    }
    try {
      const res = await fetch(ENDPOINTS.CART, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, thumbnail, price, productId: id, quantity: 1 })
      })
      const data = await res.json()
      if (res.status === 201) {
        toast.success(`${title} added to cart`)
        dispatch(addItem({ ...data.newItem }))
      } else if (res.status === 200 && data.updatedItem) {
        dispatch(updateSingleItem(data.updatedItem))
      }
    } catch (error) {
      toast.error("Error occured while adding item to cart")
      console.error("Error occured while adding item to cart:", error)
    }
  }

  // handling remove from cart
  async function handleRemoveFromCart() {
    const confirmRemove = window.confirm("You want to remove the item from cart?")
    if (!confirmRemove) return
    try {
      await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
      dispatch(removeItem(cartItem._id))
      toast.success(`${title} removed from cart`)
    } catch (error) {
      toast.error("Error occured while deleting.")
      console.error("Error occured while deleting:", error)
    }
  }

  // dispatching descrease quantity action to relevant action after confirming before quantity is zero 
  async function handleDecreaseQuantity() {
    if (cartItem.quantity === 1) {
      handleRemoveFromCart()
    } else {
      try {
        const res = await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
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

  // disptaching action to increase number of quantity
  async function handleIncreaseQuantity() {
    try {
      const res = await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
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
    <>
      {loading ? (
        <div className="loading-container"><div className="loading-msg"></div></div>
      ) : (<div className="product-details-container">
        <div className="detail-nav">
          <Link to="/products/all" className="back-to-shop">←Back to Shop</Link>
        </div>
        <div className="product-details">
          <img src={thumbnail} alt={title} loading="lazy" />
          <h1>{title}</h1>
          {brand && <p className="brand">{brand}</p>}
          <p>{description}</p>
          <h3>${price?.toFixed(2)}</h3>
          <h4>★ {rating}</h4>
          <p>{returnPolicy || "30-Day Return Available"}</p>
          {stock < 10 && <p className="stock-warning">Only {stock} remaining, buy now!</p>}
          {!cartItem ? (
            <button onClick={handleAddToCart}>Add to Cart</button>
          ) : (
            <>
              <Counter
                quantity={cartItem.quantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
              />
              <Link to="/cart">
                <button className="go-to-cart-btn">Go to Cart</button>
              </Link>
            </>
          )}
        </div>
      </div>
      )}
    </>
  )
}

export default ProductDetail