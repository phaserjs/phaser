
var config = {

	width: "100%",
	height: "100%",
	renderer: Phaser.WEBGL,
	parent: 'phaser-example',
	state: { preload: preload, create: create, update: update },
	backgroundColor: '#ff0000'

};

var game = new Phaser.Game(config);

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
	renderTexture = game.add.renderTexture('texture1', game.width, game.height);
	renderTexture2 = game.add.renderTexture('textur2e', game.width, game.height);
	currentTexture = renderTexture;

	// create a new sprite that uses the render texture we created above
	outputSprite = game.add.sprite(game.width/2, game.height/2, currentTexture);

	// align the sprite
	outputSprite.anchor.x = 0.5;
	outputSprite.anchor.y = 0.5;

	stuffContainer = game.add.group();
	stuffContainer.x = game.width/2;
	stuffContainer.y = game.height/2;

	// now create some items and randomly position them in the stuff container
	for (var i = 0; i < 20; i++)
	{
		var item = stuffContainer.create(Math.random() * 400 - 200, Math.random() * 400 - 200, game.rnd.pick(game.cache.getImageKeys()));
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
	renderTexture2.renderXY(game.stage.display, 0, 0, true);

}
