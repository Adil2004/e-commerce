import "../styles/Product.css"

function ProductPreview({product, onDetail}) {
    const formattedDate = new Date(product.created_at).toLocaleDateString("en-US");

    const imageUrl = product.images
    ? product.images.startsWith("http")
        ? product.images
        : `${import.meta.env.VITE_API_URL}${product.images}`
    : null;

    return (
        <div className="product-container" onClick={() => onDetail(product.id)}>
            {imageUrl && (
                <img src={imageUrl} alt={product.name} style={{ maxWidth: "75px" }} />
            )}
            <p className="product-name">{product.name}</p>
            <p className="product-price">Price: ${Number(product.price).toFixed(2)}</p>
            <p className="product-date">Posted on: {formattedDate}</p>
        </div>
    );
}

export default ProductPreview;