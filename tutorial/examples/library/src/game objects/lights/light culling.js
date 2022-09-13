var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var land;
var text;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setPath('assets/normal-maps/');

    this.load.image('gem1');
    this.load.image('gem2');
    this.load.image('gem3');
    this.load.image('gem4');
    this.load.image('gem5');
    this.load.image('gem6');
    this.load.image('gem7');
    this.load.image('gem8');
    this.load.image('gem9');

    this.load.image('stones', [ 'stones.png', 'stones_n.png' ]);
}

function create ()
{
    this.cameras.main.removeBounds();

    land = this.add.tileSprite(400, 300, 800, 600, 'stones');

    land.setPipeline('Light2D');
    land.setScrollFactor(0, 0);
    land.tileScaleX = 0.5;
    land.tileScaleY = 0.5;

    this.lights.enable();
    this.lights.setAmbientColor(0x555555);

    var spotlight = this.lights.addLight(400, 300, 128).setIntensity(3);

    this.input.on('pointermove', function (pointer) {

        spotlight.x = pointer.worldX;
        spotlight.y = pointer.worldY;

    });

    text = this.add.text(10, 10, '').setDepth(1).setScrollFactor(0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    var i;
    var circ = new Phaser.Geom.Circle(400, 300, 400);
    var points = Phaser.Geom.Circle.GetPoints(circ, 12);

    for (i = 0; i < points.length; i++)
    {
        var x = points[i].x;
        var y = points[i].y;

        this.add.image(x, y, 'gem2');

        this.lights.addLight(x, y, 128, 0xff22ff, 6);
    }

    circ.setTo(400, 300, 700);
    points = Phaser.Geom.Circle.GetPoints(circ, 20);

    for (i = 0; i < points.length; i++)
    {
        var x = points[i].x;
        var y = points[i].y;

        this.add.image(x, y, 'gem3');

        this.lights.addLight(x, y, 128, 0x22ffff, 6);
    }

    circ.setTo(400, 300, 1000);
    points = Phaser.Geom.Circle.GetPoints(circ, 26);

    for (i = 0; i < points.length; i++)
    {
        var x = points[i].x;
        var y = points[i].y;

        this.add.image(x, y, 'gem4');

        this.lights.addLight(x, y, 128, 0xffff22, 6);
    }
}

function update ()
{
    text.setText([
        'Cursors to move',
        'Visible Lights: ' + this.lights.visibleLights
    ]);

    var speed = 6;

    if (cursors.left.isDown)
    {
        this.cameras.main.scrollX -= speed;
        land.tilePositionX -= speed * 2;
    }
    else if (cursors.right.isDown)
    {
        this.cameras.main.scrollX += speed;
        land.tilePositionX += speed * 2;
    }

    if (cursors.up.isDown)
    {
        this.cameras.main.scrollY -= speed;
        land.tilePositionY -= speed * 2;
    }
    else if (cursors.down.isDown)
    {
        this.cameras.main.scrollY += speed;
        land.tilePositionY += speed * 2;
    }
}
