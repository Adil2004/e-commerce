import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import "../styles/Home.css"

function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
        api.get(`/api/products/${id}/`)
        .then((res) => {
            setProduct(res.data);
        })
        .catch((err) => console.error(err));
    }, [id])

    return (
        <div>
            <div className="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard/">Dashboard</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li className ="navbar-logout-li">
                    <a href = "/logout/">Logout</a>
                </li>
            </div>

            <div>
                {product && (
                    <div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Posted on: {new Date(product.created_at).toLocaleDateString()}</p>
                        <p>Price: ${product.price}</p>
                        <p>Created by: {product.author}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;