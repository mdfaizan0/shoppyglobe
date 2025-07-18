import { useState } from "react"

function Signup() {
  // defining relevant states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // handling submit behavior of signup form
  function handleSubmit(e) {
    e.preventDefault()
    if (name && email && password) {
      setSubmitted(true)
    } else {
      alert("Please fill all fields")
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
