from rest_framework.routers import DefaultRouter
from requests.views.api_views import BorrowRequestViewSet

router = DefaultRouter()
router.register(r'borrow-requests', BorrowRequestViewSet, basename='borrow-requests')

urlpatterns = router.urls
