routerApp.service('uploadS3', function() {
    this.bucket;
    this.init=function(){
        this.S3=new AWS.S3();
        S3.config.credentials.accessKeyId
        var creds=new AWS.Credentials({
            accessKeyId: 'AKIAJXMWOEJ62OX2JD3Q', secretAccessKey: '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', sessionToken: null
        });
        AWS.config.credentials = creds;
        this.bucket = new AWS.S3({params: {Bucket: 'uploadproject'}});
    }
    this.uploadit=function(){
        var fileChooser = document.getElementById('filechooser');
        this.button = document.getElementById('upload-button');
        this.results = document.getElementById('results');
        var bucket=this.bucket;
        var file = fileChooser.files[0];
        if (file) {
            var params = {Key: file.name, ContentType: file.type, Body: file};
            bucket.upload(params, function (err, data) {
                console.log ( err ? 'ERROR!' : 'UPLOADED.');
            });
        } else {
            console.log("Nothing to upload.");
        }
    }


});
