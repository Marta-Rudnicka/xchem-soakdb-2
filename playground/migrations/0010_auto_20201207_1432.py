# Generated by Django 3.1.1 on 2020-12-07 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0009_auto_20201207_1424'),
    ]

    operations = [
        migrations.AlterField(
            model_name='library',
            name='proposal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
