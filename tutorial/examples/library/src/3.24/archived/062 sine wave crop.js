
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    this.load.image('pic', 'assets/pics/jim_sachs_time_crystal.png');

}

var slices;
var waveform;

var xl;
var cx = 0;

function create() {

    // game.stage.backgroundColor = '#0055ff';

    //  Generate our motion data
    var motion = { x: 0 };
    var tween = this.add.tween(motion).to( { x: 200 }, 3000, "Bounce.easeInOut", true, 0, -1, true);
    waveform = tween.generateData(60);

    xl = waveform.length - 1;

    slices = [];

    var picWidth = game.cache.getImage('pic').width;
    var picHeight = game.cache.getImage('pic').height;

    console.log(picWidth, picHeight);

    var ys = 4;

    for (var y = 0; y < Math.floor(picHeight/ys); y++)
    {
        var star = this.add.image(300, 100 + (y * ys), 'pic');

        //  Needs to clone the Frame, or they'll all use the same shared Frame crop

        star.frame = game.textures.cloneFrame('pic');

        //  This needs to move within the Texture Manager maybe?
        Phaser.TextureCrop(star, picWidth, ys, 0, y * ys);

        star.ox = star.x;

        star.cx = Phaser.Math.wrap(y * 2, 0, xl);

        star.anchor = 0.5;

        slices.push(star);
    }

}

function update() {

    for (var i = 0, len = slices.length; i < len; i++)
    {
        slices[i].x = slices[i].ox + waveform[slices[i].cx].x;

        slices[i].cx++;

        if (slices[i].cx > xl)
        {
            slices[i].cx = 0;
        }

    }

}
