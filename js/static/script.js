let add = document.getElementById('add')
let button = document.getElementById('but')
let request = document.getElementById('request')
let inputName = document.getElementById('name')
let inputSurname = document.getElementById('surname')
let inputPassword = document.getElementById('password')
let infoP = document.getElementById('fullNameP')

let cardCont = document.getElementById('card-cont')

let close = document.getElementById('close')

//sign up
let signUpName = document.getElementById('signUpName')
let signUpSurname = document.getElementById('signUpSurname')
let signUpGmail = document.getElementById('signUpGmail')
let signUpPassword = document.getElementById('signUpPassword')
let signUpButton = document.getElementById('signUpButton')

//sign in
let signInGmail = document.getElementById('signInGmail')
let signInPassword = document.getElementById('signInPassword')
let signInButton = document.getElementById('signInButton')



function createNewCardCont(name, surname, password) {
    let newCard = document.createElement('div')
    newCard.className = 'card'

    let newNameP = document.createElement('p')
    newNameP.innerText = name
    newNameP.className = 'name'
    newCard.appendChild(newNameP)

    let newSurnameP = document.createElement('p')
    newSurnameP.innerText = surname
    newSurnameP.className = 'surname'
    newCard.appendChild(newSurnameP)

    let newPasswordP = document.createElement('p')
    newPasswordP.innerText = password
    newPasswordP.className = 'password'
    newCard.appendChild(newPasswordP)

    cardCont.appendChild(newCard)
}



if(add) {
    add.onclick = () => {
        request.style.display = 'flex'
        add.style.pointerEvents = "none"
        button.style.pointerEvents = "all"

        inputName.value = ''
        inputSurname.value = ''
        inputPassword.value = ''
    }
}

if(button) {
    button.onclick = (e) => {

        request.style.display = 'none'
        add.style.pointerEvents = "all"
        button.style.pointerEvents = "none"

        let name = inputName.value
        let surname = inputSurname.value
        let password = inputPassword.value


        fetch("http://127.0.0.1:5000/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            for(let i of data) {
                createNewCardCont(i[0], i[1], i[2])
            }
        })
    }
}

//sign up
if(signUpButton) {
    signUpButton.onclick = (e) => {
        e.preventDefault()

        let signUpNameVal = signUpName.value
        let signUpSurnameVal = signUpSurname.value
        let signUpGmailVal = signUpGmail.value
        let signUpPasswordVal = signUpPassword.value


        fetch("http://127.0.0.1:5000/sendSignUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: signUpNameVal,
                surname: signUpSurnameVal,
                gmail: signUpGmailVal,
                password: signUpPasswordVal
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data == 'recieved') {
                location.href = '/first'
            } else {
                alert(data)
            }
        })
    }
}
//sign up ends

//sign in
if(signInButton) {
    signInButton.onclick = (e) => {
        e.preventDefault()

        let signInGmailVal = signInGmail.value
        let signInPasswordVal = signInPassword.value


        fetch("http://127.0.0.1:5000/sendSignIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gmail: signInGmailVal,
                password: signInPasswordVal
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data) {
                location.href = '/first'
            } else {
                alert('Excuse me. You are not our user. Sign up, or write your Gmail and Password correct')
            }
        })
    }
}

if(location.pathname == '/first') {
    fetch("http://127.0.0.1:5000/sendAccount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: null
    })
    .then(response => response.json())
    .then(data => {
        let nameAccounut = data[1]
        let surnameAccounut = data[2]
        let gmailAccounut = data[3]
        let passwordAccounut = data[4]

        infoP.innerText = nameAccounut + ' ' + surnameAccounut
    })
    if(close) {
        close.onclick = () => {
            request.style.display = 'none'
            add.style.pointerEvents = "all"
            button.style.pointerEvents = "none"
        }
    }
    
    fetch("/messages").then(response => response.json()).then(data => {
    
        for (let user of data) {
            createNewCardCont(user[0], user[1], user[2])
        }
    
    })
}
//sign in ends