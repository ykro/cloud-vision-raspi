'use strict'
const gcloud = require('google-cloud')
const PROJECT_ID = "cloud-vision-experiments-ykro"

const vision = gcloud.vision({
    projectId: PROJECT_ID,
    keyFilename: PROJECT_ID + "-keyfile.json"
})

var types = [
    'face',
    'label',
    'landmarks',
    'logos',
    'properties',
]
/*
//https://cloud.google.com/vision/docs/images/demo-image.jpg
vision.detect('demo-image.jpg', types, (err, detections, apiResponse) => {
    if (err) {
	console.log(err)
	return
    }
    console.log('\n\ndetections: ',detections)
})
*/

/*
//http://netdna.webdesignerdepot.com/uploads/2013/08/batman.jpg
vision.detectText('text.jpg', (err, text) => {
    if (err) {
	console.log(err)
	return
    }
    console.log('\n\ntext: ',text)
})
*/


//http://s3.amazonaws.com/etntmedia/media/images/ext/543627202/happy-people-friends.jpg
vision.detectFaces('faces.jpg', (err, faces) => {
    if (err) {
	console.log(err)
	return
    }
    console.log('\n\nfaces: ',faces)
})

