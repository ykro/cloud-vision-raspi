'use strict'

const raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({io: new raspi()});
board.on('ready', () => {
    console.log('board is ready');

    const motion = new five.Motion('P1-7');

    motion.on('calibrated', () => {
	console.log('calibrated');
    });

    motion.on('motionstart', () => {
	console.log('motionstart');
    });

    motion.on('motionend', () => {
	console.log('motionend');
    });
});
