"""hire URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from login.views import * 

urlpatterns = [
    url(r'^check_login/$', check_login, name='check_login'),
    url(r'^signup/$', signup, name='signup'),
    url(r'^login/$', login, name='login'),
	url(r'^logout/$', logout, name='logout'),
    url(r'^get_task/$', get_task, name='get_task'),
    url(r'^add_task/$', add_task, name='add_task'),
    url(r'^delete_task/$', delete_task, name='delete_task'),
    url(r'^update_task/$', update_task, name='update_task'),
]
