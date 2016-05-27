routerApp.service('uploadS3', function () {
    AWS.config.update({ accessKeyId: 'AKIAJWVPLIL77277XEZQ', secretAccessKey: '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' });
    AWS.config.region = 'eu-west-1';
    var bucket = new AWS.S3({ params: { Bucket: 'tsac-its' } });

    this.buf = function(note) {
        var fileChooser = document.getElementById('filechooser');
        var button = document.getElementById('upload-button');
        var results = document.getElementById('results');
        button.addEventListener('click', function () {
            var file = fileChooser.files[0];
            if (file) {
                results.innerHTML = '';

                var params = { Key: file.name, ContentType: file.type, Body: file };
                bucket.upload(params, function (err, data) {
                    results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
                });
            } else {
                results.innerHTML = 'Nothing to upload.';
            }
        }, false)
    }
});

