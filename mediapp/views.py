from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse

from django.http import JsonResponse
from .models import HealthActivity, Consultation
from django.http import JsonResponse
from mediapp.models import Member , Doctor # adjust this if the model is in a different app

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


#def get_doctors(request):
#    doctors = Doctor.objects.all()
#    data = [{
 #       'id': doc.id,
  #      'name': doc.name,
   #     'specialization': doc.specialization,
  #  'image': doc.image.url if doc.image else ''
   # } for doc in doctors]
   # return JsonResponse({'doctors': data})

from django.http import JsonResponse
from .models import Doctor

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


