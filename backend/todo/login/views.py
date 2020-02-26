from django.contrib.auth import login as auth_login 
from django.contrib.auth import logout as auth_logout 
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
import json 
from django.http import QueryDict
from django.urls import reverse
from django.contrib.auth.models import User
from .models import *
# Create your views here.

def check_login(request):
    status = 500
    if request.method == 'POST' and request.user.is_authenticated:
        data = { 'msg' : "Already Logined" }
        status = 200
    else:        
        data = { 'msg' : "Login to see tasks" }
        status = 202

    return JsonResponse(data=data, status=status)


def signup(request):
    status = 500
    if request.method == 'POST':
        form_data = request.POST
        user = form_data['email']
        password = form_data['password']
        first_name = form_data['name']
        create_user = User.objects.create_user(email=user, username=user, password=password, first_name=first_name)
        user = authenticate(username=user, password=password)
        if create_user:
            auth_login(request, user)
            return HttpResponse("You are Successfully Signed Up")
            data = { 'msg' : "User Added Successfully", 'user': user.session}
            status = 200
        else:
            data = { 'msg' : "User Not Added. Try Again" }
            status = 202

    elif request.method == 'GET':
        form_data = request.GET
        user = form_data['user']
        count = User.objects.filter(username_contains=user).count()
        if count > 0:
            data = { 'msg' : "Username Already Taken" }
            status = 202
        else:
            data = { 'msg' : "Username is fresh" }
            status = 200

    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)


def login(request):
    status = 500
    if request.method == 'POST':
        form_data = request.POST
        user = form_data['email']
        password = form_data['password']
        create_user = User.objects.filter(username=user, password=password)
        user = authenticate(username=user, password=password)
        if user is not None:
            auth_login(request, user)
            data = { 'msg' : "User logined Successfully" }
            status = 200
        else:
            data = { 'msg' : "Error in login. Try Again" }
            status = 202

    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)


def logout(request):
    status = 500
    if request.method == 'POST' and request.user.is_authenticated:
        auth_logout(request)
        data = { 'msg' : "Logout Successfully" }
        status = 200

    else:        
        data = { 'msg' : "Error in Logout" }
        status = 403

    return JsonResponse(data=data, status=status)


def get_task(request):
    status = 500
    if request.method == 'GET' and request.user.is_authenticated:
        added_by = request.user
        all_task = list(Task.objects.filter(added_by=added_by, status=0).order_by("-id").values()[:10])
        if all_task:
            data = { 'msg' : "Task Refreshed Successfully", 'data': all_task }
            status = 200
        else:
            data = { 'msg' : "No Task Available" }
            status = 202    

    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)


def add_task(request):
    status = 500
    if request.method == 'POST' and request.user.is_authenticated:
        added_by = request.user
        form_data = request.POST
        title = form_data['title']
        description = form_data['description']

        task_count = Task.objects.filter(added_by=added_by, status=0).count()

        if task_count < 10:
        	create_task = Task.objects.create(added_by=added_by, title=title, description=description)
	        if create_task:
	            data = { 'msg' : "Task Added Successfully" }
	            status = 200
	        else:
	            data = { 'msg' : "Task Not Added. Try Again" }
	            status = 202
        else:
        	data = { 'msg' : "Task Limit Reached" }
        	status = 202       
    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)


def delete_task(request):
    status = 500
    if request.method == 'DELETE' and request.user.is_authenticated:
        added_by = request.user
        form_data = QueryDict(request.body)
        task_id = form_data.get('id')
        update_task = Task.objects.filter(id=task_id, added_by=added_by).update(status=-1)
        if update_task:
            data = { 'msg' : "Task Deleted Successfully" }
            status = 200
        else:
            data = { 'msg' : "Task Not Deleted. Try Again" }
            status = 202        

    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)


def update_task(request):
    status = 500
    if request.method == 'PUT' and request.user.is_authenticated:
        form_data = QueryDict(request.body)
        action = form_data.get('action')
        if action == "UPDATE":
            added_by = request.user
            task_id = form_data.get('id')
            title = form_data.get('title')
            description = form_data.get('description')
            create_task = Task.objects.filter(id=task_id, added_by=added_by).update(title=title, description=description)
            if create_task:
                data = { 'msg' : "Task Updated Successfully" }
                status = 200
            else:
                data = { 'msg' : "Task Not Updated. Try Again" }
                status = 202

        elif action == "CHECK":
            added_by = request.user
            task_id = form_data.get('id')
            create_task = Task.objects.filter(id=task_id, added_by=added_by).update(status=1)
            if create_task:
                data = { 'msg' : "Task Completed Successfully" }
                status = 200
            else:
                data = { 'msg' : "Task Not Completed. Try Again" }
                status = 202
        else:
            data = { 'msg' : "Bad Request" }
            status = 403
    else:        
        data = { 'msg' : "Bad Request" }
        status = 403

    return JsonResponse(data=data, status=status)