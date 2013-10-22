
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });

var text;

function create() {

    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nclick to remove", { font: "65px Arial", fill: "#ff0044", align: "center" });
    text.anchor.setTo(0.5, 0.5);

    game.input.onDown.addOnce(removeText, this);

}

function removeText() {

    text.destroy();

}
