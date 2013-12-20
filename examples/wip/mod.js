
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.script('pt', 'wip/pt.js');
	game.load.binary('impulse', 'assets/audio/protracker/act_of_impulse.mod', modLoaded, this);
	game.load.binary('macrocosm', 'assets/audio/protracker/macrocosm.mod', modLoaded, this);
	game.load.binary('enigma', 'assets/audio/protracker/enigma.mod', modLoaded, this);
	game.load.binary('elysium', 'assets/audio/protracker/elysium.mod', modLoaded, this);

}

function modLoaded(key, data) {

	console.log('module loaded:', key);

	var buffer = new Uint8Array(data);

	return buffer;

}

var sprite;
var modsample = new Array();
var module;

function create() {

	module = new Protracker();
 	module.buffer = game.cache.getBinary('elysium');
    module.parse();
    module.play();

}

function update() {

	if (module.channel[0].noteon) {sam1=module.channel[0].sample; modsamples=1;}else{modsamples=0;}
	if (module.channel[1].noteon) {sam2=module.channel[1].sample; modsamples=1;}else{modsamples=0;}
	if (module.channel[2].noteon) {sam3=module.channel[2].sample; modsamples=1;}else{modsamples=0;}
	if (module.channel[3].noteon) {sam4=module.channel[3].sample; modsamples=1;}else{modsamples=0;}

	var posi=module.position;
	var patt=module.row;
	var bpm=module.bpm;
	var spd=module.speed;
	var modname=module.title;
	var modauth=module.signature;

}

function render() {

}
