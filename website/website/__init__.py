from flask import Flask

def create_app():
    #creates the flask application
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fljkvdaivtekhbfvkrj#%$&*(UEfljvsavasdv46781293tfgj!JJBD'

    #importing blueprints
    from .views import views
    from .auth import auth 

    app.register_blueprint(views,url_prefix="/")
    app.register_blueprint(auth,url_prefix="/")

    return app