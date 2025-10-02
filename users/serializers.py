from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    # 👉 Campo extra para mostrar la URL completa del avatar
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "name", "last_name", "avatar", "avatar_url", "password"]
        extra_kwargs = {
            "password": {"write_only": True},  # solo se puede escribir, no leer
            "avatar": {"required": False},     # avatar no obligatorio
        }

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def create(self, validated_data):
        # Crear usuario en registro
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name", ""),
            last_name=validated_data.get("last_name", ""),
            avatar=validated_data.get("avatar", None),
        )
        return user

class PublicUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "name", "last_name", "avatar_url"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None    

