class User {
    constructor (name, pass) {
        this._name = name;
        this._pass = pass;
    }

    static getInfo() {
        let data = {};
        let xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("application/json");
        xhttp.open("GET", './data/usersData.json', false);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status == "200") {
                data = JSON.parse(xhttp.responseText);
            }
        }
        xhttp.send();

        return data;
    }

    password_check(userName, password) {
        if (this._name == userName && this._pass == password) return true;
        else return false;
    }

    static password_toggle (input) {
        const pass_toggle = document.querySelector('.pass_toggle');
        pass_toggle.addEventListener('click', () => {
            if (input.type == 'password') input.type = 'text';
            else input.type = 'password';
        });
    }

    static sendInfo (data) {
        // POST request
        fetch("http://127.0.0.1:8000/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text());
    }
}