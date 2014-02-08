
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var mummy;
var jelly;

function create() {

	//	Testing both sprite sheets and texture atlases with a Phaser.Image

	mummy = game.add.image(200, 200, 'mummy');

    jelly = game.add.image(200, 300, 'seacreatures', 'blueJellyfish0000');

    game.input.onDown.add(changeFrame, this);

}

function changeFrame() {

	if (jelly.frameName === 'blueJellyfish0000')
	{
		jelly.frameName = 'crab10000';
	}
	else if (jelly.frameName === 'crab10000')
	{
		jelly.frameName = 'purpleFish0000';
	}
	else
	{
		jelly.frameName = 'blueJellyfish0000';
	}

}

function update() {

	//	You could animate an Image like this! But it makes more sense to use a Sprite
	if (mummy.frame < 17)
	{
		mummy.frame++;
	}
	else
	{
		mummy.frame = 0;
	}

}