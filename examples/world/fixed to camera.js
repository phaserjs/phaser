
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('phaser', 'assets/sprites/phaser1.png');

}

var cursors;
var logo1;
var logo2;

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(-1000, -1000, 2000, 2000);

    for (var i = 0; i < 200; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    game.add.text(0, 0, "this text scrolls\nwith the background", { font: "32px Arial", fill: "#f26c4f", align: "center" });

    logo1 = game.add.sprite(0, 0, 'phaser');
    logo1.fixedToCamera = true;
    logo1.cameraOffset.setTo(100, 100);

    logo2 = game.add.sprite(0, 0, 'phaser');
    logo2.fixedToCamera = true;
    logo2.cameraOffset.setTo(500, 100);


    var t = game.add.text(0, 0, "this text is fixed to the camera", { font: "32px Arial", fill: "#ffffff", align: "center" });
    t.fixedToCamera = true;
    t.cameraOffset.setTo(200, 500);

    game.add.tween(logo2.cameraOffset).to( { y: 400 }, 2000, Phaser.Easing.Back.InOut, true, 0, 2000, true);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}
