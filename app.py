from flask import Flask, render_template, request

app = Flask(__name__)

app.config['SECRET_KEY'] = 'I am a secret. Shhhhhh!'

@app.route('/')
def homepage():
    return render_template('home.html')

@app.route('/favicon.ico')
def send_icon():
    return '/imgs/images.png'