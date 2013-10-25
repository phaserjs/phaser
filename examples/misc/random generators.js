
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {create: create });

function create() {

    game.stage.backgroundColor = '#454645';

    var style = { font: "14px Arial", fill: "#ff0044", align: "center" };

    game.add.text(10, 20, game.rnd.integer());
    game.add.text(10, 40, game.rnd.frac());
    game.add.text(10, 60, game.rnd.real());
    game.add.text(10, 80, game.rnd.integerInRange(100, 200));

}
