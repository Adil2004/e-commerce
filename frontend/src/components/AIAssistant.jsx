import { useState, useRef, useEffect } from "react";
import ProductPreview from "./ProductPreview";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AIAssistant() {
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hi! Ask me things like \"find products under $2\" or \"show me electronics between $10 and $50\".", products: [] }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const bottomRef = useRef(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        setMessages((prev) => [...prev, { role: "user", text: trimmed, products: [] }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/api/ai-assistant/", { message: trimmed });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: res.data.reply, products: res.data.products },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "Sorry, something went wrong processing that.", products: [] },
            ]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const detailProduct = (productId) => {
        navigate(`/products/${productId}/`);
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

            <h1>AI Product Assistant</h1>

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.role}`}>
                            <h3>{msg.text}</h3>
                            {msg.products.length > 0 && (
                                <div className="chat-product-results">
                                    {msg.products.map((product) => (
                                        <ProductPreview
                                            key={product.id}
                                            product={product}
                                            onDetail={detailProduct}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-bubble assistant">
                            <p>Thinking...</p>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={sendMessage} className="chat-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about products..."
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>Send</button>
                </form>
            </div>
        </div>
    );
}

export default AIAssistant;