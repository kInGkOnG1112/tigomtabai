from main.models import ActivityLog


class AuditLogging:

    def __init__(self):
        self.metadata = {}

    def save(self, request,
             user=None,
             activity_type: str = '',
             activity_details: str = '',
             success: bool = True,
             reference_number_list: dict = None
             ):

        self.metadata = request.POST if request.POST else request.GET
        ActivityLog.objects.create(
            user=user,
            activity_type=activity_type,
            activity_details=activity_details,
            ip_address=request.META.get('REMOTE_ADDR'),
            success=success,
            metadata=self.metadata,
            reference_number_list=reference_number_list
        )


user_activity_log = AuditLogging()
