
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

function create() {

	// game.stage.backgroundColor = '#239923';
	game.stage.backgroundColor = 0xff8855;

    var mummy = game.add.sprite(300, 200, 'mummy', 5);

    mummy.animations.add('walk');

    mummy.animations.play('walk', 20, true);

}
