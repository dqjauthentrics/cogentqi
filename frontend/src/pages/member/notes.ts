import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Globals} from '../../providers/globals';
import {MemberNoteProvider} from '../../providers/member-note';

@Component({
    templateUrl: 'notes.html'
})
export class MemberNotesPage {
    public member: any;
    public notes;
    public newNote = {memberId: 0, content: ''};

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, private memberNoteProvider: MemberNoteProvider) {
        this.member = this.navParams.data;
        this.newNote.memberId = this.member.id;
        this.memberNoteProvider.getForMember(this.member.id).then((notes) => {
            this.notes = notes;
        });
    }

    setDirty(note) {
        note.dirty = true;
    }

    save(note) {
        note.saving = true;
        this.memberNoteProvider.remove(note.id, false).then(() => {
            note.saving = false;
        });
    }

    add() {
        if (!this.newNote.content || this.newNote.content.length === 0) {
            this.globals.alertWarning('You must enter some note text before saving it.');
        }
        else {
            this.newNote.memberId = this.member.id;
            this.memberNoteProvider.update(this.newNote, false).then((note) => {
                this.notes.push(note);
            });
        }
    }

    flag(note) {
        note.flag = note.flag === 1 ? 0 : 1;
        note.saving = true;
        this.memberNoteProvider.update(note, false).then(() => {
            note.saving = false;
        });
    }

    remove(note) {
        let comp = this;
        this.globals.confirm('Remove this note, permanently?', function () {
            note.saving = true;
            comp.memberNoteProvider.remove(note.id, false).then(() => {
                for (let i = 0; i < comp.notes.length; i++) {
                    if (comp.notes[i].id === note.id) {
                        comp.notes.splice(i, 1);
                        break;
                    }
                }
            });
        });
    }

    thumbsUp(note) {
        note.flag = note.flag === 2 ? 0 : 2;
        note.saving = true;
        this.memberNoteProvider.update(note, false).then(() => {
            note.saving = false;
        });
    }

    goToMember(member) {
        this.nav.pop();
    }
}



