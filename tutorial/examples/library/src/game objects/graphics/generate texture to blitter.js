var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var scene = null;
var add = false;
var blitter;
var bobs = [];
var gravity = 0.5;
var idx = 1;
var frame = 'veg01';
var digits;
var numbers = [];
var iter = 0;

function preload() {

    this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');

}

function launch() {

    idx++;

    if (idx === 38)
    {
        idx = 1;
    }

    var bob = blitter.create(0, 0);

    bob.data.vx = Math.random() * 10;
    bob.data.vy = Math.random() * 10;
    bob.data.bounce = 0.8 + (Math.random() * 0.3);

    bobs.push(bob);

}

function create() {

    var starGraphics = this.make.graphics({x: 0, y: 0, add: false});
    var scale = 1;
    drawStar(starGraphics, 25, 25,  5, 25, 12, 0xFFFF00, 0xFF0000);
    starGraphics.generateTexture('starGraphics', 50, 50);

    scene = this;

    numbers.push(this.add.image(30 + 0 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 1 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 2 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 3 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 4 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 5 * 48, 720, 'atlas', '0'));
    numbers.push(this.add.image(30 + 6 * 48, 720, 'atlas', '0'));

    blitter = this.add.blitter(0, 0, 'starGraphics');

    for (var i = 0; i < 100; ++i)
    {
        launch();
    }
    
    updateDigits();

}

function update() {

    if (add)
    {
        for (var i = 0; i < 250; ++i)
        {
            launch();

            if (blitter.children.length === 2000)
            {
                //  Create a new blitter object, as they can only hold 10k bobs each
                blitter = this.add.blitter(0, 0, 'starGraphics');
            }
        }

        updateDigits();
    }

    for (var index = 0, length = bobs.length; index < length; ++index)
    {
        var bob = bobs[index];
        bob.data.vy += gravity;

        bob.y += bob.data.vy;
        bob.x += bob.data.vx;

        if (bob.x > 1024)
        {
            bob.x = 1024;
            bob.data.vx *= -bob.data.bounce;
        }
        else if (bob.x < 0)
        {
            bob.x = 0;
            bob.data.vx *= -bob.data.bounce;
        }

        if (bob.y > 650)
        {
            bob.y = 650;
            bob.data.vy *= -bob.data.bounce;
        }
    }
}

function updateDigits ()
{
    var len = Phaser.Utils.String.Pad(bobs.length.toString(), 7, '0', 1);

    numbers[0].frame = scene.textures.getFrame('atlas', len[0]);
    numbers[1].frame = scene.textures.getFrame('atlas', len[1]);
    numbers[2].frame = scene.textures.getFrame('atlas', len[2]);
    numbers[3].frame = scene.textures.getFrame('atlas', len[3]);
    numbers[4].frame = scene.textures.getFrame('atlas', len[4]);
    numbers[5].frame = scene.textures.getFrame('atlas', len[5]);
    numbers[6].frame = scene.textures.getFrame('atlas', len[6]);
}

window.onmousedown = function ()
{
    add = true;
};

window.onmouseup = function ()
{
    add = false;
};


function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    graphics.lineStyle(2, lineColor, 1.0);
    graphics.fillStyle(color, 1.0);
    graphics.beginPath();
    graphics.moveTo(cx, cy - outerRadius);
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        graphics.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        graphics.lineTo(x, y);
        rot += step;
    }
    graphics.lineTo(cx, cy - outerRadius);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
}
