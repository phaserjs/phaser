var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var camera;
var grass = [];
var track;
var acceleration = { z: 18 };
var startZ = 2000;
var grassFrames = [ 7, 8, 1, 2, 20, 7, 8, 1, 2, 20, 7, 8, 1, 2, 20, 6, 3, 1, 2, 20, 6, 3, 4, 8, 7, 14, 16, 11, 13, 12, 9, 25, 27, 5, 10, 15, 17, 18, 19, 21, 22, 23, 24, 26, 28, 29, 30 ];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('sky', 'assets/tests/meadow/summer.jpg');
    this.load.image('strip', 'assets/tests/meadow/grass-strip.png');
    this.load.atlas('grass', 'assets/tests/meadow/grass.png', 'assets/tests/meadow/grass.json');
}

function create ()
{
    var sky = this.add.image(300, -100, 'sky').setOrigin(0.5, 0).setDepth(-1000);

    camera = this.cameras3d.add(40).setPosition(200, -190, 1500).setPixelScale(384);

    var width = 20;
    var depth = 60;
    var left = -(80 * (width / 2));

    //  Grass strips

    track = camera.createRect({ x: 1, y: 1, z: 32 }, 120, 'strip');

    for (var z = 0; z < depth; z++)
    {
        for (var x = 0; x < width; x++)
        {
            var diff = Phaser.Math.Between(-60, 60)

            var bx = left + (x * 80) + diff;
            var bz = (z * 96) + diff;

            var sprite3D = camera.create(bx, 0, bz, 'grass', 'grass-spring-' + Phaser.Math.RND.weightedPick(grassFrames));

            sprite3D.gameObject.setOrigin(0.5, 1);

            grass.push(sprite3D);
        }
    }

    this.cameras.main.rotation = -0.2;

    //  Tweens

    this.tweens.add({
        targets: this.cameras.main,
        rotation: 0.2,
        duration: 6000,
        delay: 5000,
        yoyo: true,
        repeat: -1,
        repeatDelay: 4000,
        hold: 3000,
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
        targets: acceleration,
        z: 10,
        delay: 12000,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        repeatDelay: 8000,
        hold: 3000,
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
        targets: camera,
        y: -130,
        delay: 12000,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        repeatDelay: 8000,
        hold: 3000,
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
        targets: camera,
        x: -200,
        delay: 20000,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        repeatDelay: 8000,
        hold: 5000,
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
        targets: sky,
        x: 400,
        delay: 20000,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        repeatDelay: 8000,
        hold: 5000,
        ease: 'Sine.easeInOut'
    });

    this.cameras.main.flash(5000);
}

function update ()
{
    //  Move it
    for (var i = 0; i < track.length; i++)
    {
        var segment = track[i];

        segment.z += acceleration.z;

        if (segment.z > (camera.z + 128))
        {
            segment.z -= startZ;
        }
    }

    for (var i = 0; i < grass.length; i++)
    {
        var segment = grass[i];

        segment.z += acceleration.z;

        if (segment.z > (camera.z + 128))
        {
            segment.gameObject.setFrame('grass-spring-' + Phaser.Math.RND.weightedPick(grassFrames));
            segment.size.set(segment.gameObject.width, segment.gameObject.height);
            segment.gameObject.setOrigin(0.5, 1);
            segment.z -= startZ;
        }
    }

    camera.update();
}
