var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('backdrop', 'assets/pics/remember-me.jpg');

}

var sprite1;
var sprite2;

var cursors;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);

    game.add.sprite(0, 0, 'backdrop');

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Sprite vs. Sprite collision



    sprite1 = game.add.sprite(50, 250, 'atari');
    sprite1.name = 'atari';
    sprite1.body.immovable = true;

    sprite2 = game.add.sprite(32, 32, 'mushroom');
    sprite2.name = 'mushroom';
    sprite2.body.setCircle(32);

    game.camera.follow(sprite1);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.collide(sprite1, sprite2);

    if (cursors.left.isDown)
    {
        sprite1.body.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.x += 4;
    }

    if (cursors.up.isDown)
    {
        sprite1.body.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.y += 4;
    }


    /*
    sprite1.x = game.input.x;

    if (game.input.y > 300)
    {
        sprite1.y = game.input.y;
    }
    else
    {
        sprite1.y = 300;
    }
		
	if (sprite2.y > 600)
    {
		sprite2.body.x =  0;
		sprite2.body.y =  0;
	}
    */
	
    sprite2.body.velocity.x = 50;
    sprite2.body.velocity.y = 100;

}

function render() {

    game.debug.physicsBody(sprite1.body);
    game.debug.physicsBody(sprite2.body);

}

