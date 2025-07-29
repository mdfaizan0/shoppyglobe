import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addItem, removeItem, updateSingleItem } from '../utils/cartSlice'
import Counter from '../components/Counter'
import toast from 'react-hot-toast'
import { ENDPOINTS } from '../utils/config'

function ProductDetail() {
  // scrolling to the top on every re-render
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  // Defined states
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)
  const [atcLoading, setATCLoading] = useState(false)
  // accessing :id from path using React Router
  const { id } = useParams()
  // useDispatch to dispatch an action and useSelector to access states using reducers 
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  // finding the item with same id from cart state
  const cartItem = cartItems.find(item => item.productId === Number(id))
  const navigate = useNavigate()
  const token = useSelector(state => state.user.token)

  // calling the API to get details about the item and re-renders when id is changed
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const resp = await fetch(`${ENDPOINTS.ONE_PRODUCT}${id}`)
        const json = await resp.json()
        // if API fails, fallback to NotFound component (/404) as API error does not fall under React Router error boundary
        if (!resp.ok) navigate("/404", { replace: true, state: { from: window.location.pathname, status: 404, message: `Product with id ${id} not found` } })
        setProduct(json)
        // if any error, fallback to Notfound with the relevant details and app. message
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

  // setting title of the product as soon as the product details is loaded
  useEffect(() => {
    if (!loading) document.title = `${title} | ShoppyGlobe`
  }, [title])

  // handling add to cart action
  async function handleAddToCart() {
    // set atcloading state to true, while frontend communicate with backend
    setATCLoading(true)
    // check if token exist, if not, route to login
    if (!token) {
      toast("Looks like you are not logged in, please login first.")
      navigate("/login")
      return
    }
    try {
      // if token exist, proceed with calling backend with all the relevant info to add item to cart
      const res = await fetch(ENDPOINTS.CART, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, thumbnail, price, productId: id, quantity: 1 })
      })
      const data = await res.json()
      // if status is 201, then show toast, add item using addItem action, else if status is 200, update the quantity in redux
      if (res.status === 201) {
        toast.success(`${title} added to cart`)
        dispatch(addItem({ ...data.newItem }))
      } else if (res.status === 200 && data.updatedItem) {
        dispatch(updateSingleItem(data.updatedItem))
      }
      // if any error, show on toast as well as on console
    } catch (error) {
      toast.error("Error occured while adding item to cart")
      console.error("Error occured while adding item to cart:", error)
      // finally set atcloading state to false
    } finally {
      setATCLoading(false)
    }
  }

  // handling remove from cart
  async function handleRemoveFromCart() {
    // confirming to remove the item
    const confirmRemove = window.confirm("You want to remove the item from cart?")
    // if not, return
    if (!confirmRemove) return
    try {
      // if yes, proceed with calling the backend with cartitem id
      await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      })
      // after removed from backend, remove from redux and show success toast
      dispatch(removeItem(cartItem._id))
      toast.success(`${title} removed from cart`)
      // if any error, show on toast as well as on console
    } catch (error) {
      toast.error("Error occured while deleting.")
      console.error("Error occured while deleting:", error)
    }
  }

  // handling decrease in quantity
  async function handleDecreaseQuantity() {
    // if quantity is 1, fallover to handleRemoveFromCart
    if (cartItem.quantity === 1) {
      handleRemoveFromCart()
    } else {
      try {
        // if quantity more than one, call API and update quantity with relevant action
        const res = await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
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
      const res = await fetch(`${ENDPOINTS.CART}${cartItem._id}`, {
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
          {atcLoading ? <div className="loading-msg"></div> : !cartItem ? (
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