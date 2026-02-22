from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(["GET"])
def api_root(request, format=None):
    return Response({
        "users":    reverse("users:list", request=request, format=format),
        "projects": reverse("projects:list", request=request, format=format),
        "tasks":    reverse("tasks:list", request=request, format=format),
        "token_obtain_pair": reverse("token_obtain_pair", request=request, format=format),
        "token_refresh": reverse("token_refresh", request=request, format=format),
    })


#  above api_root output is :
# {
#     "users": "http://localhost:8000/api/users/",
#     "projects": "http://localhost:8000/api/projects/",
#     "tasks": "http://localhost:8000/api/tasks/",
#     "token_obtain_pair": "http://localhost:8000/api/token/",
#     "token_refresh": "http://localhost:8000/api/token/refresh/"
# }



 