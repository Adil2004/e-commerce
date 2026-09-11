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

    const addQuantity = async (cartItemId, newQuantity) => {
        try {
            await api.put(`/api/shopping-cart/${cartItemId}/`, {
                quantity: newQuantity,
            });

            setCartItems((currentItems) =>
                currentItems.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );

        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(cartItemId);
            return;
        }

        try {
            await api.put(`/api/shopping-cart/${cartItemId}/`, {
                quantity: newQuantity,
            });
            setCartItems((currentItems) =>
                currentItems.map((item) => 
                item.id === cartItemId
                    ? { ...item, quantity: newQuantity}
                : item )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    return (
        <div>
            <ul className="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard">All Products</a></li>
                <li><a href="/products/my">My Products</a></li>
                <li><a href="/create-product">Create Product</a></li>
                <li><a href="/ai-assistant">AI Assistant</a></li>
                <li><a href="/shopping-cart">Shopping Cart</a></li>
                <li className="navbar-logout-li">
                    <a href="/logout/">Logout</a>
                </li>
            </ul>

            <h1>Shopping Cart</h1>

            <div className="dashboard-container">
                {cartItems.length === 0 ? (
                    <h3>Shopping cart is empty.</h3>
                ) : (
                    <>
                        <div className="dashboard-container">
                            {cartItems.map((item) => (
                                <div key={item.id}>
                                    <ProductPreview
                                        product={item.product}
                                        onDetail={detailProduct}
                                    />

                                    <div className = "cart-quantity-controls">
                                        <button onClick={() => removeQuantity(item.id, item.quantity - 1)}>
                                            -
                                        </button>

                                        <span>Quantity: {item.quantity}</span>
                                        <button onClick={() => addQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>


                                        <button onClick={() => removeFromCart(item.id)}>
                                            🗑️
                                        </button>                                    
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className = "cart-total-price">
                            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ShoppingCart;