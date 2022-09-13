var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    var bunny = this.add.sprite(400, 300, 'bunny');

    //  Set a few properties:

    bunny.angle = 25;

    bunny.setScale(1.3);

    bunny.alpha = 0.9;

    bunny.flipY = true;

    console.log(bunny.toJSON());

    // console.log(JSON.stringify(bunny));

}
