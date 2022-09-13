
var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    var color1 = Phaser.Display.Color.HexStringToColor('#ff00ff');

    console.log(color1);

    var color2 = Phaser.Display.Color.HexStringToColor('#0155dd');

    console.log(color2);

    var color3 = Phaser.Display.Color.HexStringToColor('#03f');

    console.log(color3);

    var color4 = Phaser.Display.Color.HexStringToColor('#FFAAEE');

    console.log(color4);

}
