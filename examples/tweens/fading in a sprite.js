
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('space', 'assets/misc/starfield.png', 138, 15);
    game.load.image('logo', 'assets/sprites/phaser2.png');
    
}

function create() {

    game.add.tileSprite(0, 0, 800, 600, 'space');

    var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

    sprite.anchor.setTo(0.5, 0.5);
    sprite.alpha = 0;

    game.add.tween(sprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

}
