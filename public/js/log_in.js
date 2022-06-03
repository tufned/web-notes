const logIn_title = document.querySelector('.log-in-form_title');
const logIn_name = document.querySelector('.log-in_i-name');
const logIn_pass = document.querySelector('.log-in_i-password');
const logIn_confPass = document.querySelector('.log-in_i-conf-password');
const logIn_but = document.querySelector('.log-in-form_but');


// auto log in
const curUser = localStorage.getItem('curUser');
if (curUser != null) window.location.href = 'http://127.0.0.1:8000/html/home.html';



//  setup data
let usersData = [];
for (let elem of User.getInfo()) {
    let user = new User(elem._name, elem._pass);
    usersData.push(user);
}


let userName = '';
let existUser = false;
logIn_name.addEventListener('change', () => {
    userName = logIn_name.value;

    // exist user check
    existUser = false;
    for (let elem of usersData) if (elem._name == userName) existUser = true;

    if (existUser == true) {
        logIn_title.innerHTML = 'Log In';
        logIn_confPass.style.display = 'none';
    }
    else {
        logIn_title.innerHTML = 'Sing Up';
        logIn_confPass.style.display = 'block';
    }
});



let password = '';
logIn_pass.addEventListener('input', () => {password = logIn_pass.value});
User.password_toggle(logIn_pass);

let confPassword = '';
logIn_confPass.addEventListener('input', () => {confPassword = logIn_confPass.value});
User.password_toggle(logIn_confPass);








let passCheck = false;
logIn_but.addEventListener('click', () => {
    // password check 
    for (let user of usersData) {
        if (passCheck == false) passCheck = user.password_check(userName, password);
    }

    if (existUser == false) {
        if (userName.length > 0 && password.length > 0 && confPassword.length > 0 && password == confPassword) {
            let userData_obj = {'_name': userName, '_pass': password};
            usersData.push(userData_obj);
            
            // send to local storage
            localStorage.setItem('curUser', userName);
        
            User.sendInfo(usersData);

            
            // createNewUser in notesData.json
            for (let user of usersData) {
                if (userName == user._name) {
                    let obj = {}
                    obj[user._name] = {};

                    User.sendInfo(obj);
                }
            }


            window.location.href = 'http://127.0.0.1:8000/html/home.html';
        }
        else inputsCheck_error();
    }
    else {
        if (userName.length > 0 && password.length > 0 && passCheck == true) {            
            // send to local storage
            localStorage.setItem('curUser', userName);

            window.location.href = 'http://127.0.0.1:8000/html/home.html';
        }
        else inputsCheck_error();
    }
});






function inputsCheck_error() {
    if (userName.length == 0) logIn_name.style.border = '2px solid #ff4538df';
    if (password.length == 0) logIn_pass.style.border = '2px solid #ff4538df';
    if (confPassword.length == 0) logIn_confPass.style.border = '2px solid #ff4538df'; 

    if (password != confPassword) {
        logIn_pass.style.border = '2px solid #ff4538df';
        logIn_confPass.style.border = '2px solid #ff4538df'; 
    }
}