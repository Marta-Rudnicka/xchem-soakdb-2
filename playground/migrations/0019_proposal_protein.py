# Generated by Django 3.1.5 on 2021-01-25 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0018_proposal'),
    ]

    operations = [
        migrations.AddField(
            model_name='proposal',
            name='protein',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
