from rest_framework import serializers
from .models import Post, Like
from users.serializers import PublicUserSerializer


class LikeSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    is_liked = serializers.SerializerMethodField()  # 👈 aquí añadimos campo extra

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "title",
            "content",
            "image",
            "created_at",
            "likes_count",
            "is_liked",  # 👈 nuevo campo
        ]
        read_only_fields = ["id", "created_at", "likes_count", "is_liked"]

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
