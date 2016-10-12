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

