
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml', null, 0, -32);

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
    fixie2.input.enableDrag();

    //  Test Fixing a Text to the Camera
    var text = game.add.text(300, 32, 'arrows to move\ndrag the can ->');
    text.fixedToCamera = true;

    //  Test fixing a BitmapText to the Camera
    var text2 = game.add.bitmapText(270, 520, 'desyrel', 'Fixed to Camera!', 32);
    text2.fixedToCamera = true;

    game.camera.follow(mushroom);

    cursors = game.input.keyboard.createCursorKeys();

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
