var demo = new Phaser.Scene('Demo');

demo.preload = function ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

demo.create = function ()
{
    this.add.image(400, 300, 'face');
}

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: demo
};

var game = new Phaser.Game(config);
