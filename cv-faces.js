'use strict'
const gcloud = require('gcloud')

const vision = gcloud.vision({
    projectId: 'api-project-875963551142',
    keyFilename: 'keyfile.json'
})

vision.detectFaces('images/image.jpg', function(err, faces) {
    if (faces.length > 0) {
	faces.forEach(function(face) {
	    if (face.confidence > 0.6) {
		console.log(face);
		console.log(faceToEmoji(face));
	    }
	});
    }
});

function faceToEmoji(face) {
    var emoji = ":|";
    if (face.happy) {
	emoji = ":)";
    } else if (face.mad) {
	emoji =":@";
    } else if (face.sad) {
	emoji =":(";
    } else if (face.surprised) {
	emoji =":O";
    }

    if (face.hat) {
	emoji = "0" + emoji;
    }
    return emoji;
}
