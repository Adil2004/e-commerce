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
                <div className="navbar-left-panel">
                    <li><a href="/" className="nav-button home-button">Home</a></li>
                </div>
                <div className="navbar-center">
                    <li><a href="/dashboard/" className="nav-button">All Products</a></li>
                    <li><a href="/products/my" className="nav-button">My Products</a></li>
                    <li><a href="/create-product/" className="nav-button">Create Product</a></li>
                </div>

                <div className="navbar-right">
                    <li><a href="/shopping-cart" className="nav-button">Shopping Cart</a></li>
                    <li>
                        <a href="/logout/" className="nav-button logout-button">Logout</a>
                    </li>
                </div>
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