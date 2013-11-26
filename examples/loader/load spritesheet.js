
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    //  A sprite sheet is for loading classic "old school" style animations, where each frame 
    //  uses the exact same size frame and there is no configuration file.
    
    //  This is different to a Texture Atlas, in which the frames are usually variable in size
    //  and come with a json or xml file that describes their structure. Sometimes a Texture Atlas
    //  is called a "sprite sheet" but that isn't the terminology Phaser uses.

    //  To add a sprite sheet to the loader use the following:

    game.load.spritesheet('uniqueKey', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

    //  37x45 is the size of each frame
    //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    //  blank frames at the end, so we tell the loader how many to load

}

function create() {

    var sprite = game.add.sprite(300, 200, 'uniqueKey');

    sprite.animations.add('walk');

    sprite.animations.play('walk', 50, true);

}
