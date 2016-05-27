/**
 * Created by Luca on 12/05/2016.
 */
routerApp.service('NotesService', function() {

    this.isFirstTimeUsingApp = function(db, callback){
        db.info(function(err, info){
            if (err) {
                console.log(err);
                callback(err, null);
            }
            console.log("Statistiche database pouch:");
            console.log(info);
            callback(null, !info.doc_count > 0);
        })
    }


});