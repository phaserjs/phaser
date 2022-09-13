class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create() {

        //  All should equal Color 255, 238, 221 (alpha 255)
        const color1 = Phaser.Display.Color.ValueToColor(0xffeedd);
        console.log(color1);

        const color2 = Phaser.Display.Color.ValueToColor('#ffeedd');
        console.log(color2);

        const color3 = Phaser.Display.Color.ValueToColor('#fed');
        console.log(color3);

        const color4 = Phaser.Display.Color.ValueToColor('rgb(255, 238, 221)');
        console.log(color4);

    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
