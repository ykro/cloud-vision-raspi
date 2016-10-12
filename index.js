'use strict'

const gcloud = require('gcloud')
const raspi = require('raspi-io')
const five = require('johnny-five')
const child_process = require('child_process')

const vision = gcloud.vision({
    projectId: 'api-project-875963551142',
    keyFilename: 'keyfile.json'
})

const board = new five.Board({io: new raspi()})

board.on('ready', () => {
    console.log('board is ready')
    const motion = new five.Motion('P1-7')
    
    motion.on('calibrated', () => {
	console.log('calibrated')
    });

    motion.on('motionstart', () => {
	console.log('motionstart');
	const filename = "images/image_" + Date.now() + ".jpg"
	const args = ["-w", "320", "-h", "240", "-o", filename, "-t", "1"]
	var proc = child_process.spawn('raspistill', args)
	proc.on('exit', function(code) {
	    console.log('picture saved')

	    vision.detectFaces(filename, function(err, faces) {
		if (faces.length > 0) {
		    faces.forEach(function(face) {
			if (face.confidence > 0.6) {
			    console.log(face)
			}
		    })
		}
	    })	    
	})		
    })

    motion.on('motionend', () => {
	console.log('motionend')
    })
})

/*
'use strict';
const firebase = require('firebase');
const gcloud = require('gcloud');
const PROJECT_ID = "cloud-vision-experiments-ykro";

const config = {
    apiKey: "AIzaSyCN-pdWTjlBWA431q0YL9GPuIJXlPQPquo",
    databaseURL: "https://" + PROJECT_ID + ".firebaseio.com/"
};

const gcs = gcloud.storage({
    projectId: PROJECT_ID,
    keyFilename: PROJECT_ID + "-keyfile.json"
});

firebase.initializeApp(config);
const db = firebase.database();
const dbRef = db.ref();

let filename = "faces.jpg"
let bucket = gcs.bucket(PROJECT_ID + ".appspot.com");
bucket.upload(filename, (err, file) => {
    if (err) {
	console.error(err);
    } else {
	bucket.file(filename).getSignedUrl({
	    action: 'read',
	    expires: '03-17-2025'
	}, function(err, url) {
	    if (err) {
		console.error(err);
		return;
	    }

	    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${PROJECT_ID}.appspot.com/o/${file.metadata.name}?alt=media`;
	    const keyName = filename.replace(".","_");
	    dbRef.child(keyName).set(publicUrl);
	    console.log('file stored',publicUrl);
	});
    }
});
*/
