import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { setToken } from "../utils/userSlice"
import toast from "react-hot-toast"
import { ENDPOINTS } from "../utils/config"

function Signup() {
  useEffect(() => {
    document.title = `Sign Up | ShoppyGlobe`
  }, [])

  // defining relevant states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.user.token)

  // if token exist, navigate to UserProfile page
  if (token) {
    return <Navigate to="/profile"></Navigate>
  }

  // handling submit behavior of signup form
  async function handleSubmit(e) {
    e.preventDefault()
    // // validating if name, email and password given
    if (!name || !email || !password) {
      toast("Please fill all fields")
      return
    }

    try {
      // if all fields filled, calling backend with fields information
      const res = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      /**
       * if response status is 201:
       * setting the token in user state of redux, 
       * submitted state to true, 
       * navigating to "/profile"
       * showing custom toast message
       */
      if (res.status === 201) {
        dispatch(setToken(data.token))
        setSubmitted(true)
        navigate("/profile")
        toast.success(`Hello ${name.split(" ")[0]}, welcome to the family`, { icon: "👋🏻" })
        // if response status is 409, show backend given message and navigate to login
      } else if (res.status === 409) {
        toast.error(data.message)
        navigate("/login")
      }
      // if any error, show on toast and as well as on console
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    }
  }

  // rendering
  return (
    <div className="signup-form">
      <h1>Sign Up</h1>
      {submitted ? (
        <p>Thanks for signing up, {name.split(" ")[0]}!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  )
}

export default Signup