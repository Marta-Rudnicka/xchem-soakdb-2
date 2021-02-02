# Generated by Django 3.1.5 on 2021-01-25 21:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0025_compound'),
    ]

    operations = [
        migrations.CreateModel(
            name='SourceWell',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('well', models.CharField(max_length=4)),
                ('concentration', models.IntegerField(blank=True, null=True)),
                ('compound', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='locations', to='playground.compound')),
                ('library_plate', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='compounds', to='playground.libraryplate')),
            ],
        ),
    ]