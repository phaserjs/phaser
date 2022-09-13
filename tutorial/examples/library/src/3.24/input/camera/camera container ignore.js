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
    var container1 = this.add.container(400, 100);
    var container2 = this.add.container(400, 300);
    var container3 = this.add.container(400, 500);

    var image1 = this.add.image(0, 0, 'logo').setInteractive();
    var image2 = this.add.image(0, 0, 'logo').setInteractive();
    var image3 = this.add.image(0, 0, 'logo').setInteractive();

    container1.add(image1);
    container2.add(image2);
    container3.add(image3);

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

    //  Ignore container2
    this.cameras.main.ignore(container2);
}
