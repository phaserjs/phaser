var config = {
    type: Phaser.CANVAS,
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
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    //  Graphics background with lines on

    var graphics = this.add.graphics();

    this.add.image(200, 100, 'ball').setOrigin(0, 0);
    this.add.image(400, 100, 'ball').setOrigin(0, 0.5);
    this.add.image(600, 100, 'ball').setOrigin(0, 1);

    this.add.image(200, 200, 'ball').setOrigin(0, 0);
    this.add.image(400, 200, 'ball').setOrigin(0.5, 0);
    this.add.image(600, 200, 'ball').setOrigin(1, 0);

    this.add.image(200, 300, 'ball').setOrigin(0, 0);
    this.add.image(400, 300, 'ball').setOrigin(0.5, 0.5);
    this.add.image(600, 300, 'ball').setOrigin(1, 1);

    this.add.image(200, 400, 'ball').setOrigin(1, 0);
    this.add.image(400, 400, 'ball').setOrigin(1, 0.25);
    this.add.image(600, 400, 'ball').setOrigin(1, 0.5);

    this.add.image(200, 500, 'ball').setOrigin(0.25, 1);
    this.add.image(400, 500, 'ball').setOrigin(0.5, 0.25);
    this.add.image(600, 500, 'ball').setOrigin(0.75, 0.5);

    //  Draw the alignment lines to our Graphics object

    graphics.lineStyle(1, 0x00ff00, 1);

    graphics.beginPath();

    //  Vertical lines

    graphics.moveTo(200, 0);
    graphics.lineTo(200, 600);

    graphics.moveTo(400, 0);
    graphics.lineTo(400, 600);

    graphics.moveTo(600, 0);
    graphics.lineTo(600, 600);

    //  Horizontal lines

    graphics.moveTo(0, 100);
    graphics.lineTo(800, 100);

    graphics.moveTo(0, 200);
    graphics.lineTo(800, 200);

    graphics.moveTo(0, 300);
    graphics.lineTo(800, 300);

    graphics.moveTo(0, 400);
    graphics.lineTo(800, 400);

    graphics.moveTo(0, 500);
    graphics.lineTo(800, 500);

    graphics.strokePath();

    graphics.closePath();
}
