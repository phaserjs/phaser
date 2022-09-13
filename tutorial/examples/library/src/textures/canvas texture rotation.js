var config = {
    type: Phaser.AUTO,
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
    this.load.image('mushroom', 'assets/sprites/128x128.png');
}

function create ()
{
    var texture = this.textures.createCanvas('aatest', 256, 256);

    var ctx = texture.context;

    // ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
    ctx.stroke();

    texture.refresh();

    this.add.image(300, 200, 'aatest');

    this.add.image(600, 200, 'aatest').setAngle(20);

    this.add.image(300, 450, 'mushroom');
    this.add.image(600, 450, 'mushroom').setAngle(20);

}
