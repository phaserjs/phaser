class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create() {
        const color1 = Phaser.Display.Color.RGBStringToColor('rgb(255, 155, 55)');
        console.log(color1);

        const color2 = Phaser.Display.Color.RGBStringToColor('rgba(255, 155, 55, 0.5)');
        console.log(color2);

        const color3 = Phaser.Display.Color.RGBStringToColor('rgba(345, 50, 100, 2.5)');
        console.log(color3);

        const color4 = Phaser.Display.Color.RGBStringToColor('rgb(50, -50, 50)');
        console.log(color4);

        const color5 = Phaser.Display.Color.RGBStringToColor('RGB(255, 0, 255)');
        console.log(color5);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
