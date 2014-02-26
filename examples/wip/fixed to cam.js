
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml', null, 0, -32);

}

var cursors;
var mushroom;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.image(0, 0, 'backdrop');

    mushroom = game.add.sprite(400, 400, 'mushroom');

    //  Test Fixing an Image to the Camera
    var fixie = game.add.image(100, 100, 'coke');
    fixie.fixedToCamera = true;

    //  And tween it
    game.add.tween(fixie.cameraOffset).to({ y: 500 }, 2000, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

    //  Test Fixing a Sprite to the Camera
    var fixie2 = game.add.sprite(600, 100, 'coke');
    fixie2.fixedToCamera = true;
    fixie2.inputEnabled = true;
    fixie2.events.onInputDown.add(clicked, this);

    //  Test Fixing a Text to the Camera
    var text = game.add.text(300, 32, '-phaser-');
    text.fixedToCamera = true;

    //  Test fixing a BitmapText to the Camera
    var text2 = game.add.bitmapText(200, 500, 'desyrel', 'camera fixies', 32);
    text2.fixedToCamera = true;

    //  Test fixing a Graphics object to the Camera
    var graphics = game.add.graphics(0, 0);
    graphics.fixedToCamera = true;
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(50, 250, 100, 100);

    //  Button! do mouse events still work then?

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
