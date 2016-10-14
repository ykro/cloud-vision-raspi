'use strict'
const gcloud = require('google-cloud')

const PROJECT_ID = "cloud-vision-experiments-ykro"

const vision = gcloud.vision({
    projectId: PROJECT_ID,
    keyFilename: PROJECT_ID + "-keyfile.json"
})

vision.detectFaces('images/image.jpg', (err, faces) => {
    if (err) {
	console.log(err)
	return
    }
    
    if (faces.length > 0) {
	faces.forEach(function(face) {
	    if (face.confidence > 0.6) {
		console.log(face)
		console.log(faceToEmoji(face))
	    }
	})
    } else {
	console.log('no faces')
    }
})

function faceToEmoji(face) {
    var emoji = ":|"
    if (face.happy) {
	emoji = ":)"
    } else if (face.mad) {
	emoji =":@"
    } else if (face.sad) {
	emoji =":("
    } else if (face.surprised) {
	emoji =":O"
    }

    if (face.hat) {
	emoji = "0" + emoji
    }
    return emoji
}
