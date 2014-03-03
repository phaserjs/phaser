
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var mummy;
var anim;

function create() {

	game.stage.backgroundColor = 0xff8855;

    mummy = game.add.sprite(300, 200, 'mummy', 5);

    mummy.animations.updateIfVisible = false;

    anim = mummy.animations.add('walk');

    anim.play(2, false);
    // anim.play(2, true);

}

function update() {

}

function render() {

	game.debug.text(anim.frame + ' / 17', 32, 32);
	
}