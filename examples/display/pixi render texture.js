//	Original version by @author Mat Groves http://matgroves.com/ @Doormat23 from the Pixi.js examples
//	Ported to Phaser by Richard Davey

var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('spin1', 'assets/sprites/spinObj_01.png');
    game.load.image('spin2', 'assets/sprites/spinObj_02.png');
    game.load.image('spin3', 'assets/sprites/spinObj_03.png');
    game.load.image('spin4', 'assets/sprites/spinObj_04.png');
    game.load.image('spin5', 'assets/sprites/spinObj_05.png');
    game.load.image('spin6', 'assets/sprites/spinObj_06.png');
    game.load.image('spin7', 'assets/sprites/spinObj_07.png');
    game.load.image('spin8', 'assets/sprites/spinObj_08.png');

}

var renderTexture;
var renderTexture2;
var currentTexture;
var outputSprite;
var stuffContainer;
var count = 0;

function create() {

	// create two render textures.. these dynamic textures will be used to draw the scene into itself
	renderTexture = game.add.renderTexture('texture1', 800, 600);
	renderTexture2 = game.add.renderTexture('textur2e', 800, 600);
	currentTexture = renderTexture;

	// create a new sprite that uses the render texture we created above
	outputSprite = game.add.sprite(400, 300, currentTexture);

	// align the sprite
	outputSprite.anchor.x = 0.5;
	outputSprite.anchor.y = 0.5;

	stuffContainer = game.add.group();
	stuffContainer.x = 800/2;
	stuffContainer.y = 600/2;

	// now create some items and randomly position them in the stuff container
	for (var i = 0; i < 20; i++)
	{
		var item = stuffContainer.create(Math.random() * 400 - 200, Math.random() * 400 - 200, game.rnd.pick(game.cache.getKeys(Phaser.Cache.IMAGE)));
		item.anchor.setTo(0.5, 0.5);
	}

	// used for spinning!
	count = 0;

}

function update() {

	stuffContainer.addAll('rotation', 0.1);

	count += 0.01;

	// swap the buffers..
	var temp = renderTexture;
	renderTexture = renderTexture2;
	renderTexture2 = temp;

	// set the new texture
	outputSprite.setTexture(renderTexture);

	// twist this up!
	stuffContainer.rotation -= 0.01
	outputSprite.scale.x = outputSprite.scale.y  = 1 + Math.sin(count) * 0.2;

	// render the stage to the texture
	// the true clears the texture before content is rendered
	renderTexture2.renderXY(game.stage, 0, 0, true);

}
