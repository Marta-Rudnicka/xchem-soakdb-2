# Generated by Django 3.1.5 on 2021-01-25 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0017_auto_20210125_2104'),
    ]

    operations = [
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('title', models.CharField(blank=True, max_length=10, null=True)),
                ('fedids', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
