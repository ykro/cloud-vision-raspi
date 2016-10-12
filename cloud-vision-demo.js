'use strict'
const gcloud = require('gcloud')

const vision = gcloud.vision({
    projectId: 'api-project-875963551142',
    keyFilename: 'keyfile.json'
})

var types = [
    'face',
    'label',
    'landmarks',
    'logos',
    'properties',
];

//https://cloud.google.com/vision/docs/images/demo-image.jpg
vision.detect('demo-image.jpg', types, function(err, detections, apiResponse) {
    console.log('detections: ',detections);
});

//http://netdna.webdesignerdepot.com/uploads/2013/08/batman.jpg
vision.detectText('text.jpg', function(err, text) {
    console.log('text: ',text);
});

//http://s3.amazonaws.com/etntmedia/media/images/ext/543627202/happy-people-friends.jpg
vision.detectFaces('faces.jpg', function(err, faces) {
    console.log('faces: ',faces);
});
