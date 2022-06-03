const curUser = localStorage.getItem('curUser');
const input_title = document.querySelector('.opened_note-title');
const input_text = document.querySelector('.textarea');
const backIcon = document.querySelector('.back-icon-shell');




// data setup
let note_data = '';
if (localStorage.getItem('newNote_data') != null) {
    note_data = JSON.parse(localStorage.getItem('newNote_data'));
}
else if (localStorage.getItem('opennedNote') != null) {
    note_data = Note.getInfo();
    for (let key in note_data) {
        if (curUser == key) note_data = note_data[curUser];
    }

    for (let key in note_data) {
        if (key != localStorage.getItem('opennedNote')) delete note_data[key];
    }

    input_title.value = note_data[localStorage.getItem('opennedNote')]['title'];
    input_text.value = note_data[localStorage.getItem('opennedNote')]['text'];
}



const input_title_value = input_title.value;
const input_text_value = input_text.value;





function titleLengthCheck() {
    if (input_title.value.length > 19) {
        input_title.onkeypress = () => {return false}
    }
    if (input_title.value.length <= 19) {
        input_title.onkeypress = () => {return true}
    }
}
titleLengthCheck();





function writeAllowCheck() {
    for (let id in note_data) {
        if (note_data[id]['owner'] == curUser) return true;
        else return false
    }
}


if (writeAllowCheck() == true) {
    // inputs data changes listener
    input_title.addEventListener('input', () => {
        titleLengthCheck()
    });
    input_title.addEventListener('change', () => {
        Object.values(note_data)[0]['title'] = input_title.value;
    });

    input_text.addEventListener('change', () => {
        Object.values(note_data)[0]['text'] = input_text.value;
    });




    // sending data to server on move back
    backIcon.addEventListener('click', () => {
        const noteTitle = Object.values(note_data)[0]['title'];
        const noteText = Object.values(note_data)[0]['text'];


        if (noteTitle != input_title_value) {
            Note.titleFormating(noteTitle, noteText);
            Note.sendInfo('http://127.0.0.1:8000/html/note.html', note_data);
        }
        else if (noteText != input_text_value) {
            Note.titleFormating(noteTitle, noteText);
            Note.sendInfo('http://127.0.0.1:8000/html/note.html', note_data);
        }


        if (noteTitle == '' && noteText == '') {
            Object.values(note_data)[0]['title'] = 'empty';
            Note.sendInfo('http://127.0.0.1:8000/html/note.html', note_data);
        }

        
        if (localStorage.getItem('newNote_data') != null) localStorage.removeItem('newNote_data');
        else if (localStorage.getItem('opennedNote') != null) localStorage.removeItem('opennedNote');
    }); 
}
else {
    input_title.disabled = "disabled";
    input_title.style.background = '#fff'
    input_text.disabled = "disabled";
    input_text.style.background = '#fff'

    backIcon.addEventListener('click', () => {
        if (localStorage.getItem('opennedNote') != null) localStorage.removeItem('opennedNote');
    })

}