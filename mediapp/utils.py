def generate_slug(title):
    """
    Generate a slug from the given title.
    """
    # Replace spaces with hyphens and convert to lowercase
    return title.lower().replace(' ', '-')