import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

// App with relevant classes to get over horizontal scrolling issues and 
// Header/Footer consistent all over the app with Outlet by React Router
function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App