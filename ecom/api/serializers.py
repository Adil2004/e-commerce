from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, CartItems

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ProductSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "created_at","images", "author"]

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItems
        fields = ["id", "product", "quantity", "added_at"]
