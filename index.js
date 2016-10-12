'use strict'

const fs = require('fs'),
      gcloud = require('gcloud')
const raspi = require('raspi-io')
const five = require('johnny-five')
const firebase = require('firebase')
const child_process = require('child_process')
const PROJECT_ID = "cloud-vision-experiments-ykro";

const firebaseConfig = {
    apiKey: "AIzaSyCN-pdWTjlBWA431q0YL9GPuIJXlPQPquo",
    databaseURL: "https://" + PROJECT_ID + ".firebaseio.com/"
}

const storage = gcloud.storage({
    projectId: PROJECT_ID,
    keyFilename: PROJECT_ID + "-keyfile.json"
})

const vision = gcloud.vision({
    projectId: PROJECT_ID,
    keyFilename: PROJECT_ID + "-keyfile.json"
})

firebase.initializeApp(firebaseConfig)

const board = new five.Board({io: new raspi()})

board.on('ready', () => {
    console.log('board is ready')
    const motion = new five.Motion('P1-7')
    
    motion.on('calibrated', () => {
	console.log('calibrated')
    })

    motion.on('motionstart', () => {
	console.log('motionstart')
	const filename = "images/image_" + Date.now() + ".jpg"
	const args = ["-w", "320", "-h", "240", "-o", filename, "-t", "1"]
	let proc = child_process.spawn('raspistill', args)
	proc.on('exit', function(code) {
	    console.log('picture saved', filename)
	    let dbRef = firebase.database().ref().push()
	    upload(filename, dbRef)
	    
	    vision.detectFaces(filename, (err, faces) => {
		if (faces.length > 0) {
		    dbRef.child("faces").set(faces)
		    faces.forEach((face) => {
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

function removeLocalFile(filename) {
    fs.unlink(filename, (err) => {
	if (err) {
	    console.error(err)
	    return
	}
	console.log('local file deleted',filename)
    });
}

function upload(filename, dbRef) {
    const bucket = storage.bucket(PROJECT_ID + ".appspot.com")
    bucket.upload(filename, (err, file) => {
	if (err) {
	    console.error(err)
	    return
	}
	const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${PROJECT_ID}.appspot.com/o/${file.metadata.name}?alt=media`
	dbRef.child("url").set(publicUrl)
	console.log('file stored',publicUrl)

	removeLocalFile(filename)
    })
}

