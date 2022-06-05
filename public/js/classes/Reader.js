class Reader extends User{
    constructor (name, read_sharedNotes) {
        super(name);
        this.read_sharedNotes = read_sharedNotes;
    }

    read_sharedNotes_render (notesData) {
        let count = 0;
        for (let key in notesData) {
            if (curUser != notesData[key]['_owner']) {
                count++;
            }
        }

        const readNotes = document.querySelector('.read-notes');
        readNotes.innerHTML = count;

        const readNotesShell = document.querySelector('.read-notes-shell');
        if (count > 0) readNotesShell.style.display = 'block';
        else readNotesShell.style.display = 'none';


        this.read_sharedNotes = count;
        return this.read_sharedNotes
    }
}