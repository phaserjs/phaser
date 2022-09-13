var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    resolution: 1,
    _resolution: 2,
    input: {
        touch: false
    },
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
    this.cameras.main.setBackgroundColor('#8989dd').setZoom(2);

    // this.cameras.main.setBackgroundColor('#8989dd');
    this.cameras.main.setViewport(100, 100, 500, 500).setRotation(0.3);

    var sprite = this.add.sprite(400, 300, 'eye').setInteractive();
    var si = sprite.input.hitArea;

    console.log(si);

    var graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 0.5);
    graphics.fillRect(sprite.x, sprite.y, si.width, si.height);

    sprite.on('pointerdown', function () {

        console.log('down');

    });

    sprite.on('pointermove', function () {

        this.setTint(Math.random() * 16000000);

    });

    var gui = new dat.GUI();
    var pointer = this.input.activePointer;

    gui.addFolder('Input');
    gui.add(pointer, 'x').listen();
    gui.add(pointer, 'y').listen();
}
