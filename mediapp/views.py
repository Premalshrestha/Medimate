from pyexpat.errors import messages
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from .models import HealthActivity
from django.http import JsonResponse
from .models import HealthActivity, Consultation
from mediapp.models import Member , Doctor # adjust this if the model is in a different app
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from .models import Doctor

# Create your views here.

def home_page(request):

    return render(request, 'index.html')


@csrf_exempt
def add_family_member(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        member = Member.objects.create(
                name=data['name'],
                age=data['age'],
                sex=data['sex'],
                family_id=data.get('family_id', None),
                show_age=data.get('show_age', True)
        )

        return JsonResponse({'status': 'success', 'id': member.id})
    return JsonResponse({'error': 'Invalid method'}, status=400)





def get_health_activities(request):
    activities = list(HealthActivity.objects.values())
    return JsonResponse({'activities': activities})


def login(request):
    return render(request, 'login.html')  



User = get_user_model()

@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone = data.get("phone")
        date_of_birth = data.get("date_of_birth")  # format: YYYY-MM-DD

        if not (username and email and password):
            return JsonResponse({"error": "All fields required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        user.save()

        # Save profile fields
        profile = user.profile
        profile.phone = phone
        profile.date_of_birth = date_of_birth
        profile.save()

        return JsonResponse({"message": "Signup successful!"})





def get_doctors(request):
    doctors = Doctor.objects.all()
    data = {
        "doctors": [
            {
                "id": doctor.id,
                "name": doctor.name,
                "specialization": doctor.specialization,
                "image": doctor.image.url if doctor.image else "",
            }
            for doctor in doctors
        ]
    }
    return JsonResponse(data)

@csrf_exempt
def send_consultation_message(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        member_id = data['member_id']
        doctor_id = data['doctor_id']
        message = data['message']

        member = Member.objects.get(id=member_id)
        doctor = Doctor.objects.get(id=doctor_id)

        Consultation.objects.create(member=member, doctor=doctor, message=message)
        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'fail'}, status=400)



@login_required
def get_profile(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

    data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'phone': profile.phone,
        'date_of_birth': profile.date_of_birth,
        'avatar': profile.avatar.url if profile.avatar else '',
    }

    return JsonResponse(data)



