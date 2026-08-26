import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import CreateProduct from "./pages/CreateProduct"
import Dashboard from "./pages/Dashboard"

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element = {
                <Home />
            }
          />
          <Route path = "/create-product" element={<CreateProduct />} />
          <Route path = "/dashboard" element={<Dashboard />} />
          <Route path = "/login" element={<Login />} />
          <Route path = "/logout" element={<Logout />} />
          <Route path = "/register" element={<RegisterAndLogout />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App