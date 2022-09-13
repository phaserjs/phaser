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
    var box = new Phaser.Structs.Size(320, 240, 4);

    console.log(box.toString());

    // box.fitTo(550, 400);

    box.envelop(550, 400);

    console.log(box.toString());
}
