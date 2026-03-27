from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.tokens.models import Token
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Deletes all tokens booked for the current day to reset the system.'

    def handle(self, *args, **options):
        today = timezone.now().date()
        tokens_to_delete = Token.objects.filter(date=today)
        count = tokens_to_delete.count()
        
        if count > 0:
            tokens_to_delete.delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} tokens for {today}'))
            logger.info(f'Daily reset: Deleted {count} tokens for {today}')
        else:
            self.stdout.write(self.style.WARNING(f'No tokens found to reset for {today}'))
