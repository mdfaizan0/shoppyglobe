import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addItem, decreaseQuantity, increaseQuantity } from '../utils/cartSlice'
import Counter from '../components/Counter'

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
  const cartItem = cartItems.find(item => item.id === Number(id))
  const navigate = useNavigate()

  // calling the API using custom hook to get details about the item and re-renders when id is changed
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const resp = await fetch(`https://dummyjson.com/products/${id}`)
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

  // dispatching action to items by using addItem action
  function handleAddToCart() {
    dispatch(addItem({ title, thumbnail, price, id: Number(id) }))
  }

  // dispatching descrease quantity action to relevant action after confirming before quantity is zero 
  function handleDecreaseQuantity() {
    if (cartItem.quantity > 1) {
      dispatch(decreaseQuantity(cartItem.id))
    } else {
      if (window.confirm("Do you want to remove the item from cart?")) {
        dispatch(decreaseQuantity(cartItem.id))
      }
    }
  }

  // disptaching action to increase number of quantity
  function handleIncreaseQuantity() {
    dispatch(increaseQuantity(cartItem.id))
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
          <img src={thumbnail} alt={title} />
          <h1>{title}</h1>
          {brand && <p className="brand">{brand}</p>}
          <p>{description}</p>
          <h3>${price?.toFixed(2)}</h3>
          <h4>★ {rating}</h4>
          <p>{returnPolicy || "30-Day Return Available"}</p>
          <p className="stock-warning">Only {stock} remaining, buy now!</p>

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