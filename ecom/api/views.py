from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import ProductSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product

# Create your views here.
class ProductListView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class DashboardView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class ProductDelete(generics.DestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class ProductEdit(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]