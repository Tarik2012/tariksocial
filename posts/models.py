from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Like(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="likes"
    )
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name="likes"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 👉 Evita que un usuario pueda dar "me gusta" dos veces al mismo post
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user.email} → {self.post.title}"
