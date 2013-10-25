
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});

 function preload() {

    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');

}

var firstGroup;

function create() {

    //  Here we'll create a new Group
    firstGroup = game.add.group();

    //  And add some sprites to it
    for (var i = 0; i < 10; i++)
    {
        //  Create a new sprite at a random screen location
        var newSprite = new Phaser.Sprite(game, game.stage.randomX, game.stage.randomY, 'sonic');

        //  This set-ups a listener for the event, view your console.log output to see the result
        newSprite.events.onAddedToGroup.add(logGroupAdd);

        //  Add the sprite to the Group
        firstGroup.add(newSprite);
    }

}

function logGroupAdd(sprite, group) {

    console.log('Sprite added to Group', group.ID, 'at z-index:', group.getIndex(sprite));

}
