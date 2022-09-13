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
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var eye = this.add.sprite(0, 0, 'eye').setOrigin(0).setInteractive();

    var container = this.add.container(400, 300, [ eye ]);

    container.setSize(200, 200);
    container.setInteractive();

    container.on('pointerover', function () {

        console.log('c over');

    });

    container.on('pointerout', function () {

        console.log('c off');

    });

    eye.on('pointerover', function () {

        console.log('eye over');

    });

    eye.on('pointerout', function () {

        console.log('eye off');

    });

    // this.input.setTopOnly(true);
}
