import os
import uuid
from django.utils.timezone import now



OPTIONAL_FIELD = {
    'null': True,
    'blank': True
}


def upload_files_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    path = instance._meta.model_name
    new_filename = '{}_{}{}'.format(
        uuid.uuid4(),
        now().strftime("%Y%m%d%H%M%S"),
        filename_ext.lower()
    )
    return '{}/{}'.format(path, new_filename)