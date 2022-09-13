var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
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
    this.add.sprite(300, 300, 'eye').setInteractive();

    this.cameras.main.setName('cam1');

    //  Create more Cameras over the top of the main one
    var cam2 = this.cameras.add().setName('cam2');

    cam2.scrollX = 100;
    cam2.scrollY = 100;

    var cam3 = this.cameras.add().setName('cam3');;

    cam3.scrollX = 200;
    cam3.scrollY = 200;

    this.input.on('gameobjectover', function (pointer, gameObject) {

        console.log(pointer.camera.name);
        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });
}
