import {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, [])

    const handleFileChange = (e) => {
        setImage(e.target.files[0])
    }
    const createProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) {
            formData.append("images", image);
        }

        api.post("api/products/create/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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
            

            <h1>Create Product</h1>

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
                <label htmlFor="image">Product Image:</label>
                <br/>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <br/>
                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}

export default CreateProduct;