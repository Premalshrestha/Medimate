from django.contrib import admin
from .models import Member, Post, Doctor, Consultation
from django.contrib import admin

# Register your models here.
admin.site.register(Member)
admin.site.register(Post)
admin.site.register(Doctor)
admin.site.register(Consultation)
