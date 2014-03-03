var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // Enable scaling 
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.maxWidth = 1500;
    game.stage.scale.maxHeight = 1000;
    game.stage.scale.refresh();

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('atari2', 'assets/sprites/atari800xl.png');
    game.load.image('atari4', 'assets/sprites/atari800.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
    game.load.image('firstaid', 'assets/sprites/firstaid.png');
    game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

function create() {

    game.world.setBounds(0, 0, 2000, 2000);

    //  This returns an array of all the image keys in the cache
    var images = game.cache.getImageKeys();

    //  Now let's create some random sprites and enable them all for drag and 'bring to top'
    for (var i = 0; i < 200; i++)
    {
        var img = game.rnd.pick(images);
        var tempSprite = game.add.sprite(game.world.randomX, game.world.randomY, img);
        tempSprite.inputEnabled = true;
        tempSprite.input.enableDrag(false, true);
    }

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

    game.debug.inputInfo(32, 32);

}