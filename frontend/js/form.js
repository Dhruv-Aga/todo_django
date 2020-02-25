    var base_url = "http://127.0.0.1:8000"
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', base_url);
    headers.append('Access-Control-Allow-Credentials', true);
    var authenticated = false;
    var tasks = [];
    document.getElementById('logout-button').style.display = "none";

    function refresh_auth() {
        if (authenticated) {
            document.getElementById('login-button').style.display = "none";
            document.getElementById('signin-button').style.display = "none";
            document.getElementById('logout-button').style.display = "block";
        } else {
            document.getElementById('login-button').style.display = "block";
            document.getElementById('signin-button').style.display = "block";
            document.getElementById('logout-button').style.display = "none";
        }
    }

    $.ajax({
        url: base_url + "/check_login/",
        type: "post",
        credentials: 'include',
        xhrFields: { withCredentials: true },
        header: headers,
        crossDomain: true,
    }).success(function(data, status, res) {
        if (res.status == 200) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Already Logined',
                showConfirmButton: false,
                timer: 1500
            })
            authenticated = true;
            refresh_auth();
            get_task();
        }
    });

    function signup() {
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if (name != undefined && name != null && name !== "" && email != undefined && email != null && email !== "" && password != undefined && password != null && password !== "") {

            $.ajax({
                url: base_url + "/signup/",
                type: "post",
                credentials: 'include',
                xhrFields: { withCredentials: true },
                header: headers,
                crossDomain: true,
                data: { 'name': name, 'email': email, 'password': password },
            }).success(function(data, status, res) {
                if (res.status == 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Signed Up Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // location.reload();
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: data['msg'],
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in values entered',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    function login() {
        var email = document.getElementById('login_email').value;
        var password = document.getElementById('login_password').value;

        if (email != undefined && email != null && email !== "" && password != undefined && password != null && password !== "") {
            console.log({ 'email': email, 'password': password })
            $.ajax({
                url: base_url + "/login/",
                type: "post",
                header: headers,
                xhrFields: { withCredentials: true },
                credentials: 'include',
                crossDomain: true,
                data: { 'email': email, 'password': password },
            }).success(function(data, status, res) {
                if (res.status == 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Logined Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    location.reload();
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: data['msg'],
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in values entered',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    function logout() {
        $.ajax({
            url: base_url + "/logout/",
            type: "post",
            credentials: 'include',
            xhrFields: { withCredentials: true },
            header: headers,
            crossDomain: true,
        }).success(function(data, status, res) {
            if (res.status == 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Logout Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                location.reload();
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: data['msg'],
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    }

    function get_task() {
        $.ajax({
            url: base_url + "/get_task/",
            type: "get",
            xhrFields: { withCredentials: true },
            credentials: 'include',
            header: headers,
        }).success(function(data, status, res) {
            if (res.status == 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Task Refreshed Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                var x = "";
                tasks = data['data'];
                for (var i = 0; i < data['data'].length; i++) {
                    x = x + '<div class=" primary-black col-md-6"><div class="open-description highlight-box"><p class="layer-100"><div class="col-md-11 edit-box" id="edit-box-' + data['data'][i]['id'] + '"><h4> Edit task </h4><br><br><div class="col-sm-4"><label for="title-' + data['data'][i]['id'] + '">Ttile :</label></div><div class="col-sm-7"><div class="form-group"><textarea class="form-control" name="title-' + data['data'][i]['id'] + '" id="title-' + data['data'][i]['id'] + '" ng-maxlength="1000" value="' + data['data'][i]['id'] + '" required></textarea></div></div><div class="col-sm-4"><label for="description-' + data['data'][i]['id'] + '">Description :</label></div><div class="col-sm-7"><div class="form-group"><textarea class="form-control" name="description-' + data['data'][i]['id'] + '" id="description-' + data['data'][i]['id'] + '" ng-maxlength="1000" value="' + data['data'][i]['id'] + '"  required></textarea></div></div><div class="col-sm-10"><center><span class="border-icon primary-color" style="width: 100%; border: 2px solid; padding-bottom: 28px;" data-toggle="tooltip" title="Update task" onclick="edit_task(' + data['data'][i]['id'] + ')">Update Task</span></center></div></div><div class="clearfix"></div><div id="show-box-' + data['data'][i]['id'] + '" class="col-md-11"><b>Title :</b>' + data['data'][i]['title'] + '<br><br><b>Description :</b>' + data['data'][i]['description'] + '</div></p><div class="tool-box"><div class="fluid-container"><center><div data-toggle="tooltip" title="Delete" data-toggle="tooltip" title="Click to delete task" class="border-icon red-color" onclick="delete_task(' + data['data'][i]['id'] + ')"><i class="fa fa-trash"></i></div><div data-toggle="tooltip" title="Edit" data-toggle="tooltip" title="Click to edit task" class="border-icon primary-color" onclick="update_task(' + i + ')"><i class="fa fa-pencil"></i></div><div data-toggle="tooltip" title="Delete" data-toggle="tooltip" title="Click to delete task" class="border-icon resume-color" onclick="check_task(' + data['data'][i]['id'] + ')"><i class="fa fa-check-square-o"></i></div></center></div></div></div></div>';
                }
                document.getElementById("task-area").innerHTML = document.getElementById("task-area").innerHTML + x;
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: data['msg'],
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });

    }


    function add_task() {
        var new_title = document.getElementById('new_title').value;
        var new_description = document.getElementById('new_description').value;
        if (new_title != undefined && new_title != null && new_title !== "" && new_description != undefined && new_description != null && new_description !== "") {
            $.ajax({
                url: base_url + "/add_task/",
                type: "post",
                xhrFields: { withCredentials: true },
                credentials: 'include',
                header: headers,
                data: { 'title': new_title, 'description': new_description },
            }).success(function(data, status, res) {
                if (res.status == 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Added Task Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    location.reload();
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: data['msg'],
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in values entered',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    function update_task(index) {
        document.getElementById('title-' + tasks[index]['id']).value = tasks[index]['title'];
        document.getElementById('description-' + tasks[index]['id']).value = tasks[index]['description'];
        document.getElementById("edit-box-"+tasks[index]['id']).style.display = "block";
        document.getElementById("show-box-"+tasks[index]['id']).style.display = "none";
    }

    function edit_task(id) {
        var new_title = document.getElementById('title-' + id).value;
        var new_description = document.getElementById('description-' + id).value;
        if (id != undefined && id != null && new_title != undefined && new_title != null && new_description != undefined && new_description != null) {
            $.ajax({
                url: base_url + "/update_task/",
                type: "put",
                credentials: 'include',
                xhrFields: { withCredentials: true },
                header: headers,
                data: { 'id': id, 'title': new_title, 'description': new_description, 'action': "UPDATE" },
                dataType: 'json'
            }).success(function(status, res) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Added Edit Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                location.reload();
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in values entered',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    function delete_task(id) {
        if (id != undefined && id != null) {
            $.ajax({
                url: base_url + "/delete_task/",
                type: "delete",
                credentials: 'include',
                xhrFields: { withCredentials: true },
                header: headers,
                data: { 'id': id },
            }).success(function(status, res) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Delete Task Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                location.reload();
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in Deleting Task',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    function check_task(id) {

        if (id != undefined && id != null) {
            $.ajax({
                url: base_url + "/update_task/",
                type: "put",
                credentials: 'include',
                xhrFields: { withCredentials: true },
                header: headers,
                data: { 'id': id, 'action': "CHECK" },
                dataType: 'json'
            }).success(function(status, res) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Checked Task Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                location.reload();
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error in checking task',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }