# Generated by Django 3.1.1 on 2020-11-30 13:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0003_auto_20201129_1753'),
    ]

    operations = [
        migrations.AlterField(
            model_name='libraryplate',
            name='library',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='plates', to='playground.library'),
        ),
    ]
