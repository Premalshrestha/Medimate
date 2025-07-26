from django.db import models

# Create your models here.
class Post(models.Model):
    title=models.CharField(max_length=100,blank=False)
    content=models.TextField(blank=False)
    created_at=models.DateTimeField(auto_now_add=True, blank=False)
    def __str__(self):

       return self.name

class Member(models.Model):
    name= models.CharField(max_length =100, blank=False, null= False)
    age= models.IntegerField(blank= False, null= False)
    sex=models.CharField(max_length=10, blank= False, null= False)
    
    #yo chai family id nahalney ko lagi blannk =true rakheko 
    family_id = models.IntegerField()
    
    #sabaile aafno lukauna milxa so eslai boolean type ma rakheko
    show_age=models.BooleanField(default=True)


    #yo function chai hamro name chai database ma herda dekhiyos vanera rakheko ho
    def __str__(self):

       return self.name
    
class HealthActivity(models.Model):
    icon = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    description = models.TextField()
    time = models.CharField(max_length=100)
    color = models.CharField(max_length=100)

    def __str__(self):
        return self.title
    

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    image = models.ImageField(upload_to='doctors_images/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Consultation(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member.name} with {self.doctor.name}"
    