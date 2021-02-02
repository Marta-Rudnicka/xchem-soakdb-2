# Generated by Django 3.1.5 on 2021-01-26 17:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0036_lab'),
    ]

    operations = [
        migrations.CreateModel(
            name='SoakDBCompound',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('library_name', models.CharField(max_length=100)),
                ('library_plate', models.CharField(max_length=100)),
                ('well', models.CharField(max_length=4)),
                ('code', models.CharField(max_length=100)),
                ('smiles', models.CharField(max_length=256)),
                ('proposal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exp_compounds', to='playground.proposal')),
            ],
        ),
    ]
