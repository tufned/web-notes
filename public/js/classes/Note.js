class Note {
    constructor (id, title, text, date, owner, curUser, ) {
        this._id = id;
        this.title = title;
        this.text = text;
        this._date = date;
        this._owner = owner;
        this._curUser = curUser;
    }

    delete (data) {
        console.log(data);
        let readers = data[this._owner][this._id]['readers']

        if (curUser != this._owner) {
            for (let i = 0; i < readers.length; i++) { 
                if (readers[i] == curUser) { 
                    data[this._owner][this._id]['readers'].splice(i, 1); 
                }
            }
        }


        if (readers != null && curUser == this._owner) {
            for (let elem of readers) {
                delete data[elem][this._id]
            }
        }

        delete data[this._curUser][this._id];
        Note.sendInfo('http://127.0.0.1:8000/html/home.html', data);
        location.reload();
    }

    create (typeName) {
        const id = this._id;
        const noteSetup = {
            "title": this.title,
            "text": this.text,
            "type": typeName,
            "publicationDate": setDate(),
            "owner": this._curUser,
            "url": null,
            "pinned": null,
            "readers": null
        }

        const newNote_data = {};
        newNote_data[id] = noteSetup;
        return newNote_data;
    }

    render (typeName) {
        let typeImg = '';
        let labelImg = '';
        let labelClass = '';
        let linkImg = '';
        let linkClass = '';
        let ownerName = '';
        let readingOnlyImg = '';

        if (typeName == 'Public') {
            typeImg = '../icons/public_FILL0_wght400_GRAD0_opsz48.svg';
            labelImg = '../icons/label_off_FILL0_wght400_GRAD0_opsz40.svg';
            linkImg = '../icons/link_FILL0_wght400_GRAD0_opsz48.svg';
            linkClass = 'link-icon-shell_public';
            if (this._owner != this._curUser) {
                ownerName = `note_another_user-name`;
                readingOnlyImg = '<img src="../icons/visibility_FILL0_wght400_GRAD0_opsz40.svg" class="reading_only-icon" alt="">';
                linkImg = '../icons/link_off_FILL0_wght400_GRAD0_opsz48.svg';
                linkClass = '';
            }
        }
        else if (typeName == 'Private') {
            typeImg = '../icons/lock_FILL0_wght400_GRAD0_opsz48.svg';
            labelImg = '../icons/label_FILL0_wght400_GRAD0_opsz40.svg';
            labelClass = 'note-pin-shell_private';
            linkImg = '../icons/link_off_FILL0_wght400_GRAD0_opsz48.svg';
        }


        let note_rendered = `<div class="note-shell" id=${this._id}>
                                <div class="note-right-side">
                                    <div class="note-pin-shell ${labelClass}">
                                        <img src="${labelImg}" alt="" class="pin-icon">
                                    </div>
                                    <div class="note_info-shell">
                                        <a href="../html/note.html" class="note-title">${this.title}</a>
                                        ${readingOnlyImg}
                                        <div class="note_extra-info">
                                            <div class="note-type">
                                                <img src="${typeImg}" alt="">
                                                <p>${typeName}</p> 
                                            </div>
                                            <div class="note-date">${this._date}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="note_user-name ${ownerName}">${this._owner}</div>
                                <div class="note_but-shell">
                                    <div class="note_icon-shell link-icon-shell ${linkClass}"> 
                                        <img src="${linkImg}" class="link-icon" alt="">
                                    </div>
                                    <div class="note_icon-shell remove-icon-shell">
                                        <div class="remove-icon"></div>
                                    </div>
                                    <div class="link_popup-info_cont"></div>
                                </div>
                            </div>`;

        

        return note_rendered;
    }

    static sendInfo (url, data) {
        // POST request
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text());
    }

    static getInfo() {
        let notesData = {};
        let xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("application/json");
        xhttp.open("GET", 'http://127.0.0.1:8000/data/notesData.json', false);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status == "200") {
                notesData = JSON.parse(xhttp.responseText);
            }
        }
        xhttp.send();

        return notesData;
    }

    static titleFormating(title, text) {
        if (title.trim() == '') {
            let noteText_totitle = '';
            for (let i = 0; i < 20; i++) {
                if (text[i] != undefined) {
                    if (i < 19) {
                        noteText_totitle += text[i];
                    }
                    else noteText_totitle += '...';
                }
            }
            Object.values(note_data)[0]['title'] = noteText_totitle;
        }
    }
}