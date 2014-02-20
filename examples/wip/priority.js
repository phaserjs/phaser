
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var sprite1;
var sprite2;
var sprite3;

function create() {

    sprite1 = game.add.sprite(200, 300, 'seacreatures', 'blueJellyfish0000');
    sprite2 = game.add.sprite(230, 300, 'seacreatures', 'crab10000');
    sprite3 = game.add.sprite(280, 250, 'seacreatures', 'seahorse0000');

    sprite1.inputEnabled = true;
    sprite2.inputEnabled = true;
    sprite3.inputEnabled = true;

    sprite1.input.priorityID = 0;
    sprite2.input.priorityID = 1;
    sprite3.input.priorityID = 2;

    sprite1.input.pixelPerfectClick = true;
    sprite2.input.pixelPerfectClick = true;
    sprite3.input.pixelPerfectClick = true;

    sprite1.events.onInputDown.add(clicked, this);
    sprite2.events.onInputDown.add(clicked, this);
    sprite3.events.onInputDown.add(clicked, this);

}

function clicked(s) {

	console.log('clicked', s.frameName);

}
