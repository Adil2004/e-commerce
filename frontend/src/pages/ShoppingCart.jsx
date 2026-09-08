import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductPreview from "../components/ProductPreview";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const detailProduct = (productId) => {
        navigate(`/products/${productId}/`);
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/api/shopping-cart/');

                console.log(response.data);

                setCartItems(response.data);

            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`/api/shopping-cart/${cartItemId}/`);

            // Remove it from the current list without refreshing
            setCartItems(
                cartItems.filter((item) => item.id !== cartItemId)
            );

        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + Number(item.product.price) * item.quantity,
        0
    );

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

            <h1>Shopping Cart</h1>

            <h2>
                This is the page where you can see all your products
                that you added to the cart.
            </h2>

            <div className="dashboard-container">
                {cartItems.length === 0 ? (
                    <h2>Shopping cart is empty</h2>
                ) : (
                    <>
                        <div className="dashboard-container">
                            {cartItems.map((item) => (
                                <div key={item.id}>
                                    <ProductPreview
                                        product={item.product}
                                        onDetail={detailProduct}
                                    />

                                    <button onClick={() => removeFromCart(item.id)}>
                                        Remove from Cart
                                    </button>
                                </div>
                            ))}
                        </div>

                        <h3>
                            Total Price: ${totalPrice.toFixed(2)}
                        </h3>
                    </>
                )}
            </div>
        </div>
    );
}

export default ShoppingCart;