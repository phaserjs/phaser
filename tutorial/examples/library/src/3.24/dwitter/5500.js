var config = {
    width: 960,
    height: 540,
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    backgroundColor: '#ffffff',
    scene: {
        create: create,
        update: update
    }
};

//  dwitter globals

var c;
var x;

var time = 0;
var frame = 0;

var S = Math.sin;
var C = Math.cos;
var T = Math.tan;

function R (r,g,b,a)
{
    a = a === undefined ? 1 : a;
    
    return "rgba("+(r|0)+","+(g|0)+","+(b|0)+","+a+")";
};

var game = new Phaser.Game(config);

// https://www.dwitter.net/d/5500
function u (t)
{
    c.width=1920;p=Math.PI*2;x.beginPath();a=540;for(i=0;i<480;i++){b=p*(i/480)*T(t/4);x.lineTo(0,a+a*S(b));x.lineTo(i*4,a+a*-S(b))}x.stroke()
}

function create ()
{
    var canvasTexture = this.textures.createCanvas('dwitter', 1920, 1080);

    c = canvasTexture.getSourceImage();
    x = c.getContext('2d');

    this.add.image(0, 0, 'dwitter').setOrigin(0).setScale(0.5);
}

function update ()
{
    time = frame / 60;

    if (time * 60 | 0 == frame - 1)
    {
        time += 0.000001;
    }

    frame++;

    u(time);
}
