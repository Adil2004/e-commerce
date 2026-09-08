from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.DashboardView.as_view(), name="dashboard"),
    path("products/", views.ProductListView.as_view(), name="products"),
    path("products/create/", views.ProductCreateView.as_view(), name="create-product"),
    path("products/my/", views.ProductMyView.as_view(), name="my-products"),
    path("products/<int:pk>/", views.ProductDetailView.as_view(), name="product-detail"),
    path("products/<int:pk>/edit/", views.ProductEditView.as_view(), name="edit-product"),
    path("products/<int:pk>/delete/", views.ProductDeleteView.as_view(), name="delete-product"),
    path("ai-assistant/", views.product_ai_assistant, name="ai-assistant"),
    path("shopping-cart/", views.CartView.as_view(), name="shopping-cart"),
    path("shopping-cart/<int:cart_item_id>/", views.CartView.as_view(), name="shopping-cart-detail"),
]
