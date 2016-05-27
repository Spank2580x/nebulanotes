/**
 * Created by Luca on 12/05/2016.
 */
routerApp.factory('NotesFactory', function($http){

    var notesFactory = {};

    //TODO questo sara quello usato da pouchDB, vedere poi gli argomenti per le funzioni

    notesFactory.loadNotes = function(args, callback){//TODO per caricare TUTTE LE NOTE DEL MONDOOOOOOO!
        callback(null, [
            {colore: "red", mex: "Porco"},
            {colore: "green", mex: "Ricordarsi di ammazzarsi"}
        ]);
        //TODO callback provvisorio
    }

    notesFactory.saveNote = function(args, callback){//TODO salvataggio singola nota

    }

    notesFactory.saveNotes = function(args, callback){//TODO per salvare TUTTE LE NOTE DEL MONDOOOOOOOO!

    }

    notesFactory.deleteNote = function(args, callback){//TODO per deletare

    }

    return notesFactory;

});
