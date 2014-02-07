
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

function create() {

	//	Testing both sprite sheets and texture atlases with a Phaser.Image

	for (var i = 0; i < 18; i++)
	{
	    game.add.image(4 + 44 * i, 200, 'mummy', i);
	}

    game.add.image(200, 300, 'seacreatures', 'blueJellyfish0000');
    game.add.image(300, 300, 'seacreatures', 'crab10000');
    game.add.image(470, 300, 'seacreatures', 'purpleFish0000');

}
