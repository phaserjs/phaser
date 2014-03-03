
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var mummy;
var anim;

function create() {

	game.stage.backgroundColor = 0x2d2d2d;

    mummy = game.add.sprite(300, 200, 'mummy', 5);

    anim = mummy.animations.add('walk');

    anim.play(10, true);

    game.input.onDown.add(changeSpeed, this);

}

function changeSpeed(pointer) {

	if (pointer.x < 400)
	{
		anim.speed -= 1;
	}
	else
	{
		anim.speed += 1;
	}

}

function update() {

}

function render() {

	game.debug.text(anim.speed, 32, 32);
	
}