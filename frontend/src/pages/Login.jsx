import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { setToken } from '../utils/userSlice'
import toast from 'react-hot-toast'


function Login() {
    useEffect(() => {
        document.title = `Login | ShoppyGlobe`
    }, [])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)

    if (token) {
        return <Navigate to="/profile"></Navigate>
    }

    async function handleLogin(e) {
        e.preventDefault()
        if (!email || !password) {
            toast("Please fill all fields.")
            return
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (res.status === 200) {
                dispatch(setToken(data.token))
                setLoggedIn(true)
                setUserDetails(data.user)
                toast.success(`${data.user.name.split(" ")[0]}, in the house`, { icon: "👋🏻" })
                navigate("/profile")
            } else if (res.status === 404 || res.status === 401) {
                toast(data.message)
            } else {
                toast.error(data.message || "Login failed")
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
            console.error(error)
        }
    }

    return (
        <div className="login-form">
            <h1>Login</h1>
            {loggedIn ? (
                <p>Welcome Back, {userDetails.name}!</p>
            ) : (
                <>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Log In</button>
                    </form>
                    <hr />
                    <div className="signup-options" style={{ textAlign: "center" }}>
                        <p>Or</p>
                        <Link to="/signup"><button>Sign Up</button></Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default Login