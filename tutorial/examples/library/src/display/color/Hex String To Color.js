class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {

        const color1 = Phaser.Display.Color.HexStringToColor('#ff00ff');
        console.log(color1);

        const color2 = Phaser.Display.Color.HexStringToColor('#0155dd');
        console.log(color2);

        const color3 = Phaser.Display.Color.HexStringToColor('#03f');
        console.log(color3);

        const color4 = Phaser.Display.Color.HexStringToColor('#FFAAEE');
        console.log(color4);
    }

}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
