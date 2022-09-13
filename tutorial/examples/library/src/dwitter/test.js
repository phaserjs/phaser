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

// https://www.dwitter.net/d/5446
function u (t)
{
    c.width|=i=300
    x.lineWidth=.1
    while(--i)q=19+S(t/6)/28*i,x.arc(S(q/3)*i+q*60,(C(q*S(t/2))+4)*i/2+200,(C(q)*60+200)*S(i/96),0,7)
    x.stroke()
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
