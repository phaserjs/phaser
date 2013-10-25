var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });

function create() {

    var text = "- phaser -\nwith a sprinkle of\npixi dust";
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

    var t = game.add.text(game.world.centerX, game.world.centerY, text, style);

    t.anchor.setTo(0.5, 0.5);

}