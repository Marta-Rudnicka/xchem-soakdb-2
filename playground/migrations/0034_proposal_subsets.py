# Generated by Django 3.1.5 on 2021-01-26 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0033_auto_20210126_0150'),
    ]

    operations = [
        migrations.AddField(
            model_name='proposal',
            name='subsets',
            field=models.ManyToManyField(blank=True, to='playground.LibrarySubset'),
        ),
    ]
