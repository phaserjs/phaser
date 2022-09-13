class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/a-new-link-to-the-past-by-ptimm.jpg');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    }

    create ()
    {
        this.add.image(400, 300, 'pic');

        this.logo = this.add.image(400, 200, 'logo')
            .setVisible(false);

        //  Let's show the logo when the camera shakes, and hide it when it completes
        this.cameras.main.on('camerafadeoutstart', function () {

            this.logo.setVisible(true);

        }, this);

        this.cameras.main.on('camerafadeoutcomplete', function () {

            this.logo.setVisible(false);

        }, this);

        //  Every time you click, fade the camera
        this.input.on('pointerdown', function () {

            //  Get a random color
            var red = Phaser.Math.Between(50, 255);
            var green = Phaser.Math.Between(50, 255);
            var blue = Phaser.Math.Between(50, 255);

            this.cameras.main.fade(2000, red, green, blue);

        }, this);
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
