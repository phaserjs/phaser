var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser2.png');
    game.load.script('gray', '../filters/Gray.js');

}

function create() {

  var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
  logo.anchor.setTo(0.5, 0.5);

  var gray = game.add.filter('Gray');

  logo.filters = [gray];

}