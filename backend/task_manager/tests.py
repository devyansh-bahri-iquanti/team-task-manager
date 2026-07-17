from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Project

class TaskManagerAPITests(APITestCase):

    def setUp(self):
        # This runs before every test to set up dummy data
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.project = Project.objects.create(name='Test Project', description='Test Desc', owner=self.user)
        self.projects_url = '/api/projects/'

    def test_health_check(self):
        response = self.client.get('/api/status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')

    def test_unauthorized_project_access(self):
        # Attempt to get projects WITHOUT a token
        response = self.client.get(self.projects_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized_project_access(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.projects_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Project')