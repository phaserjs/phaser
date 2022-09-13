var config = {
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var rgb1 = {r: 255, g: 17, b: 20, color: 16716052};

    var hsv1 = Phaser.Display.Color.RGBToHSV(rgb1.r, rgb1.g, rgb1.b);

    var rgb2 = Phaser.Display.Color.HSVToRGB(hsv1.h, hsv1.s, hsv1.v);

    console.assert(
        rgb1.r === rgb2.r && rgb1.g === rgb2.g && rgb1.b === rgb2.b, 
        "Colors are not equal:", rgb1, rgb2
    );

}
