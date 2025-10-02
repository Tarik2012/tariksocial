# posts/views.py

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, SAFE_METHODS, BasePermission
from django.shortcuts import get_object_or_404
from .models import Post, Like
from .serializers import PostSerializer


# 📌 Listar y crear posts
class PostListCreateView(ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# 🔒 Permiso personalizado: solo el autor puede editar o eliminar
class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


# 📌 Detalle, actualizar y eliminar un post
class PostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]


# 📌 Dar o quitar like a un post
class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            like.delete()
            return Response(
                {"liked": False, "likes_count": post.likes.count()},
                status=status.HTTP_200_OK
            )

        return Response(
            {"liked": True, "likes_count": post.likes.count()},
            status=status.HTTP_201_CREATED
        )
