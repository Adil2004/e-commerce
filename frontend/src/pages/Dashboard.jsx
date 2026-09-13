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
    const [search, setSearch] = useState("");

    const PAGE_SIZE = 6;
    const totalPages = Math.ceil(count / PAGE_SIZE);

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
    }, []);

    useEffect(() => {
        fetchProducts(page, search);
    }, [page]);

    const fetchProducts = (pageNum, searchTerm = search) => {
        api.get(`/api/products/?search=${encodeURIComponent(searchTerm)}&page=${pageNum}`)
            .then((res) => {
                setProducts(res.data.results);
                setCount(res.data.count);
            })
            .catch((err) => console.log(err));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);
        fetchProducts(1, search);
    };

    const detailProduct = (productId) => {
        navigate(`/products/${productId}/`);
    };

    const goToPage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

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

            <h1>All Products</h1>

            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">
                    Search
                </button>
            </form>

            <div className="dashboard-container">
                {products.map((product) => (
                    <ProductPreview
                        key={product.id}
                        product={product}
                        onDetail={detailProduct}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                    ).map((num) => (
                        <button
                            key={num}
                            onClick={() => goToPage(num)}
                            className={num === page ? "active-page" : ""}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;