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

// https://www.dwitter.net/d/5475
function u (t)
{
    s=10;x.drawImage(c,s,0);for(i=0;i<=c.height;i+=s)x.fillRect(0,i,s,s,x.fillStyle=`hsl(${i/c.height*C(t*i*3)*255},100%,50%)`);
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
