class PublicNote extends Note {
    constructor (id, title, text, date, owner, curUser, url, readers) {
        super(id, title, text, date, owner, curUser)
        this._url = url;
        this.readers = readers;
    }

    render () {
        document.querySelector('.notes-container').innerHTML += super.render('Public');
    }
    
    create () {
        let newNote_data = super.create('public');

        Object.values(newNote_data)[0]['url'] = this._url;
        
        localStorage.setItem('newNote_data', JSON.stringify(newNote_data));

        window.location.href = 'http://127.0.0.1:8000/html/note.html';
    }

    url_menu () {
        function readersFormat(readers) {
            let readersStr = ''
            if (readers == null) readersStr = '-';
            else readersStr = readers.join(', ');
            return readersStr;
        }

        const urlMenu = `<div class="link_popup-info-shell">
                            <p class="url">${this._url}</p>
                            <div class="involved-users-shell">
                                <p>Users who have access to this note:</p>
                                <div class="involved-users_names">${readersFormat(this.readers)}</div>
                            </div>
                        </div>`
        return urlMenu;
    }

    static urlNote_find (data, url, curUser) {
        for (let key in data) {
            if (curUser != key) {
                let inData = data[key];
                for(let key_2 in data[key]) {
                    if (inData[key_2]['url'] == url) {
                        let obj = {};
                        obj[key_2] = inData[key_2];
                        
                        return obj;
                    }
                }
            }
        }
    }

    static urlNote_add (data, note, curUser) {
        // return data with the note
        let owner = '';
        let id = ''

        // adding note to the curUser
        for (let key in data) {
            if (curUser == key) {
                for (let noteKey in note) {
                    data[key][noteKey] = note[noteKey];
                    owner = note[noteKey]['owner'];
                    id = noteKey;
                }
            }
        }

        //adding reader to owner
        for (let key in data) {
            if (key == owner) {
                for (let key_2 in data[key]) {
                    if (key_2 == id) {
                        if (data[key][key_2]['readers'] == null) {
                            data[key][key_2]['readers'] = [curUser]
                        }
                        else data[key][key_2]['readers'].push(curUser);
                    }
                }
            }
        }

        Note.sendInfo('http://127.0.0.1:8000/html/home.html', data);
        location.reload();
    }
}