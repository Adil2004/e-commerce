import "..styles/product.css"

function ProductPreview({product, onDetail}) {
    const formattedDate = new Date(product.created_at).toLocaleDateString("en-US");

    return (
        <div className="product-container" onClick={() => onDetail(product.id)}>
            <p className="product-name">{product.name}</p>
            <p className="product-price">Price: ${product.price.toFixed(2)}</p>
            <p className="product-date">Posted on: {formattedDate}</p>
        </div>
    );
}

export default ProductPreview;