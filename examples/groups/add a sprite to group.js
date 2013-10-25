
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

var friendAndFoe;
var enemies;

function preload() {

    game.load.image('ufo', 'assets/sprites/ufo.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    
}

function create() {

    //  Here we create 2 new groups
    friendAndFoe = game.add.group();
    enemies = game.add.group();

    for (var i = 0; i < 16; i++)
    {
        //  This creates a new Phaser.Sprite instance within the group
        //  It will be randomly placed within the world and use the 'baddie' image to display
        enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'baddie');
    }

    //  You can also add existing sprites to a group.
    //  Here we'll create a local sprite called 'ufo'
    var ufo = game.add.sprite(200, 240, 'ufo');

    //  And then add it to the group
    friendAndFoe.add(ufo);

}
