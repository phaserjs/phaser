var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/turkey-1985086.jpg');
    // this.load.image('swirl', 'assets/pics/mask.png');
    this.load.image('swirl', 'assets/pics/gridmask.png');
    this.load.image('titan', 'assets/pics/titan-mech.png');
}

function create ()
{
    var pic = this.add.sprite(400, 300, 'pic');

    //  We hide it because we don't need it rendering as well
    // var swirl = this.add.image(0, 0, 'swirl');
    var swirl = this.add.image(0, 0, 'swirl').setVisible(false);

    var mask = swirl.createBitmapMask();

    pic.setMask(mask);

    this.add.sprite(400, 300, 'titan');

    this.input.on('pointermove', function (pointer) {

        swirl.x = pointer.x;
        swirl.y = pointer.y;

    });
}
