import "..styles/Product.css"

function Product({product, onDelete, onEdit, onDetail}) {
    const formattedDate = new Date(product.created_at).toLocaleDateString("en-US");

    return (
        <div className="product-container" onClick={() => onDetail(product.id)}>
            <p className="product-name">{product.name}</p>
            <p className="product-price">Price: ${product.price.toFixed(2)}</p>
            <p className="product-date">Posted on: {formattedDate}</p>
            <button className="delete-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product.id);
                }}>
                Delete
            </button>

            <button className="edit-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product.id);
                }}>
                Edit
            </button>
        </div>
    )
}

export default Product;