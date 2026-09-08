import { useState, useEffect } from "react";
import ProductPreview from "../components/ProductPreview";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [username, setUsername] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const PAGE_SIZE = 5;
    const totalPages = Math.ceil(count / PAGE_SIZE);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = (pageNum) => {
        api.get(`/api/products/?page=${pageNum}`)
        .then((res) => {
            setProducts(res.data.results);
            setCount(res.data.count);
        })
        .catch((err) => console.log(err));
    }

    const detailProduct = (productId) => {
        navigate(`/products/${productId}/`);
    }
    
    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    return (
        <div>
            <ul className="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/products/my">My Products</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li><a href="/ai-assistant">AI Assistant</a></li>
                <li><a href="/shopping-cart">Shopping Cart</a></li>
                <li className="navbar-logout-li">
                    <a href="/logout/">Logout</a>
                </li>
            </ul>

            <h5>Dashboard</h5>
            <h5>Welcome, {username}!</h5>

            <div className="dashboard-container">
                {products.map((product) => (
                    <ProductPreview key={product.id} product={product} onDetail = {detailProduct} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => goToPage(num)}
                            className={num === page ? "active-page" : ""}
                        >
                            {num}
                        </button>
                    ))}

                    <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default Dashboard;