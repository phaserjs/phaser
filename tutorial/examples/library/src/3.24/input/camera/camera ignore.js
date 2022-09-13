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
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    var image1 = this.add.image(400, 100, 'logo').setInteractive();
    var image2 = this.add.image(400, 300, 'logo').setInteractive();
    var image3 = this.add.image(400, 500, 'logo').setInteractive();

    var text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    image1.on('pointerover', function () {
        text.setText('Over Image 1');
    });

    image2.on('pointerover', function () {
        text.setText('Over Image 2');
    });

    image3.on('pointerover', function () {
        text.setText('Over Image 3');
    });

    //  Ignore image 2
    this.cameras.main.ignore(image2);
}
