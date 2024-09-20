#stores the standard routes of the website
from flask import Blueprint, render_template

views = Blueprint('views',__name__)

@views.route('/')
def home():
    return render_template("home.html")