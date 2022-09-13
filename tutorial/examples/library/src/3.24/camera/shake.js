var config = {
    type: Phaser.AUTO,
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
    this.load.image('pic', 'assets/pics/a-new-link-to-the-past-by-ptimm.jpg');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    this.add.image(400, 300, 'pic');

    var logo = this.add.image(400, 200, 'logo').setVisible(false);

    //  Let's show the logo when the camera shakes, and hide it when it completes

    this.cameras.main.on('camerashakestart', function () {

        logo.setVisible(true);

    });

    this.cameras.main.on('camerashakecomplete', function () {

        logo.setVisible(false);

    });

    //  Every time you click, shake the camera

    this.input.on('pointerdown', function () {

        this.cameras.main.shake(500);

    }, this);
}
