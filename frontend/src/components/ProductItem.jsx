import { useDispatch, useSelector } from "react-redux"
import { addItem, removeItem, updateSingleItem } from "../utils/cartSlice"
import { Link, useNavigate } from "react-router-dom"
import Counter from "./Counter"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ENDPOINTS } from "../utils/config"

function ProductItem({ title, thumbnail, price, warranty, id, rating }) {
    // declaring addedToCart to check if addedtocart, if yes, show go to cart and update redux state
    const [addedToCart, setAddedToCart] = useState(false)
    const [loading, setLoading] = useState(false)
    // declaring useDispatch, getting cart items from redux state and finding the item with the same ID.
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const cartItem = cartItems.find(item => item.productId === id)
    const token = useSelector(state => state.user.token)
    const navigate = useNavigate()
    
    // handing addtoCart action
    async function handleAddToCart() {
        // set loading state to true, while frontend communicate with backend
        setLoading(true)
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
            setAddedToCart(true)
            // if any error, show on toast as well as on console
        } catch (error) {
            toast.error("Error occured while adding item to cart")
            console.error("Error occured while adding item to cart:", error)
            // finally set loading state to false
        } finally {
            setLoading(false)
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

    // removing go to cart button after 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAddedToCart(false)
        }, 5000);

        return () => clearTimeout(timeout)
    }, [addedToCart])

    return (
        <div className="product-item">
            <Link to={`/details/${id}`}>
                <img src={thumbnail} alt={title} title={title} loading="lazy" />
                <p>{title}</p>
                <p>${price.toFixed(2)}</p>
                <p>{warranty}</p>
                <span className="product-item-rating">★ {rating}</span>
            </Link>
            {loading ? <div className="loading-msg" style={{ marginTop: "10px" }}></div> : cartItem ? <Counter handleDecreaseQuantity={handleDecreaseQuantity} handleIncreaseQuantity={handleIncreaseQuantity} quantity={cartItem.quantity} /> :
                <button onClick={handleAddToCart}>Add to Cart</button>}
            {/* rendering only when item is added to cart and quantity property is greater than 0*/}
            {addedToCart && cartItem?.quantity > 0 ? (
                <Link to="/cart">
                    <button style={{ marginTop: "10px", marginLeft: "10px" }}>Go to Cart</button>
                </Link>
            ) : null}
        </div>
    )
}

export default ProductItem