import json

# Create your views here.
from .pagination import ProductPagination
from django.db import models
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import CartItemSerializer, ProductSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, CartItems
import requests
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from rest_framework.filters import SearchFilter
import time

# Create your views here.
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)

class DashboardView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

class ProductDeleteView(generics.DestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

class ProductEditView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class ProductMyView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ProductPagination

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user).order_by("-created_at")

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItems.objects.filter(user=request.user)

        serializer = CartItemSerializer(
            cart_items,
            many=True
        )

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        quantity = request.data.get("quantity", 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItems.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def put(self, request, cart_item_id):
        try:
            cart_item = CartItems.objects.get(
                id=cart_item_id,
                user=request.user
            )
        except CartItems.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if int(quantity) < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = int(quantity)
        cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data)

    def delete(self, request, cart_item_id):
        try:
            cart_item = CartItems.objects.get(
                id=cart_item_id,
                user=request.user
            )
        except CartItems.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=404
            )

        cart_item.delete()

        return Response(status=204)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
