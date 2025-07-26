from .models import Post
from .utils import generate_slug


class PostService:
    """
    Service class for interacting with Post objects.
    """

    @staticmethod
    def get_all_posts():
        """
        Retrieve all posts from the database.
        """
        return Post.objects.all()

    @staticmethod
    def create_post(title, content):
        """
        Create a new post with the given title and content.
        """
        slug = generate_slug(title)
        return Post.objects.create(title=title, content=content, slug=slug)

    @staticmethod
    def get_post_by_id(post_id):
        """
        Retrieve a post by its ID.
        """
        return Post.objects.get(id=post_id)

    @staticmethod
    def update_post(post_id, title, content):
        """
        Update an existing post with the given ID.
        """
        post = Post.objects.get(id=post_id)
        post.title = title
        post.content = content
        post.save()
        return post

    @staticmethod
    def delete_post(post_id):
        """
        Delete a post by its ID.
        """
        post = Post.objects.get(id=post_id)
        post.delete()