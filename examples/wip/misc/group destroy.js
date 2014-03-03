var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('atari2', 'assets/sprites/atari800xl.png');
    game.load.image('atari4', 'assets/sprites/atari800.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
    game.load.image('firstaid', 'assets/sprites/firstaid.png');
    game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var group;
var sprite;

function create() {

    var images = game.cache.getImageKeys();

    group = game.add.group();

    for (var i = 0; i < 20; i++)
    {
    	sprite = group.create(game.world.randomX, game.world.randomY, game.rnd.pick(images));
    }

    sprite.x = 100;
    sprite.y = 100;

    game.add.tween(sprite).to( { y: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    game.input.onDown.addOnce(nuke, this);

}

function nuke() {

	//	The optional parameter here will destroy the Sprites as well as the Group.
	//	The default is 'false' which means destroy the Group, but none of the children.
	group.destroy(true);

	console.log(group);
	console.log(sprite);

}

function render() {

    game.debug.text('Click to nuke', 32, 32);

}