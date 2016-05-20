routerApp.service('uploadS3', function() {
    this.init=function(){
        var creds=new AWS.Credentials({
            accessKeyId: 'AKIAJXMWOEJ62OX2JD3Q', secretAccessKey: '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', sessionToken: null
        });
        AWS.config.credentials = creds;
    }
    this.bucket = new AWS.S3({params: {Bucket: 'uploadproject'}});

    var fileChooser = document.getElementById('filechooser');
    this.button = document.getElementById('upload-button');
    this.results = document.getElementById('results');
    var bucket=this.bucket;
    this.bucket.uploadit=function() {
        var file = fileChooser.files[0];
        if (file) {
            results.innerHTML = '';

            var params = {Key: file.name, ContentType: file.type, Body: file};
            bucket.upload(params, function (err, data) {
                results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
            });
        } else {
            results.innerHTML = 'Nothing to upload.';
        }
    };
});
