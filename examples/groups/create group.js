
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});

 function preload() {

    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');

}

var yourGroup;

function create() {

    //  Here we'll create a new Group
    yourGroup = game.add.group();

    //  And add 10 sprites to it
    for (var i = 0; i < 10; i++)
    {
        //  Create a new sprite at a random world location
        yourGroup.create(game.world.randomX, game.world.randomY, 'sonic');
    }

    //  Each sprite is now a member of yourGroup

}
