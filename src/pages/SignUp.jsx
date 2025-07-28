import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { setToken } from "../utils/userSlice"
import toast from "react-hot-toast"

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

  if (token) {
    return <Navigate to="/profile"></Navigate>
  }


  // handling submit behavior of signup form
  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !password) {
      toast("Please fill all fields")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.status === 201) {
        dispatch(setToken(data.token))
        setSubmitted(true)
        setTimeout(() => {
          navigate("/profile")
        }, 2000);
        toast.success(`Hello ${name.split(" ")[0]}, welcome to the family`, { icon: "👋🏻" })
      } else if (res.status === 409) {
        toast.error(data.message)
        navigate("/login")
      }
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