routerApp.service('uploadS3', function () {
    AWS.config.update({ accessKeyId: '', secretAccessKey: '/' });
    AWS.config.update({ region: 'eu-west-1' });
    this.init = function () {
        this.S3 = new AWS.S3({ params: { Bucket: 'tsac-its' } });
    }
    this.uploadit = function (x) {
        var fileChooser = document.getElementById('filechooser');
        this.button = document.getElementById('upload-button');
        this.results = document.getElementById('results');
        var bucket = this.S3;
        var file = fileChooser.files[0];

        if (file) {
            if(file.size>204800)
            {   
                results.innerHTML = "File troppo pesante!(2 MB max)";
                $("#results").removeClass("alert alert-info");
                $("#results").addClass("alert alert-danger");
            }
            else {
                var params = {Key: "/notnebulas/" + x.doc._id, ContentType: file.type, Body: file};
                bucket.upload(params, function (err, data) {
                    results.innerHTML = err ? 'ERROR!' : 'SAVED.';
                });
            }
        } else {
            results.innerHTML = "Nothing to upload.";
            $("#results").removeClass("alert alert-info");
            $("#results").addClass("alert alert-danger");
        }

    }
});

