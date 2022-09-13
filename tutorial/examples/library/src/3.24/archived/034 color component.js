
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('mech', 'assets/pics/titan_mech.png');

}

var sprite;

function create() {

    sprite = game.add.sprite(200, 50, 'mech', null, game.stage);

    // sprite.color.setBackground(25);

    game.add.tween(sprite).to( { angle: 45, scale: 2 }, 2000, 'Linear', true, 0, -1, true);

    game.add.tween(sprite.color).to( { red: 255, green: 20, blue: 200 }, 1000, 'Linear', true, 0, -1, true);

}
