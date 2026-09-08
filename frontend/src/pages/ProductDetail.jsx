import { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Home.css"

function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editImage, setEditImage] = useState(null);

    

    
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        api.get(`/api/products/${id}/`)
        .then((res) => {
            setProduct(res.data);
        })
        .catch((err) => console.error(err));
    }, [id])

    const isAuthor = product && username && product.author === username;

    const deleteProduct = () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        api.delete(`/api/products/${product.id}/delete/`)
        .then((res) => {
            if (res.status === 204) {
                alert("Product deleted");
                navigate("/dashboard");
            } else {
                alert("Failed to delete product");
            }
        }).catch((error) => alert(error));
    };

    const startEditing = () => {
        setEditName(product.name);
        setEditDescription(product.description);
        setEditPrice(product.price);
        setEditImage(null);
        setIsEditing(true);
    }

    const cancelEditing = () => {
        setIsEditing(false);
    }

    const handleEditImageChange = (e) => {
        setEditImage(e.target.files[0]);
    }

    const updateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", editName);
        formData.append("description", editDescription);
        formData.append("price", editPrice);
        if (editImage) {
            formData.append("images", editImage);
        }

        try {
            const res = await api.patch(`/api/products/${product.id}/edit/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProduct(res.data);
            setIsEditing(false);
            alert("Product updated!");
        } catch (error) {
            console.error(error);
            alert("Failed to update product");
        }
    };

    const addToCart = async (productId) => {
        try {
            const res = await api.post("/api/shopping-cart/", { product: productId})
            alert("Product added to cart!");
        }
        catch (error) {
            console.error(error);
            alert("Failed to add product to cart");
        }
    }

    return (
        <div>
            <div className="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard/">Dashboard</a></li>
                <li><a href="/products/my">My Products</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li><a href="/ai-assistant">AI Assistant</a></li>
                <li><a href="/shopping-cart">Shopping Cart</a></li>
                <li className ="navbar-logout-li">
                    <a href = "/logout/">Logout</a>
                </li>
            </div>

            <div>
                {product && !isEditing && (
                    <div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Posted on: {new Date(product.created_at).toLocaleDateString()}</p>
                        <p>Price: ${product.price}</p>
                        <p>Created by: {product.author}</p>
                        {product.images && (
                            <img src={product.images} alt={product.name} style={{ maxWidth: "300px" }} />
                        )}

                        {isAuthor && (
                            <div className="product-actions">
                                <button onClick={startEditing}>Edit</button>
                                <button onClick={deleteProduct}>Delete</button>
                            </div>
                        )}
                        <button onClick={() => addToCart(product.id)}>
                            Add to Cart
                        </button>
                    </div>
                )}

                {product && isEditing && (
                    <form onSubmit={updateProduct}>
                        <label htmlFor="editName">Name:</label>
                        <br />
                        <input
                            type="text"
                            id="editName"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                        />
                        <br />

                        <label htmlFor="editDescription">Description:</label>
                        <br />
                        <textarea
                            id="editDescription"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            required
                        />
                        <br />

                        <label htmlFor="editPrice">Price:</label>
                        <br />
                        <input
                            type="number"
                            id="editPrice"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            required
                        />
                        <br />

                        <label htmlFor="editImage">Replace image (optional):</label>
                        <br />
                        <input
                            type="file"
                            id="editImage"
                            accept="image/*"
                            onChange={handleEditImageChange}
                        />
                        <br />

                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={cancelEditing}>Cancel</button>
                    </form>
                )}
            </div>

            
        </div>
    );
}

export default ProductDetail;