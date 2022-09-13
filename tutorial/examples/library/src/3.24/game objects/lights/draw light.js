var ColourSpectrum = function ()
{
    this.colors = [];

    var rgbRange = 255;
    var r = 255;
    var g = 0;
    var b = 0;

    //  From red to yellow:
    for (var g = 0; g <= rgbRange; g++)
    {
        this.colors.push({ r: r, g: g, b: b });
    }

    //  From yellow to green:
    for (var r = rgbRange; r >= 0; r--)
    {
        this.colors.push({ r: r, g: g, b: b });
    }

    //  From green to blue:
    for (var b=0; b <= rgbRange; b++, g--)
    {
        this.colors.push({ r: r, g: g, b: b });
    }

    //  From blue to red:
    for (var d = 0; d <= rgbRange; d++, b--, r++)
    {
        this.colors.push({ r: r, g: g, b: b });
    }

    this.random = function ()
    {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    this.get = function (index)
    {
        if (index > this.colors.length || index < 0)
        {
            console.error("Index exceeds range");
        }
        else
        {
            return this.colors[index];
        }
    }
};

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    this.load.image('bg', 'assets/textures/gold.png');
}

function create ()
{
    this.add.sprite(400, 300, 'bg').setAlpha(0.2);

    var cs = new ColourSpectrum();

    var colorIndex = 0;

    var light = this.lights.addPointLight(400, 300, 0xffffff, 128, 0.4);

    this.input.on('pointermove', pointer => {

        light.x = pointer.x;
        light.y = pointer.y;

        if (pointer.isDown)
        {
            light = this.lights.addPointLight(pointer.x, pointer.y, 0xffffff, 128, 0.4);

            var color = cs.random();

            light.color.set(color.r / 255, color.g / 255, color.b / 255);
        }

    });

    this.add.sprite(680, 600, 'sonic').setOrigin(0.5, 1).setDepth(1);
}
