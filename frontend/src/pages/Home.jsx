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
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard/">All Products</a></li>
                <li><a href="/ai-assistant">AI Assistant</a></li>
                {username === "" ? (
                    <>
                        <div className="navbar-right-panel">
                            <li>
                                <a href="/register">Register</a>
                            </li>
                            <li>
                                <a href="/login">Login</a>
                            </li>
                        </div>
                    </>
                ) : (
                    <>
                        <li><a href="/products/my">My Products</a></li>
                        <li><a href="/create-product/">Create Product</a></li>
                        <div className = "navbar-right-panel">
                            <li><a href="/shopping-cart">Shopping Cart</a></li>
                            <li>
                                <a href="/logout/">Logout</a>
                            </li>
                        </div>
                    </>
                )}
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