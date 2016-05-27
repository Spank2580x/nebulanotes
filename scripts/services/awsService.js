/**
 * Created by Luca on 27/05/2016.
 */
//Si lo so ma onde evitare casini faccio un altro servizio
routerApp.service('AwsService', function () {

    this.bucket;

    this.init = function(){
        AWS.config.update({accessKeyId: 'AKIAJWVPLIL77277XEZQ', secretAccessKey: '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'});
        AWS.config.region = 'eu-west-1';
        bucket = new AWS.S3({params: {Bucket: 'tsac-its'}});
    }

    this.getObjects = function(callback){
        bucket.listObjects(function (err, data) {
            if (err) {
                console.error("Errore caricamento oggetti aws");
                console.error(err);
            }
            callback(err, data);
        });
    }

    this.getObject = function(callback){
        bucket.getObject({Bucket: 'tsac-its', Key: 'pettenuzzo'}, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            console.log(data);
            callback(err, data);
        });
    }

    this.upload = function(callback){
        var fileChooser = document.getElementById('file-chooser');
        var button = document.getElementById('upload-button');
        var results = document.getElementById('results');
        button.addEventListener('click', function() {
            var file = fileChooser.files[0];
            if (file) {
                results.innerHTML = '';

                var params = {Key: file.name, ContentType: file.type, Body: file};
                bucket.upload(params, callback(err, data));
            }
            else {
                results.innerHTML = 'Nothing to upload.';
            }
        }, false);
    }


});
