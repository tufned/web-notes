class Author extends User{
    constructor (name, sharedNotes) {
        super(name);
        this.sharedNotes = sharedNotes;
    }

    sharedNotes_render (notesData) {
        let count = 0;
        let notesInfo = {};
        
        for (let name in notesData) {
            if (curUser == name) {
                for (let id in notesData[name]) {
                    if (notesData[name][id]['readers'] != null && notesData[name][id]['owner'] == curUser) {
                        count++;
                        notesInfo[id] = notesData[name][id]['readers'];
                    }
                }
            }
        }

        const sharedNotes = document.querySelector('.shared-notes');
        sharedNotes.innerHTML = count;

        const sharedNotesShell = document.querySelector('.shared-notes-shell');
        if (count > 0) sharedNotesShell.style.display = 'block';
        else sharedNotesShell.style.display = 'none';
        
        this.read_sharedNotes = notesInfo;
    }

    shareIconChange () {
        for (let id in this.read_sharedNotes) {
            let note = document.getElementById(id);
            let sharedIcon = note.querySelector('.link-icon');
            sharedIcon.src = '../icons/link_FILL0_wght400_GRAD0_opsz48_green.svg';


            let sharedIconShell = note.querySelector('.link-icon-shell_public');
            sharedIconShell.classList.add('link-icon-shell_shared');

            let p = document.createElement('p');
            p.innerHTML = this.read_sharedNotes[id].length;
            sharedIconShell.append(p);
        }
    }
}