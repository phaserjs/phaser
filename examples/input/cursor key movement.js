
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('phaser', 'assets/sprites/sonic_havok_sanity.png');

}

var cursors;

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(-1000, -1000, 1000, 1000);

    for (var i = 0; i < 100; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    //  This will create a new object called "cursors", inside it will contain 4 objects: up, down, left and right.
    //  These are all Phaser.Key objects, so anything you can do with a Key object you can do with these.
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //  For example this checks if the up or down keys are pressed and moves the camera accordingly.
    if (cursors.up.isDown)
    {
        //  If the shift key is also pressed then the world is rotated
        if (cursors.up.shiftKey)
        {
            game.world.rotation += 0.05;
        }
        else
        {
            game.camera.y -= 4;
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.down.shiftKey)
        {
            game.world.rotation -= 0.05;
        }
        else
        {
            game.camera.y += 4;
        }
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

    game.debug.renderCameraInfo(game.camera, 32, 32);

}
