const curUser = localStorage.getItem('curUser');



// getting data from notesData.json
let notesData_full = Note.getInfo()
let notesData = {};
for (let key in notesData_full) {
    if (curUser == key) notesData = notesData_full[curUser];
}



// notes classes setup
let publicNote = '';
let privateNote = '';
const noteClasses_all = [];

for (let key in notesData) {
    if (notesData[key].type == 'public') {
        publicNote = new PublicNote(
            key, 
            notesData[key].title, 
            notesData[key].text, 
            notesData[key].publicationDate, 
            notesData[key].owner,
            curUser,
            notesData[key].url,
            notesData[key].readers
        );
        noteClasses_all.push(publicNote);
    }
    else if (notesData[key].type == 'private') {
        privateNote = new PrivateNote(
            key, 
            notesData[key].title, 
            notesData[key].text, 
            notesData[key].publicationDate, 
            notesData[key].owner,
            curUser,
            notesData[key].pinned
        );
        noteClasses_all.push(privateNote);
    }
}




// notes render
for (let elem of noteClasses_all) {
    if (elem.pinned == true) {
        elem.render();
        elem.setPinIcon();
    }

}
for (let i = noteClasses_all.length - 1; i >= 0; i--) {
    if (noteClasses_all[i]['pinned'] != true) noteClasses_all[i].render();
}





// open notes
const noteTitleLink_all = document.querySelectorAll('.note-title');
for(let elem of noteTitleLink_all) {
    elem.addEventListener('click', () => {
        const elem_id = elem.parentNode.parentNode.parentNode.id;
        localStorage.setItem('opennedNote', elem_id);
    });
}




// create notes
function setDate() {
    const date = new Date();
    let hours = date.getHours();
    let min = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (String(date.getHours()).length == 1) hours = `0${date.getHours()}`;
    if (String(date.getMinutes()).length == 1) min = `0${date.getMinutes()}`;

    return `${hours}:${min} ${day}.${month}.${date.getFullYear()}`;
}

function setId() {
    let res = '';
    const symb = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        res += symb.charAt(Math.floor(Math.random() * symb.length));
    }
    return res;
}

function setUrl() {
    let res = `http://127.0.0.1:8000?note=`;
    const symb = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
        res += symb.charAt(Math.floor(Math.random() * symb.length));
    }
    return res;
}

const createNotePrivat_but = document.querySelector('.c-p_private-note');
createNotePrivat_but.addEventListener('click', () => {
    const privateNote_new = new PrivateNote(setId(), '', '', setDate(), curUser, curUser, false, []);
    privateNote_new.create();
})

const createNotePublic_but = document.querySelector('.c-p_public-note');
createNotePublic_but.addEventListener('click', () => {
    const publicNote_new = new PublicNote(setId(), '', '', setDate(), curUser, curUser, setUrl());
    publicNote_new.create();
})









function deleteAndPinNotes_proto(arr, func) {
    for (let elem of arr) {
        elem.addEventListener('click', () => {
            const elem_id = elem.parentNode.parentNode.id;
            
            for (let key in noteClasses_all) {
                if (noteClasses_all[key]['_id'] == elem_id) func(noteClasses_all[key]);
            }
        });
    }
}

// pin private notes
const pinIcon_all = document.querySelectorAll('.note-pin-shell_private');
deleteAndPinNotes_proto(pinIcon_all, (noteClass) => {
    noteClass.pin(notesData_full);
})

// detele notes
const removeIcon_all = document.querySelectorAll('.remove-icon-shell');
deleteAndPinNotes_proto(removeIcon_all, (noteClass) => {
    noteClass.delete(notesData_full);
});






// link menu render
const linkButs = document.querySelectorAll('.link-icon-shell_public');
for (let elem of linkButs) {
    elem.addEventListener('click', () => {
        const elem_id = elem.parentNode.parentNode.id;
        let urlMenu_cont = elem.parentNode.querySelector('.link_popup-info_cont');
        let urlMenu = urlMenu_cont.querySelector('.link_popup-info-shell');

        if (urlMenu == null) {
            for (let note of noteClasses_all) {
                if (note['_id'] == elem_id) {
                    urlMenu_cont.innerHTML += note.url_menu();
                }
            }
        }
        else urlMenu.remove();
    });
}




// adding url note
let urlNote_input_value = ''
const urlNote_input = document.querySelector('.url-input');
urlNote_input.addEventListener('change', () => {
    urlNote_input_value = urlNote_input.value;
});

const urlNote_but = document.querySelector('.url-note-add-but');
urlNote_but.addEventListener('click', () => {
    if (urlNote_input_value.trim() != '') {
        const urlNote = PublicNote.urlNote_find(notesData_full, urlNote_input_value, curUser);
        PublicNote.urlNote_add(notesData_full, urlNote, curUser);
        
    }
});









// header onscroll
const header = document.querySelector('.header');
document.addEventListener('scroll', (e) => {
    if (window.scrollY > 18) {
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, .1)';
        header.style.height = '80px';
    }
    else {
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0)';
        header.style.height = '100px';
    }
});



// header user info
const user_name = document.querySelector('.user-name');
user_name.innerHTML = curUser;

const logoutBut = document.querySelector('.logout-icon-shell');
logoutBut.addEventListener('click', () => {
    localStorage.removeItem('curUser');
    window.location.href = 'http://127.0.0.1:8000';
});





const readNotes = document.querySelector('.read-notes');
const reader = new Reader(curUser, 0);
readNotes.innerHTML = reader.read_sharedNotes_render(noteClasses_all);



const sharedNotes = document.querySelector('.shared-notes');
const author = new Author(curUser, 0);

sharedNotes.innerHTML = author.sharedNotes_render(notesData_full);
author.shareIconChange();