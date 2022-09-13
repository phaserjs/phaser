var config = {
    type: Phaser.AUTO,
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
    var color1 = new Phaser.Display.Color(150, 0, 0);
    var color2 = new Phaser.Display.Color(150, 0, 0);

    var rect1 = this.add.rectangle(200, 300, 200, 400, color1.color);
    var rect2 = this.add.rectangle(420, 300, 200, 400, color2.color);

    this.input.on('pointerup', function () {

        //  brighten the color by 10%
        color2.brighten(10);

        rect2.setFillStyle(color2.color);

    });
}
