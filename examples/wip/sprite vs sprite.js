var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Sprite vs. Sprite collision

    sprite1 = game.add.sprite(50, 250, 'atari');
    sprite1.name = 'atari';
	sprite1.body.immovable = true;

    sprite2 = game.add.sprite(0, 0, 'mushroom');
    sprite2.name = 'mushroom';

}

function update() {

	sprite1.body.x = game.input.x; //uncoment for tests
		
	if (sprite2.y > 400)
    {
		sprite2.x =  0;
		sprite2.y =  0;
	}
	
	sprite2.body.velocity.x = 100;
	sprite2.body.velocity.y = 50;

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

    console.log(obj1.name + ' collided with ' + obj2.name);

}

function render() {
    game.debug.renderSpriteInfo(sprite1, 100, 400);
    game.debug.renderSpriteBounds(sprite1);
    game.debug.renderSpriteInfo(sprite2, 100, 100);
    game.debug.renderSpriteBounds(sprite2);
}

