'use strict'
const child_process = require('child_process')
const args = ["-w", "320", "-h", "240", "-o", "images/image.jpg", "-t", "1"];

var proc = child_process.spawn('raspistill', args);
proc.on('exit', function(code) {
  console.log('picture saved');
});
