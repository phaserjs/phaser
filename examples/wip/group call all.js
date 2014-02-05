
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');
    game.load.image('undersea', 'assets/pics/undersea.jpg');
    game.load.image('coral', 'assets/pics/seabed.png');

}

function create() {

    game.add.sprite(0, 0, 'undersea');

    var group = game.add.group();

    for (var i = 0; i < 6; i++)
    {
    	sprite = group.create(120 * i, game.rnd.integerInRange(100, 400), 'seacreatures', 'octopus0000');
    }

    var frameNames = Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4);

    group.callAll('animations.add', 'animations', 'swim', frameNames, 30, true, false);

    group.callAll('play', null, 'swim');

    game.add.sprite(0, 466, 'coral');

}
