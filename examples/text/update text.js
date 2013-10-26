//  Example created by Arlefreak (https://github.com/Arlefreak)

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

var text;
var count;

function create() {

    count = 0;

    text = game.add.text(game.world.centerX, game.world.centerY, "- You have clicked -\n0 times !", {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    text.anchor.setTo(0.5, 0.5);

}

function update() {

    game.input.onDown.addOnce(updateText, this);

}


function updateText() {

    count++;

    text.setText("- You have clicked -\n" + count + " times !");

}