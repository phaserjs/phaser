var config = {
    type: Phaser.CANVAS,
    backgroundColor: '#2dab2d',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic1', 'assets/pics/neuromancer.jpg');
    this.load.image('pic2', 'assets/pics/monika-krawinkel-amberstar-title.png');
    this.load.image('pic3', 'assets/pics/game14-angel-dawn.png');
    this.load.image('pic4', 'assets/pics/ninja-masters2.png');
}

function create ()
{
    var pic1 = this.add.image(0, 0, 'pic1').setOrigin(0);
    var pic2 = this.add.image(0, 0, 'pic2').setOrigin(0).setVisible(false);
    var pic3 = this.add.image(0, 0, 'pic3').setOrigin(0).setVisible(false);
    var pic4 = this.add.image(0, 0, 'pic4').setOrigin(0).setVisible(false);

    var text = this.add.text(10, 10, 'Click to change game size', { font: '16px Courier', fill: '#00ff00' });

    var state = 0;

    this.input.on('pointerdown', function () {

        if (state === 0)
        {
            // this.scale.setGameSize(320, 200);
            this.scale.resize(320, 200);

            text.setText('320 x 200');

            pic1.setVisible(false);
            pic2.setVisible(true);

            state = 1;
        }
        else if (state === 1)
        {
            // this.scale.setGameSize(640, 400);
            this.scale.resize(640, 400);

            text.setText('640 x 400');

            pic2.setVisible(false);
            pic3.setVisible(true);

            state = 2;
        }
        else if (state === 2)
        {
            // this.scale.setGameSize(1216, 896);
            this.scale.resize(1216, 896);

            text.setText('1216 x 896');

            pic3.setVisible(false);
            pic4.setVisible(true);

            state = 3;
        }
        else if (state === 3)
        {
            // this.scale.setGameSize(800, 600);
            this.scale.resize(800, 600);

            text.setText('800 x 600');

            pic4.setVisible(false);
            pic1.setVisible(true);

            state = 0;
        }

    }, this);

    // this.scale.on('resize', resize, this);
}

function resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);
}
