from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('Strongly Typed by HTML5 UP.html')

if __name__ == "__main__":
    app.run(debug=True)