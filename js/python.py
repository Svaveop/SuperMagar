from flask import Flask, request, render_template, jsonify, session
import sqlite3

signInResponse = False

app = Flask(__name__)
app.secret_key = 'userSessionSaver'


def checkUser(arr, tableName):
    dbSqlite = sqlite3.connect('message.db')
    cSqlite = dbSqlite.cursor()

    cSqlite.execute("""CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        surname TEXT,
        gmail TEXT,
        password TEXT
    )
    """)

    cSqlite.execute("""CREATE TABLE IF NOT EXISTS message(
        name TEXT,
        surname TEXT,
        password TEXT
    )
    """)

    cSqlite.execute(f"SELECT * FROM {tableName}")
    usersListFunc = cSqlite.fetchall()

    if len(usersListFunc) > 0:
        for user in usersListFunc:
            isRegistered = True

            for j in range(len(user)):
                if arr[j] != None and arr[j] != user[j]:
                    isRegistered = False
                    break

            if isRegistered:
                userId = user[0]
                dbSqlite.close()
                return userId

        return False
    else:
        isRegistered = False
        dbSqlite.close()
        return isRegistered

    dbSqlite.close()

@app.route("/messages", methods=["GET"])
def messages():

    db = sqlite3.connect("message.db")
    c = db.cursor()

    c.execute("SELECT * FROM message")

    datas = c.fetchall()

    db.close()

    return jsonify(datas)





@app.route("/send", methods=["POST"])
def send():

    data = request.json

    print(data)

    db = sqlite3.connect('message.db')
    c = db.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS message(
        name TEXT,
        surname TEXT,
        password TEXT
    )
    """)

    c.execute("""
        INSERT INTO message(name, surname, password)
        VALUES (?, ?, ?)
    """,
    (
        data["name"],
        data["surname"],
        data["password"]
    ))

    c.execute("""
        SELECT * FROM message
    """)

    datas = c.fetchall()

    db.commit()
    db.close()

    return jsonify(datas)

@app.route("/sendSignUp", methods=["POST"])
def sendSignUp():


    data = request.json

    print(data)

    id = checkUser([None, data['name'], data['surname'], data['gmail'], data['password']], 'users')

    if id:
        return jsonify('This account is alredy created, you can sign in now')
    else:
        db = sqlite3.connect('message.db')
        c = db.cursor()

        c.execute("""CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            surname TEXT,
            gmail TEXT,
            password TEXT
        )
        """)

        c.execute("""
            INSERT INTO users(name, surname, gmail, password)
            VALUES (?, ?, ?, ?)
        """,
        (
            data["name"],
            data["surname"],
            data["gmail"],
            data["password"]
        ))

        session['user_id'] = c.lastrowid

        db.commit()
        db.close()

        return jsonify('recieved')

@app.route("/sendSignIn", methods=["POST"])
def sendSignIn():

    data = request.json

    userId = checkUser([None, None, None, data['gmail'], data['password']], 'users')

    session['user_id'] = userId

    if userId:
        return jsonify(True)
    else:
        return jsonify(False)

@app.route("/sendAccount", methods=["POST"])
def sendAccount():

    userId = session.get("user_id")

    db = sqlite3.connect('message.db')
    c = db.cursor()

    c.execute(
        "SELECT * FROM users WHERE id=?",
        (userId,)
    )

    user = c.fetchone()

    db.close()

    return jsonify(user)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/first")
def first():
    return render_template("first.html")

@app.route("/signin")
def signin():
    return render_template("signin.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

app.run()