var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });

function create() {

	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY, "x", style);

    text.anchor.set(0.5);

}