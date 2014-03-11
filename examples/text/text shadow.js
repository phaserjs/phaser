
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

function create() {

	game.stage.setBackgroundColor(0xefefef);

    //	Here we set the shadow:
    //	The first 2 parameters control x and y distance
    //	The 3rd the shadow colour
    //	The 4th the amount of blur

	var text = createText(100, 'shadow 5');
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	text = createText(300, 'shadow 0');
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);

	text = createText(500, 'shadow 10');
    text.setShadow(-5, 5, 'rgba(0,0,0,0.5)', 0);

}

function createText(y) {

    var text = game.add.text(game.world.centerX, y, '- phaser text shadow -');
    text.anchor.set(0.5);
    text.align = 'center';

    //	Font style
    text.font = 'Arial Black';
    text.fontSize = 50;
    text.fontWeight = 'bold';
    text.fill = '#ff00ff';

    return text;

}

function update() {

}
