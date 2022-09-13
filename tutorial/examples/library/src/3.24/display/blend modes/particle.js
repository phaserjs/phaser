var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprites = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/space1.png');
    this.load.image('particle', 'assets/particles/yellow.png');
    this.load.image('logo', 'assets/sprites/phaser2.png');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    //  Create the particles
    for (var i = 0; i < 300; i++)
    {
        var x = Phaser.Math.Between(-64, 800);
        var y = Phaser.Math.Between(-64, 600);

        var image = this.add.image(x, y, 'particle');

        //  Canvas and WebGL:

        // NORMAL
        // ADD
        // MULTIPLY
        // SCREEN

        //  Canvas only:

        // OVERLAY
        // DARKEN
        // LIGHTEN
        // COLOR_DODGE
        // COLOR_BURN
        // HARD_LIGHT
        // SOFT_LIGHT
        // DIFFERENCE
        // EXCLUSION
        // HUE
        // SATURATION
        // COLOR
        // LUMINOSITY

        image.setBlendMode(Phaser.BlendModes.ADD);

        sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    this.add.image(400, 300, 'logo').setBlendMode(Phaser.BlendModes.SCREEN);
}

function update ()
{
    for (var i = 0; i < sprites.length; i++)
    {
        var sprite = sprites[i].s;

        sprite.y -= sprites[i].r;

        if (sprite.y < -256)
        {
            sprite.y = 700;
        }
    }
}
