
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');

}

var bmd;
var img;

function create() {

    var canvas = Phaser.Canvas.create(800, 600);
    var context = canvas.getContext('2d');

    context.drawImage(game.cache.getImage('atari1'), 0, 0);

    img = context.getImageData(0, 0, 800, 600);

    var data8 = new Uint8ClampedArray(img.data.buffer);
    var data32 = new Uint32Array(img.data.buffer);

    context.drawImage(game.cache.getImage('atari1'), 32, 50);

    img = context.getImageData(0, 0, 800, 600);

    // console.log(data32[y * 800 + x]);

    var alpha = 255;
    var blue = 50;
    var red = 50;
    var green = 100;

    for (var y = 0; y < 100; y++)
    {
        for (var x = 0; x < 250; x++)
        {
            // var value = x * y & 0xff;
            // console.log(data32[y * 800 + x]);
            // data32[((y + 100) * 800) + x] = 0;
            // data32[y * 800 + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;;
            // data32[y * 800 + x] = (red << 24) | (green << 16) | (blue << 8) | alpha;
            data32[y * 800 + (x + 300)] = data32[y * 800 + x];
        }
    }

            // if (this.isLittleEndian)
            // {
            //     this.data32[y * this.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
            // }
            // else
            // {
            //     this.data32[y * this.width + x] = (red << 24) | (green << 16) | (blue << 8) | alpha;
            // }

    img.data.set(data8);
    context.putImageData(img, 0, 0);

    document.getElementById('phaser-example').appendChild(canvas);

}

function update() {


}


function render() {


}
