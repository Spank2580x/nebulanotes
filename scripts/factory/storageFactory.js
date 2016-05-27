/**
 * Created by Luca on 12/05/2016.
 */
routerApp.factory('StorageFactory', function($http){

    //TODO questo verra' usato per interagire con aws

    var storageFactory = {};

    storageFactory.loadStorage = function(args, callback){
        callback(true);
    };

    storageFactory.saveStorage = function(args, callback) {

    };

    return storageFactory;

});