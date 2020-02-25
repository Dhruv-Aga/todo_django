from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    added_by = models.ForeignKey(User, related_name='added_by_task', on_delete=models.SET_NULL, null=True)    
    title = models.CharField(max_length=128)
    status = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    time_stamp = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = True
        db_table = 'task'