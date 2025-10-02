# posts/urls.py

from django.urls import path
from .views import PostListCreateView,PostDetailView,ToggleLikeView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path("<int:post_id>/like/", ToggleLikeView.as_view(), name="toggle-like"),
]
