class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        const color1 = new Phaser.Display.Color(150, 0, 0);
        const color2 = new Phaser.Display.Color(150, 0, 0);

        const rect1 = this.add.rectangle(200, 300, 200, 400, color1.color);
        const rect2 = this.add.rectangle(420, 300, 200, 400, color2.color);

        this.input.on('pointerup', function () {

            //  brighten the color by 10%
            color2.brighten(10);

            rect2.setFillStyle(color2.color);

        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
