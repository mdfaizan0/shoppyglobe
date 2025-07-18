function Counter({ handleDecreaseQuantity, handleIncreaseQuantity, quantity }) {
    // getting relevant props to handle Counter buttons and display the quantity of the item's quantity property value 
    return (
        <div className="counter">
            <button className="counter-btn" onClick={handleDecreaseQuantity}>–</button>
            <span className="counter-value">{quantity}</span>
            <button className="counter-btn" onClick={handleIncreaseQuantity}>+</button>
        </div>
    )
}

export default Counter