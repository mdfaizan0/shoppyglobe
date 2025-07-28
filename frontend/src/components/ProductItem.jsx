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
    // declaring useDispatch, getting cart items from redux state and finding the item with the same ID.
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const cartItem = cartItems.find(item => item.productId === id)
    const token = useSelector(state => state.user.token)
    const navigate = useNavigate()
    // handing addtoCart and dispatching action to update redux state
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
            setAddedToCart(true)
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
            {cartItem ? <Counter handleDecreaseQuantity={handleDecreaseQuantity} handleIncreaseQuantity={handleIncreaseQuantity} quantity={cartItem.quantity} /> :
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