
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

var text;

function create() {

	game.stage.setBackgroundColor(0xfbf6d5);

    text = game.add.text(game.world.centerX, 250, '  dynamic shadows  ');
    text.anchor.set(0.5);
    text.align = 'center';

    text.font = 'Arial Black';
    text.fontSize = 70;
    text.fontWeight = 'bold';
    text.fill = '#ec008c';

    text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);

}

function update() {

	var offset = moveToXY(game.input.activePointer, text.x, text.y, 8);

    text.setShadow(offset.x, offset.y, 'rgba(0, 0, 0, 0.5)', distanceToPointer(text, game.input.activePointer) / 30);

}

function distanceToPointer(displayObject, pointer) {

    this._dx = displayObject.x - pointer.x;
    this._dy = displayObject.y - pointer.y;
    
    return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

}

function moveToXY(displayObject, x, y, speed) {

    var _angle = Math.atan2(y - displayObject.y, x - displayObject.x);
    
    var x = Math.cos(_angle) * speed;
    var y = Math.sin(_angle) * speed;

    return { x: x, y: y };

}
