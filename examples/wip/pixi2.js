
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('beast', 'assets/pics/shadow_of_the_beast2_karamoon.png');
    game.load.image('snot', 'assets/pics/nslide_snot.png');
    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('disk', 'assets/sprites/oz_pov_melting_disk.png');

}

var group1;
var group2;
var coke;
var disk;

function create() {

    //  Create a background image
    game.add.sprite(0, 0, 'beast');

    //  Create a Group that will sit above the background image
    group1 = game.add.group();

    //  Create a Group that will sit above Group 1
    group2 = game.add.group();

    //  Now let's create some random sprites and enable them all for drag and 'bring to top'
    for (var i = 0; i < 10; i++)
    {
        var tempSprite = game.add.sprite(game.world.randomX, game.world.randomY, 'atari1');

        tempSprite.name = 'atari' + i;
        tempSprite.input.start(i, true);
        tempSprite.input.enableDrag(false, true);

        group1.add(tempSprite);

        //  Sonics

        var tempSprite=game.add.sprite(game.world.randomX, game.world.randomY, 'sonic');

        tempSprite.name = 'sonic' + i;
        tempSprite.input.start(10 + i, true);
        tempSprite.input.enableDrag(false, true);

        group2.add(tempSprite);
    }

    //  Add 2 control sprites into each group - these cannot be dragged but should be bought to the top each time
    coke = group1.create(100, 100, 'coke');
    disk = group2.create(400, 300, 'disk');

    //  Create a foreground image - everything should appear behind this, even when dragged
    var snot = game.add.sprite(game.world.centerX, game.world.height, 'snot');
    snot.anchor.setTo(0.5, 1);

    //  You can click and drag any sprite but Sonic sprites should always appear above the Atari sprites
    //  and both types of sprite should only ever appear above the background and behind the 

    game.input.onDown.add(wibble, this);

}

function wibble(p) {
    console.log(p);
}

function update() {

    if (game.input.keyboard.justReleased(Phaser.Keyboard.ONE))
    {
        coke.bringToTop();
    }

    if (game.input.keyboard.justReleased(Phaser.Keyboard.TWO))
    {
        disk.bringToTop();
    }

}

function render() {
    game.debug.inputInfo(32, 32);
}
