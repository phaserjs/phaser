var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var spider;
var guide;
var light;
var circle;
var point;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('spider', ['assets/normal-maps/spider.png', 'assets/normal-maps/spider_n.png']);
    this.load.image('light', 'assets/normal-maps/light.png');
}

function create ()
{
    spider = this.add.sprite(400, 300, 'spider');
    spider.setPipeline('Light2D');

    light  = this.lights.addLight(0, 0, 500).setIntensity(6);

    this.lights.enable().setAmbientColor(0x888888);

    //  So you can see where the light is positioned
    circle = new Phaser.Geom.Circle(400, 300, 200);

    guide = this.add.image(0, 0, 'light');
}

function update ()
{
    spider.rotation += 0.005;

    Phaser.Geom.Circle.CircumferencePoint(circle, spider.rotation - (Math.PI / 2), guide);

    light.x = guide.x;
    light.y = guide.y;
}
