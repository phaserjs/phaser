var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var scene = null;
var add = false;
var blitter;
var idx = 1;
var frame = 'veg01';
var numbers = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
}

function launch (i)
{
    idx++;

    if (idx === 38)
    {
        idx = 1;
    }

    if (idx < 10)
    {
        frame = 'veg0' + idx.toString();
    }
    else
    {
        frame = 'veg' + idx.toString();
    }

    var bob = blitter.create(i * 32, 0, frame);

    scene.tweens.add({
        targets: bob,
        y: 650,
        delay: Math.random() * 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

function create ()
{
    scene = this;

    numbers.push(this.add.image(0 * 48, 720, 'atlas', '0').setOrigin(0));
    numbers.push(this.add.image(1 * 48, 720, 'atlas', '0').setOrigin(0));
    numbers.push(this.add.image(2 * 48, 720, 'atlas', '0').setOrigin(0));
    numbers.push(this.add.image(3 * 48, 720, 'atlas', '0').setOrigin(0));
    numbers.push(this.add.image(4 * 48, 720, 'atlas', '0').setOrigin(0));
    numbers.push(this.add.image(5 * 48, 720, 'atlas', '0').setOrigin(0));

    blitter = this.add.blitter(0, 0, 'atlas');
   
    updateDigits();

    this.input.on('pointerdown', function () {

        add = true;

    });

    this.input.on('pointerup', function () {

        add = false;

    });
}

function update ()
{
    if (add)
    {
        for (var i = 0; i < 32; ++i)
        {
            launch(i);
        }

        updateDigits();
    }
}

function updateDigits ()
{
    var len = Phaser.Utils.String.Pad(blitter.children.length.toString(), 6, '0', 1);

    numbers[0].setFrame(len[0]);
    numbers[1].setFrame(len[1]);
    numbers[2].setFrame(len[2]);
    numbers[3].setFrame(len[3]);
    numbers[4].setFrame(len[4]);
    numbers[5].setFrame(len[5]);
}
