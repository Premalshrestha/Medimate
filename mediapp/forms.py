from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    "form for creating and update blogs"

    class Meta:
        model= Post
        fields=['title','content']
        widgets={
            'title': forms.TextInput(attrs={'class':'form-control'}),
            'content': forms.TextInput(attrs={'class':'form-control','rows':5}),


        }

