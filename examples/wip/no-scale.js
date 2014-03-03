
var game = new Phaser.Game(1024, 672, Phaser.CANVAS, 'phaser-example', { init: init, preload: preload, create: create, update: update, render: render });

function init() {

    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.forceOrientation(true, false);
    game.scale.enterIncorrectOrientation.add(enterIncorrectOrientation, game);
    game.scale.leaveIncorrectOrientation.add(leaveIncorrectOrientation, game);
    game.scale.setScreenSize(true);

	game.stage.backgroundColor = 0x004400;

}

function preload() {

    game.load.image('pic', 'assets/pics/remember-me.jpg');
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var mummy;
var anim;

function create() {

    game.add.image(0, 0, 'pic');

    mummy = game.add.sprite(300, 200, 'mummy', 5);

    anim = mummy.animations.add('walk');

    anim.play(20, true);

}

function enterIncorrectOrientation () {

	// game.stage.backgroundColor = 0xff0000;

}

function leaveIncorrectOrientation () {

	// game.stage.backgroundColor = 0x000033;

}

function update() {

}

function render() {

	// game.debug.pointer(game.input.activePointer);
	
}