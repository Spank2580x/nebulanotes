routerApp.service('uploadS3', function () {
    AWS.config.update({ accessKeyId: 'AKIAJWVPLIL77277XEZQ', secretAccessKey: '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' });
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
            var params = { Key: "/notnebulas/" + x.doc._id, ContentType: file.type, Body: file };
            bucket.upload(params, function (err, data) {
                results.innerHTML = err ? 'ERROR!' : 'SAVED.';
            });
        } else {
            results.innerHTML = "Nothing to upload.";
        }
    }
});

/*
Access Key ID:
AKIAJXMWOEJ62OX2JD3Q
Secret Access Key:
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
*/