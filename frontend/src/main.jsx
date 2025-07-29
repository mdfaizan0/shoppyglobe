// Github — https://github.com/mdfaizan0/shoppyglobe
// Deployed - https://shoppyglobe-frontend.onrender.com/

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import appStore from "./utils/appStore.js"
import NotFound from './pages/NotFound.jsx'
import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

// calling React.lazy to import components through lazy
const Home = lazy(() => import('./pages/Home.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'))
const ProductList = lazy(() => import('./pages/ProductList.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const ThankYou = lazy(() => import('./pages/ThankYou.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const UserProfile = lazy(() => import('./pages/UserProfile.jsx'))

// rendering lazy components
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/cart", element: <Cart /> },
      { path: "/details/:id", element: <ProductDetail /> },
      { path: "/products/all", element: <ProductList /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/about", element: <About /> },
      { path: "/thank-you", element: <ThankYou /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/404", element: <NotFound /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  // providing redux store access to whole app
  <Provider store={appStore}>
    {/* setting toaster base stylings */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        success: {
          duration: 2500,
          style: {
            backgroundColor: 'white',
            border: "1px solid #00ED09",
            padding: "12px 16px",
            fontWeight: "500",
            fontSize: "18px"
          },
        },
        error: {
          duration: 4000,
          style: {
            backgroundColor: 'white',
            border: "1px solid #FF0000",
            padding: "12px 16px",
            fontWeight: "500",
            fontSize: "16px"
          },
        },
        style: {
          backgroundColor: 'white',
          border: "1px solid #F2FF00",
          padding: "12px 16px",
          fontWeight: "500",
          fontSize: "18px"
        },
        duration: 3000,
      }}
    />
    {/* wrapping Suspense in order to lazy load all the components */}
    <Suspense fallback={<div className="loading-container"><div className="loading-msg"></div></div>}>
      {/* rendering RouterProvider from react-router with appRouter as the main router based on path defined in it*/}
      <RouterProvider router={appRouter} />
    </Suspense>
  </Provider>
)
