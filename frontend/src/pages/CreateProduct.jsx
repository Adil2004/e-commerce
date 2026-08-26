import {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, [])

    const createProduct = (e) => {
        e.preventDefault();
        api.post("/api/products/create/", { 
            name: name,
            description: description,
            price: price
        }).then((res) => {
            if (res.status === 201) {
                alert("Product created successfully!");
                navigate("/dashboard");
            } else {
                alert("Failed to create product. Please try again.");
            }
        }).catch((err) => alert(err));
    };

    return (
        <div>
            <ul className="navbar">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li className="navbar-logout-li">
                    <a href="/logout/">Logout</a>
                </li>
            </ul>

            <h1>Create Product</h1>
            <h2>Welcome, {username}!</h2>

            <form onSubmit={createProduct}>
                <label htmlFor="name">Product Name:</label>
                <br/>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <br/>
                <label htmlFor="description">Product Description:</label>
                <br/>
                <input
                    type="text"
                    id="description"
                    name="description"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
                <br/>
                <label htmlFor="price">Price:</label>
                <br/>
                <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                />
                <br/>
                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}

export default CreateProduct;