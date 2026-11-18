import "../styles/Home.css"
import { useEffect, useState } from "react"

function Home() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
    }, [])

    return (
        <div>
            
        <ul className="navbar">
            <div className="navbar-left-panel">
                <li>
                    <a href="/" className="nav-button home-button">Home</a>
                </li>
            </div>

            <div className="navbar-center">
                <li>
                    <a href="/dashboard/" className="nav-button">All Products</a>
                </li>
                <li>
                    <a href="/ai-assistant" className="nav-button">AI Assistant</a>
                </li>

                {username !== "" && (
                    <>
                        <li>
                            <a href="/products/my" className="nav-button">My Products</a>
                        </li>
                        <li>
                            <a href="/create-product/" className="nav-button">Create Product</a>
                        </li>
                    </>
                )}
            </div>

            <div className="navbar-right">
                {username === "" ? (
                    <>
                        <li>
                            <a href="/register" className="nav-button">Register</a>
                        </li>
                        <li>
                            <a href="/login" className="nav-button login-button">Login</a>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <a href="/shopping-cart" className="nav-button">Shopping Cart</a>
                        </li>
                        <li>
                            <a href="/logout/" className="nav-button logout-button">Logout</a>
                        </li>
                    </>
                )}
            </div>
        </ul>


            <h1>Home page</h1>
            <h2>Welcome!</h2>
            <h3>This is test application</h3>
            <h3>You can create, edit, and delete, add to the shopping cart products.</h3>
            <h3>All products will be saved in the database.</h3>
        </div>
    );
}

export default Home;