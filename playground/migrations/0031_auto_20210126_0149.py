# Generated by Django 3.1.5 on 2021-01-26 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0030_auto_20210126_0147'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='library',
            name='proposal',
        ),
        migrations.AddField(
            model_name='library',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
