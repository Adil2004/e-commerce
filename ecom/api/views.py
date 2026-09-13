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


def ask_openrouter(prompt):
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "nvidia/nemotron-3.5-lightning:free",
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
    result = response.json()

    if "error" not in result:
        return result["choices"][0]["message"]["content"]

    raise RuntimeError("OpenRouter rate limited after retries.")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def product_ai_assistant(request):
    message = request.data.get("message", "").strip()
    if not message:
        return Response({"error": "Message is required."}, status=400)

    # Step 1: extract structured filters from the natural language query
    extraction_prompt = f"""Extract search filters from this product search query. Respond with ONLY a JSON object, no other text, no markdown fences.

Query: "{message}"

JSON shape:
{{
    "max_price": <number or null>,
    "min_price": <number or null>,
    "keywords": <string or null, key search terms from the query, or null if none>
}}"""

    try:
        raw_text = ask_openrouter(extraction_prompt).strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        filters = json.loads(raw_text)
    except (json.JSONDecodeError, KeyError, requests.RequestException) as e:
        return Response({"error": f"Could not process query: {str(e)}"}, status=502)

    # Step 2: query the DB with those filters
    queryset = Product.objects.all()

    if filters.get("max_price") is not None:
        queryset = queryset.filter(price__lte=filters["max_price"])
    if filters.get("min_price") is not None:
        queryset = queryset.filter(price__gte=filters["min_price"])
    if filters.get("keywords"):
        queryset = queryset.filter(
            models.Q(name__icontains=filters["keywords"]) |
            models.Q(description__icontains=filters["keywords"])
        )

    queryset = queryset.order_by("-created_at")[:10]
    serializer = ProductSerializer(queryset, many=True, context={"request": request})
    result_count = queryset.count()

    # Step 3: natural-language reply summarizing what was found
    summary_prompt = f"""The user asked: "{message}"
I found {result_count} matching product(s). Write a short, friendly one or two sentence reply confirming what was searched for. Don't list the products individually — they'll be shown separately as cards below your message."""

    try:
        reply_text = ask_openrouter(summary_prompt).strip()
    except (KeyError, requests.RequestException):
        reply_text = f"Found {result_count} matching product(s)."

    return Response({
        "reply": reply_text,
        "products": serializer.data,
    })