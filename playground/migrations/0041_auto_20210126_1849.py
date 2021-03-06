# Generated by Django 3.1.5 on 2021-01-26 18:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0040_auto_20210126_1846'),
    ]

    operations = [
        migrations.AddField(
            model_name='lab',
            name='compound',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='playground.soakdbcompound'),
        ),
        migrations.AddField(
            model_name='lab',
            name='crystal_name',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='playground.crystal'),
        ),
    ]
