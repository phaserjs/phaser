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
    var color = new Phaser.Display.Color();

    for (var i = 0; i < 100; i++)
    {
        color.random(50);

        this.add.rectangle(400, i * 6, 800, 6, color.color);
    }
}
