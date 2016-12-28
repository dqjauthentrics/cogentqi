import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {MemberProvider} from "../../providers/member";
import {MemberNoteProvider} from "../../providers/member-note";

@Component({
    templateUrl: 'notes.html'
})
export class MemberNotesPage {
    public member: any;
    public notes;
    public newNote = {memberId: 0, content: ''};

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, private memberData: MemberProvider, private memberNoteProvider: MemberNoteProvider) {
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
        this.memberNoteProvider.remove(note, false).then(() => {
            note.saving = false;
        });
    }

    add() {
        if (!this.newNote.content || this.newNote.content.length == 0) {
            this.globals.alertWarning('You must enter some note text before saving it.');
        }
        else {
            this.memberData.add(this.newNote, true);
        }
    }

    flag(note) {
        note.flag = note.flag == 1 ? 0 : 1;
        note.saving = true;
        this.memberNoteProvider.update(note, false).then(() => {
            note.saving = false;
        });
    }

    remove(note) {
        let comp = this;
        this.globals.confirm('Remove this note, permanently?', function () {
            note.saving = true;
            comp.memberNoteProvider.remove(note, false).then(() => {
                note.saving = false;
            });
        });
    }

    thumbsUp(note) {
        note.flag = note.flag == 2 ? 0 : 2;
        note.saving = true;
        this.memberNoteProvider.update(note, false).then(() => {
            note.saving = false;
        });
    }

    goToMember(member) {
        this.nav.pop();
    }
}


