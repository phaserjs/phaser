
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.script('pt', 'wip/pt.js');
	game.load.binary('impulse', 'assets/audio/protracker/act_of_impulse.mod', modLoaded, this);
	game.load.binary('macrocosm', 'assets/audio/protracker/macrocosm.mod', modLoaded, this);
	game.load.binary('enigma', 'assets/audio/protracker/enigma.mod', modLoaded, this);
	game.load.binary('elysium', 'assets/audio/protracker/elysium.mod', modLoaded, this);
	game.load.binary('stardust', 'assets/audio/protracker/sd-ingame1.mod', modLoaded, this);
	game.load.binary('globaltrash', 'assets/audio/protracker/global_trash_3_v2.mod', modLoaded, this);
	game.load.image('vu1', 'assets/sprites/flectrum.png');
	game.load.image('vu2', 'assets/sprites/flectrum2.png');
	game.load.image('vu3', 'assets/sprites/healthbar.png');

}

function modLoaded(key, data) {

	console.log('module loaded:', key);

	var buffer = new Uint8Array(data);

	return buffer;

}

var vu1;
var vu2;
var vu3;
var vu4;

var modsample = new Array();
var module;

var sample1;
var sample2;
var sample3;
var sample4;
var sampleName1;
var sampleName2;
var sampleName3;
var sampleName4;

var r1;
var r2;
var r3;
var r4;

function create() {

	// vu1 = game.add.sprite(400, 100, 'vu3');
	// vu2 = game.add.sprite(400, 150, 'vu3');
	// vu3 = game.add.sprite(400, 200, 'vu3');
	// vu4 = game.add.sprite(400, 250, 'vu3');

	module = new Protracker();
// 	module.buffer = game.cache.getBinary('globaltrash');
 	module.buffer = game.cache.getBinary('macrocosm');
    module.parse();
    module.play();

    r1 = new Phaser.Rectangle(400, 100, 100, 32);
    r2 = new Phaser.Rectangle(400, 150, 100, 32);
    r3 = new Phaser.Rectangle(400, 200, 100, 32);
    r4 = new Phaser.Rectangle(400, 250, 100, 32);

    // console.log(module.sample);

}

function update() {

	sampleName1 = '';
	sampleName2 = '';
	sampleName3 = '';
	sampleName4 = '';
		
	sample1 = module.channel[0].sample;
	sample2 = module.channel[1].sample;
	sample3 = module.channel[2].sample;
	sample4 = module.channel[3].sample;

	/*
		module.sample = array of Objects containing:

		data (Float32Array)
		finetime
		length (ms? bytes?)
		looplength
		loopstart
		name
		volume

arpeggio: 0
command: 0
data: 0
flags: 0
note: 22
noteon: 1
period: 240
sample: 11
samplepos: 314.3411880952386
samplespeed: 0.335118537414966
semitone: 14
slidespeed: 0
slideto: 214
slidetospeed: 0
vibratodepth: 0
vibratopos: 0
vibratospeed: 0
vibratowave: 0
voiceperiod: 240
volume: 64
	*/

	if (module.sample[sample1])
	{
		sampleName1 = module.sample[sample1].name;
	}

	if (module.sample[sample2])
	{
		sampleName2 = module.sample[sample2].name;
	}

	if (module.sample[sample3])
	{
		sampleName3 = module.sample[sample3].name;
	}

	if (module.sample[sample4])
	{
		sampleName4 = module.sample[sample4].name;
	}

	// vu1.width = Math.round(module.vu[0] * 400);
	// vu2.width = Math.round(module.vu[1] * 400);
	// vu3.width = Math.round(module.vu[2] * 400);
	// vu4.width = Math.round(module.vu[3] * 400);

	r1.width = Math.round(module.vu[0] * 500);
	r2.width = Math.round(module.vu[1] * 500);
	r3.width = Math.round(module.vu[2] * 500);
	r4.width = Math.round(module.vu[3] * 500);

}

function render() {

	game.debug.text('Sample ' + sample1 + ' : ' + sampleName1, 16, 32);
	game.debug.text('Sample ' + sample2 + ' : ' + sampleName2, 16, 64);
	game.debug.text('Sample ' + sample3 + ' : ' + sampleName3, 16, 96);
	game.debug.text('Sample ' + sample4 + ' : ' + sampleName4, 16, 128);

	game.debug.text('Position: ' + module.position, 16, 160);
	game.debug.text('Pattern: ' + module.row, 16, 192);
	game.debug.text('BPM: ' + module.bpm, 16, 224);
	game.debug.text('Speed: ' + module.speed, 16, 256);
	game.debug.text('Name: ' + module.title, 16, 288);
	game.debug.text('Author: ' + module.signature, 16, 320);

	game.debug.text('vu1: ' + module.vu[0], 16, 352);
	game.debug.text('vu2: ' + module.vu[1], 16, 384);
	game.debug.text('vu3: ' + module.vu[2], 16, 416);
	game.debug.text('vu4: ' + module.vu[3], 16, 448);

	game.debug.geom(r1);
	game.debug.geom(r2);
	game.debug.geom(r3);
	game.debug.geom(r4);

}
