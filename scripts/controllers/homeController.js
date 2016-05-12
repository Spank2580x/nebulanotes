angular.module('routerApp')
    .controller('homeController', function ($scope, NotesFactory, StorageFactory, NotesService){

        $scope.title = "Nebula Notes";

        var loadingNotes = true;
        var localStoredNotes = {};

        function init(){
            alert("Vai");
            StorageFactory.loadStorage("TODO", function(err, result){
                if (err) offlineLoading();
                else {
                    console.log("Caricamento delle note online");
                    localStoredNotes = result;
                }
            })
            loadingNotes = false;
        }

        function offlineLoading(){
            console.log("Caricamento delle note offline");
            NotesFactory.loadNotes("TODO", function(err, result){
                if (err){
                    //Caricamento delle note fallito
                    alert("Caricamento delle note fallito");
                }
                else {
                    //Caricamento delle note offline
                    localStoredNotes = result;
                }
            })
        }

        init();

    });