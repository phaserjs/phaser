
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });

var text = null;
var textReflect = null;

function create() {

    game.stage.backgroundColor = 0x3b0760;

    text = game.add.text(game.world.centerX, game.world.centerY, "- PHASER -");

    //  Centers the text
    text.anchor.set(0.5);
    text.align = 'center';

    //  Our font + size
    text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 70;
    text.fill = '#ffffff';

    //  Here we create our fake reflection :)
    //  It's just another Text object, with an alpha gradient and flipped vertically

    textReflect = game.add.text(game.world.centerX, game.world.centerY + 50, "- PHASER -");

    //  Centers the text
    textReflect.anchor.set(0.5);
    textReflect.align = 'center';
    textReflect.scale.y = -1;

    //  Our font + size
    textReflect.font = 'Arial';
    textReflect.fontWeight = 'bold';
    textReflect.fontSize = 70;

    //  Here we create a linear gradient on the Text context.
    //  This uses the exact same method of creating a gradient as you do on a normal Canvas context.
    var grd = textReflect.context.createLinearGradient(0, 0, 0, text.canvas.height);

    //  Add in 2 color stops
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(255,255,255,0.08)');

    //  And apply to the Text
    textReflect.fill = grd;

}
