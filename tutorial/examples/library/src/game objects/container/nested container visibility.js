var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
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
    var container1 = this.add.container(100, 100);
    var container2 = this.add.container(200, 200);

    var sprite = this.add.image(0, 0, 'eye');
    
    container1.add(container2);
    container2.add(sprite);

    this.input.once('pointerdown', function () {

        container2.setVisible(false);
        console.log('off', container2.visible);

    });
}
