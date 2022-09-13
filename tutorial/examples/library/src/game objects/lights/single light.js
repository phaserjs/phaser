var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    this.load.image('logo', 'assets/sprites/atari130xe.png');
}

function create ()
{
    this.add.image(400, 300, 'brick').setPipeline('Light2D');

    this.add.image(400, 300, 'logo');

    this.lights.enable().setAmbientColor(0x555555);

    var hsv = Phaser.Display.Color.HSVColorWheel();

    var radius = 80;
    var intensity = 6;
    var x = radius;
    var y = 0;

    var color = hsv[10].color;

    var light = this.lights.addLight(400, y, radius, color, intensity);

    this.tweens.add({
        targets: light,
        y: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        duration: 2000
    });
}
