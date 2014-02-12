
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    // game.load.atlasXML('seacreatures', 'assets/sprites/seacreatures.png', 'assets/sprites/seacreatures.xml');
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

    //	Just a few images to use in our underwater scene
    game.load.image('undersea', 'assets/pics/undersea.jpg');
    game.load.image('coral', 'assets/pics/seabed.png');

}

var jellyfish;
var crab;
var greenJellyfish;
var octopus;
var purpleFish;
var seahorse;
var squid;
var stingray;
var flyingfish;

function create() {

    game.add.sprite(0, 0, 'undersea');

    jellyfish = game.add.sprite(670, 20, 'seacreatures', 'blueJellyfish0000');

    //	In the texture atlas the jellyfish uses the frame names blueJellyfish0000 to blueJellyfish0032
    //	So we can use the handy generateFrameNames function to create this for us.
    jellyfish.animations.add('swim', Phaser.Animation.generateFrameNames('blueJellyfish', 0, 32, '', 4), 30, true);
    jellyfish.animations.play('swim');

    //	Let's make some more sea creatures in the same way as the jellyfish
    crab = game.add.sprite(550, 480, 'seacreatures');
    crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
    crab.animations.play('swim');

    greenJellyfish = game.add.sprite(330, 100, 'seacreatures');
    greenJellyfish.animations.add('swim', Phaser.Animation.generateFrameNames('greenJellyfish', 0, 39, '', 4), 30, true);
    greenJellyfish.animations.play('swim');

    octopus = game.add.sprite(160, 400, 'seacreatures');
    octopus.animations.add('swim', Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4), 30, true);
    octopus.animations.play('swim');

    purpleFish = game.add.sprite(800, 413, 'seacreatures');
    purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
    purpleFish.animations.play('swim');

    seahorse = game.add.sprite(491, 40, 'seacreatures');
    seahorse.animations.add('swim', Phaser.Animation.generateFrameNames('seahorse', 0, 5, '', 4), 30, true);
    seahorse.animations.play('swim');

    squid = game.add.sprite(610, 215, 'seacreatures', 'squid0000');

    stingray = game.add.sprite(80, 190, 'seacreatures');
    stingray.animations.add('swim', Phaser.Animation.generateFrameNames('stingray', 0, 23, '', 4), 30, true);
    stingray.animations.play('swim');

    flyingfish = game.add.sprite(60, 40, 'seacreatures', 'flyingFish0000');


    game.add.sprite(0, 466, 'coral');

    game.add.tween(purpleFish).to({ x: -200 }, 7500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
    game.add.tween(octopus).to({ y: 530 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
    game.add.tween(greenJellyfish).to({ y: 250 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
    game.add.tween(jellyfish).to({ y: 100 }, 8000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

}
