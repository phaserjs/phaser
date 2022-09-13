var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#000000',
    maxLights: 20,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
}

function create ()
{
    this.add.image(400, 300, 'brick').setPipeline('Light2D');

    this.lights.enable().setAmbientColor(0x555555);

    var hsv = Phaser.Display.Color.HSVColorWheel();

    var radius = 80;
    var intensity = 6;
    var x = radius;
    var y = 0;

    //  To change the total number of lights see the Game Config object
    var maxLights = 20;

    //  Create a bunch of lights
    for (var i = 0; i < maxLights; i++)
    {
        var color = hsv[i * 10].color;

        var light = this.lights.addLight(x, y, radius, color, intensity);

        this.tweens.add({
            targets: light,
            y: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 2000,
            delay: i * 100
        });

        x += radius * 2;

        if (x > 800)
        {
            x = radius;
            y += radius;
        }
    }
}
