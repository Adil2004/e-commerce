from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product


class ProductAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword123"
        )

        self.client.force_authenticate(user=self.user)

        self.product = Product.objects.create(
            name="Laptop",
            description="Gaming laptop",
            price=1000,
            author=self.user
        )

    def test_get_products(self):
        response = self.client.get("/api/products/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_exists(self):
        self.assertEqual(self.product.name, "Laptop")
        self.assertEqual(self.product.price, 1000)

    def test_create_product(self):
        data = {
            "name": "Phone",
            "description": "Smartphone",
            "price": 500
        }

        response = self.client.post(
            "/api/products/create/",
            data,
            format="multipart"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            Product.objects.filter(
                name="Phone",
                author=self.user
            ).exists()
        )

    def test_edit_product(self):
        data = {
            "name": "Phone",
            "description": "Updated smartphone",
            "price": 600
        }

        response = self.client.patch(
            f"/api/products/{self.product.id}/edit/",
            data,
            format="multipart"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.product.refresh_from_db()

        self.assertEqual(
            self.product.name,
            "Phone"
        )

        self.assertEqual(
            self.product.price,
            600
        )

        self.assertEqual(
            self.product.author,
            self.user
        )

    def test_delete_product(self):
        response = self.client.delete(
            f"/api/products/{self.product.id}/delete/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertFalse(
            Product.objects.filter(
                id=self.product.id
            ).exists()
        )