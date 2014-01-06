
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ball', 'assets/sprites/pangball.png');    
	game.load.image('arrow', 'assets/sprites/asteroids_ship.png');

}

var ballsGroup;
var shipsGroup;

function create() {

	ballsGroup = game.add.group();
	shipsGroup = game.add.group();

	for (var i = 0; i < 20; i++)
	{
		//	Create some randomly placed sprites in both Groups
		ballsGroup.create(game.rnd.integerInRange(0, 128), game.world.randomY, 'ball');
		shipsGroup.create(game.rnd.integerInRange(0, 128), game.world.randomY, 'arrow');
	}

	//	Now make the ships group a child of the balls group - so anything that happens to the balls group
	//	will happen to the ships group too
	ballsGroup.add(shipsGroup);

}

function update() {

	ballsGroup.x += 0.1;

	//	Because shipsGroup is a child of ballsGroup it has already been moved 0.1px by the line above
	//	So the following line of code will make it appear to move twice as fast as ballsGroup
	shipsGroup.x += 0.1;

}

