# cache_bust.py

from django import template
from django.conf import settings
import os
import hashlib

register = template.Library()


@register.simple_tag
def cache_bust(file_path):
    print(file_path)
    full_path = os.path.join(settings.STATICFILES_DIRS[0], file_path)
    print(full_path)
    with open(full_path, "rb") as f:
        content = f.read()

    hash_value = hashlib.md5(content).hexdigest()[:8]
    return f"http://127.0.0.1:8000/static/{file_path}?v={hash_value}"


@register.simple_tag
def cache_bust0(file_path):
    print(file_path)
    full_path = os.path.join(settings.STATICFILES_DIRS[0], file_path)
    print(full_path)
    with open(full_path, "rb") as f:
        content = f.read()

    hash_value = hashlib.md5(content).hexdigest()[:8]
    return f"http://192.168.1.7:8000/static/{file_path}?v={hash_value}"
