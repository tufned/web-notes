class PrivateNote extends Note {
    constructor (id, title, text, publication_date, owner, curUser, pinned) {
        super(id, title, text, publication_date, owner, curUser)
        this.pinned = pinned;
    }

    render () {
        document.querySelector('.notes-container').innerHTML += super.render('Private');
    }

    create () {
        let newNote_data = super.create('private');
        Object.values(newNote_data)[0]['pinned'] = this.pinned;

        localStorage.setItem('newNote_data', JSON.stringify(newNote_data));

        window.location.href = 'http://127.0.0.1:8000/html/note.html';
    }

    setPinIcon () {
        const pinIcon = document.querySelectorAll('.pin-icon');
        for (let elem of pinIcon) {
            const id = elem.parentNode.parentNode.parentNode.id;
            if (this._id == id && this.pinned == true) {
                elem.src = '../icons/label_FILL1_wght400_GRAD0_opsz40.svg'
            }
        }
    }

    pin (data) {
        const userNotes = data[this._curUser];
        
        if (this.pinned == false) {
            this.pinned = true;
            userNotes[this._id]['pinned'] = this.pinned;

            Note.sendInfo('http://127.0.0.1:8000/html/home.html', data);
            location.reload();
        }
        else {
            this.pinned = false;
            userNotes[this._id]['pinned'] = this.pinned;

            Note.sendInfo('http://127.0.0.1:8000/html/home.html', data);
            location.reload();
        }
        
    }
}