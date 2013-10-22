
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

var s;

function create() {

    var text = "--- phaser ---\nwith a sprinkle of\npixi dust";
    var style = { font: "bold 40pt Arial", fill: "#ffffff", align: "center", stroke: "#258acc", strokeThickness: 8 };

    s = game.add.text(game.world.centerX, game.world.centerY, text, style);
    s.anchor.setTo(0.5, 0.5);

}

function update() {
    s.angle += 1;
}
