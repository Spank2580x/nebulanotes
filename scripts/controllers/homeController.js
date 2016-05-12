angular.module('routerApp')
    .controller('homeController', function ($scope, NotesFactory, StorageFactory, NotesService){

        $scope.title = "Nebula Notes";

        var loadingNotes = true;
        var localStoredNotes = {};

        var db = {};

        $scope.text = "asd";

        function init(){
            alert("Vai");
            db = new PouchDB('nebulaNotes');
        }

        $scope.write = function dummyWrite(){
            console.log("Scrittura");
            var t = {
                _id: new Date().toISOString(),
                txt: $scope.text
            };
            db.put(t, function callback(err, result) {
                if (!err) {
                    alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    db.changes().on('change', function() {
                        console.log('Basta');
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
        }

        $scope.read = function dummyRead(){
            console.log("Lettura");
            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                    console.log(err);
                    console.log("L'oggetto:" + doc);*/
                    console.log(doc);
                    $scope.text = doc.rows[parseInt(Math.random() * doc.rows.length)].doc.txt;
                }
            });
        }

        init();

    });