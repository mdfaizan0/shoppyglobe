import { useEffect, useState } from "react";
import { getProfile } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../utils/userSlice";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../utils/config";

function UserProfile() {
    // setting relevant states, getting redux states and setting dispatch/navigate
    const [isLoggedIn, setIsLoggedIn] = useState()
    const [loading, setLoading] = useState(true)
    const [orderHistory, setOrderHistory] = useState({})
    const token = useSelector(state => state.user?.token);
    const user = useSelector(state => state.user?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // if there is no token, navigate to "/login"
        if (!token) {
            navigate("/login");
            return;
        }
        // if token exist, fetching user profile from getProfile utility function by sending token with it
        const fetchUser = async () => {
            const result = await getProfile(token);

            // if any error: show toast, trigger logout action from redux and navigate to "/login"
            if (!result) {
                toast.error("Something went wrong.");
                dispatch(logout());
                navigate("/login");
                // if getProfile returned with expired, show the same message as toast, trigger logout action from redux and navigate to "/login"
            } else if (result.expired) {
                toast.error("Session expired. Please login again.");
                dispatch(logout());
                navigate("/login");
                // else, set the user details in the user state of redux and set loggedin state as true
            } else {
                dispatch(setUser(result.user));
                setIsLoggedIn(true)
            }
        };

        // only execute if there is no user retrieved from redux user state
        if (!user) fetchUser();
    }, [token, dispatch, navigate, user]);

    useEffect(() => {
        async function fetchOrderHistory() {
            try {
                // fetching order history from backend
                const res = await fetch(ENDPOINTS.ORDER_HISTORY, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                })
                const data = await res.json()
                // setting order history details 
                setOrderHistory(data.orderHistory)
            } catch (error) {
                // if any error, show on toast and as well as on console
                toast.error(data.message)
                console.error(error)
            } finally {
                // finally, set loading state to false
                setLoading(false)
            }
        }
        fetchOrderHistory()
    }, [isLoggedIn])

    // only update the document title when user.name is received as not "undefined"
    useEffect(() => {
        if (user?.name) document.title = `${user?.name} | Profile`
    }, [user?.name])

    return (
        <div className="user-profile">
            <div className="profile-name-logout">
                {user?.name ? <>
                    <h1>Hello, {user.name} 👋🏻</h1>
                    <button onClick={() => {
                        dispatch(logout());
                        navigate("/login");
                    }}>Logout</button>
                </> : <p className="user-loading-msg">Loading user details...</p>}

            </div>
            {loading ? <div className="loading-container"><div className="loading-msg"></div></div> : (
                <div className="order-history">
                    <h2>Your Orders</h2>
                    {orderHistory?.length === 0 ? (<div className="no-orders">
                        <p className="no-orders-msg">No previous orders found, lets start the journey by exploring.</p>
                        <div className="no-orders-cta">
                            <a href="/products/all">Explore Our Products</a>
                        </div>
                    </div>
                    ) : orderHistory?.map(order => {
                        return (
                            <div className="order-card" key={order.orderNo}>
                                <div className="order-header">
                                    <h3>Order ID: #{`${order.orderNo}`}</h3>
                                    <p><strong>Estimated Delivery: </strong>7-10 business day</p>
                                    <p className="order-date-time">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB')} at{" "}
                                        {new Date(order.createdAt).toLocaleTimeString('en-US', { timeStyle: "short" })}
                                    </p>
                                </div>
                                <div className="oh-order-items">
                                    {order.orderItems?.map((item, index) => (
                                        <div className="oh-order-item" key={index}>
                                            <div className="oh-img">
                                                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                                            </div>
                                            <div className="oh-details">
                                                <h4>{item.title}</h4>
                                                <p>Price: ${item.price}</p>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default UserProfile