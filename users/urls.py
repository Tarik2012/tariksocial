from django.urls import path
from .views import RegisterAPIView,UserMeView, LogoutView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('me/', UserMeView.as_view(), name='user-me'),
    path("logout/", LogoutView.as_view(), name="logout"),
]
