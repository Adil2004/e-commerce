import { useState, useEffect } from "react";
import ProductPreview from "../components/ProductPreview";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [username, setUsername] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        api.get("/api/products/")
        .then((res) => res.data)
        .then((data) => { setProducts(data); console.log(data);})
        .catch((err) => console.log(err));
    }

    const detailProduct = (productId) => {
        navigate(`/products/${productId}/`);
    }

    return (
        <div>
            <ul className="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li className="navbar-logout-li">
                    <a href="/logout/">Logout</a>
                </li>
            </ul>

            <h1>Dashboard</h1>
            <h2>Welcome, {username}!</h2>
            <h2>This is the dashboard for online market web page.</h2>
            <h2>Here you can see all your products, that you have created.</h2>

            <div className="dashboard-container">
                {products.map((product) => (
                    <ProductPreview key={product.id} product={product} onDetail = {detailProduct} />
                ))}
            </div>
        </div>
    )
}

export default Dashboard;