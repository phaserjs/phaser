
var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    //  All should equal Color 255, 238, 221 (alpha 255)

    var color1 = Phaser.Display.Color.ValueToColor(0xffeedd);

    console.log(color1);

    var color2 = Phaser.Display.Color.ValueToColor('#ffeedd');

    console.log(color2);

    var color3 = Phaser.Display.Color.ValueToColor('#fed');

    console.log(color3);

    var color4 = Phaser.Display.Color.ValueToColor('rgb(255, 238, 221)');

    console.log(color4);

}
