import { useDispatch, useSelector } from "react-redux"
import { addItem, decreaseQuantity, increaseQuantity } from "../utils/cartSlice"
import { Link } from "react-router-dom"
import Counter from "./Counter"
import { useEffect, useState } from "react"

function ProductItem({ title, thumbnail, price, warranty, id }) {
    // declaring addedToCart to check if addedtocart, if yes, show go to cart and update redux state
    const [addedToCart, setAddedToCart] = useState(false)
    // declaring useDispatch, getting cart items from redux state and finding the item with the same ID.
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const cartItem = cartItems.find(item => item.id === id)

    // handing addtoCart and dispatching action to update redux state
    function handleAddToCart() {
        dispatch(addItem({ title, thumbnail, price, id }))
        setAddedToCart(true)
    }

    function handleDecreaseQuantity() {
        if (cartItem.quantity > 1) {
            dispatch(decreaseQuantity(cartItem.id))
        } else {
            if (window.confirm("Do you want to remove the item from cart?")) {
                dispatch(decreaseQuantity(cartItem.id))
            }
        }
    }

    function handleIncreaseQuantity() {
        dispatch(increaseQuantity(cartItem.id))
    }

    // removing go to cart button after 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAddedToCart(false)
        }, 5000);

        return () => clearInterval(timeout)
    }, [addedToCart])

    return (
        <div className="product-item">
            <Link to={`/details/${id}`}>
                <img src={thumbnail} alt="" />
                <p>{title}</p>
                <p>${price.toFixed(2)}</p>
                <p>{warranty}</p>
            </Link>
            {cartItem ? <Counter handleDecreaseQuantity={handleDecreaseQuantity} handleIncreaseQuantity={handleIncreaseQuantity} quantity={cartItem.quantity} /> :
                <button onClick={handleAddToCart}>Add to Cart</button>}
            {/* rendering only whehn item is added to cart and quantity property is greater than 0*/}
            {addedToCart && cartItem?.quantity > 0 ? (
                <Link to="/cart">
                    <button style={{ marginTop: "10px", marginLeft: "10px" }}>Go to Cart</button>
                </Link>
            ) : null}
        </div>
    )
}

export default ProductItem