
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

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

    //  This returns an array of all the image keys in the cache
    var images = game.cache.getKeys(Phaser.Cache.IMAGE);

    var test = game.add.group();

    //  Now let's create some random sprites and enable them all for drag and 'bring to top'
    for (var i = 0; i < 20; i++)
    {
        var tempSprite = test.create(game.world.randomX, game.world.randomY, game.rnd.pick(images));
        tempSprite.inputEnabled = true;
        tempSprite.input.enableDrag(false, true);
    }

}

function render() {
    game.debug.inputInfo(32, 32);
}
