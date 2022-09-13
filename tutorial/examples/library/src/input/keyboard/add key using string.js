var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var keys;

var imageP;
var imageH;
var imageA;
var imageS;
var imageE;
var imageR;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('P', 'assets/input/p.png');
    this.load.image('H', 'assets/input/h.png');
    this.load.image('A', 'assets/input/a.png');
    this.load.image('S', 'assets/input/s.png');
    this.load.image('E', 'assets/input/e.png');
    this.load.image('R', 'assets/input/r.png');
}

function create ()
{
    imageP = this.add.image(50, 300, 'P').setOrigin(0);
    imageH = this.add.image(200, 300, 'H').setOrigin(0);
    imageA = this.add.image(350, 300, 'A').setOrigin(0);
    imageS = this.add.image(500, 300, 'S').setOrigin(0);
    imageE = this.add.image(650, 300, 'E').setOrigin(0);
    imageR = this.add.image(800, 300, 'R').setOrigin(0);

    keys = this.input.keyboard.addKeys('P,H,A,S,E,R');

    text = this.add.text(10, 10, 'Press one of the keys P, H, A, S, E or R', { font: '16px Courier', fill: '#000000' });
}

function update ()
{
    imageP.setAlpha((keys.P.isDown) ? 1 : 0.2);
    imageH.setAlpha((keys.H.isDown) ? 1 : 0.2);
    imageA.setAlpha((keys.A.isDown) ? 1 : 0.2);
    imageS.setAlpha((keys.S.isDown) ? 1 : 0.2);
    imageE.setAlpha((keys.E.isDown) ? 1 : 0.2);
    imageR.setAlpha((keys.R.isDown) ? 1 : 0.2);
}
