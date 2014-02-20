
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('coke', 'assets/sprites/cokecan.png');

}

var cursors;
var mushroom;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.image(0, 0, 'backdrop');

    mushroom = game.add.sprite(400, 400, 'mushroom');

    var group = game.add.group();

    for (var i = 0; i < 20; i++)
    {
        group.create(Math.random() * 800, Math.random() * 600, 'coke');
    }

    group.fixedToCamera = true;

    game.camera.follow(mushroom);

    cursors = game.input.keyboard.createCursorKeys();

}

function clicked() {

    console.log('boom');

}

function update() {

    if (cursors.left.isDown)
    {
    	mushroom.x -= 8;
    }
    else if (cursors.right.isDown)
    {
    	mushroom.x += 8;
    }

    if (cursors.up.isDown)
    {
    	mushroom.y -= 8;
    }
    else if (cursors.down.isDown)
    {
    	mushroom.y += 8;
    }

}

function render() {


}
