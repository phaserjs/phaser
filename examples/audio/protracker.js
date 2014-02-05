
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.script('protracker', '../plugins/ProTracker.js');

	game.load.image('vu', 'assets/sprites/vu.png');
	game.load.image('logo', 'assets/sprites/soundtracker.png');
	game.load.image('bg', 'assets/skies/sky2.png');
	game.load.image('vulkaiser', 'assets/pics/vulkaiser_red.png');

	game.load.binary('macrocosm', 'assets/audio/protracker/macrocosm.mod', modLoaded, this);
	game.load.binary('impulse', 'assets/audio/protracker/act_of_impulse.mod', modLoaded, this);
	game.load.binary('enigma', 'assets/audio/protracker/enigma.mod', modLoaded, this);
	game.load.binary('elysium', 'assets/audio/protracker/elysium.mod', modLoaded, this);
	game.load.binary('stardust', 'assets/audio/protracker/sd-ingame1.mod', modLoaded, this);
	game.load.binary('globaltrash', 'assets/audio/protracker/global_trash_3_v2.mod', modLoaded, this);

}

function modLoaded(key, data) {

	mods.push(key);

	var buffer = new Uint8Array(data);

	return buffer;

}

var mods = [];
var current = 0;

var vu1;
var vu2;
var vu3;
var vu4;

var modsample = [];
var module;

var sample1;
var sample2;
var sample3;
var sample4;
var sampleName1;
var sampleName2;
var sampleName3;
var sampleName4;

function create() {

	game.add.sprite(0, 0, 'bg');
	game.add.sprite(500, 32, 'logo');
	game.add.sprite(580, 371, 'vulkaiser');

	vu1 = game.add.sprite(400, 200, 'vu');
	vu2 = game.add.sprite(400, 250, 'vu');
	vu3 = game.add.sprite(400, 300, 'vu');
	vu4 = game.add.sprite(400, 350, 'vu');

	vu1.width = 0;
	vu2.width = 0;
	vu3.width = 0;
	vu4.width = 0;

	module = new Protracker();
 	module.buffer = game.cache.getBinary('macrocosm');
    module.parse();
    module.play();

    game.input.onDown.add(nextMod, this);

}

function nextMod() {

	current++;

	if (current > mods.length - 1)
	{
		current = 0;
	}

	module.stop();
	module.clearsong();

 	module.buffer = game.cache.getBinary(mods[current]);
    module.parse();
    module.play();

	vu1.width = 0;
	vu2.width = 0;
	vu3.width = 0;
	vu4.width = 0;

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

	if (module.vu[0])
	{
		vu1.width = Math.round(module.vu[0] * 1200);
	}

	if (module.vu[1])
	{
		vu2.width = Math.round(module.vu[1] * 1200);
	}

	if (module.vu[2])
	{
		vu3.width = Math.round(module.vu[2] * 1200);
	}

	if (module.vu[3])
	{
		vu4.width = Math.round(module.vu[3] * 1200);
	}

}

function render() {

	game.debug.renderText('Sample ' + sample1 + ' : ' + sampleName1, 16, 32);
	game.debug.renderText('Sample ' + sample2 + ' : ' + sampleName2, 16, 64);
	game.debug.renderText('Sample ' + sample3 + ' : ' + sampleName3, 16, 96);
	game.debug.renderText('Sample ' + sample4 + ' : ' + sampleName4, 16, 128);

	game.debug.renderText('Position: ' + module.position, 16, 160);
	game.debug.renderText('Pattern: ' + module.row, 16, 192);
	game.debug.renderText('BPM: ' + module.bpm, 16, 224);
	game.debug.renderText('Speed: ' + module.speed, 16, 256);
	game.debug.renderText('Name: ' + module.title, 16, 288);
	game.debug.renderText('Signature: ' + module.signature, 16, 320);

	game.debug.renderText('vu1: ' + module.vu[0], 16, 352);
	game.debug.renderText('vu2: ' + module.vu[1], 16, 384);
	game.debug.renderText('vu3: ' + module.vu[2], 16, 416);
	game.debug.renderText('vu4: ' + module.vu[3], 16, 448);

}
