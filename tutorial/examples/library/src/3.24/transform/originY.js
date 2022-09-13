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
    this.load.image('card', 'assets/sprites/mana_card.png');
    this.load.atlas('atlas', 'assets/atlas/megaset-1.png', 'assets/atlas/megaset-1.json');
}

function create ()
{
    //  Graphics background with lines on

    var graphics = this.add.graphics();

    //  Change originY to 1 so sprites are top-aligned

    this.add.image(100, 100, 'atlas', 'mana_card').setOrigin(0.5, 0);
    this.add.image(200, 100, 'card').setOrigin(0.5, 0);

    //   By default the origin is set to 0.5 (the center of the image)

    this.add.image(350, 300, 'atlas', 'mana_card');
    this.add.image(450, 300, 'card');

    //  Change originX to 0 so sprites are left-aligned

    this.add.image(600, 500, 'atlas', 'mana_card').setOrigin(0.5, 1);
    this.add.image(700, 500, 'card').setOrigin(0.5, 1);

    //  Draw the alignment lines to our Graphics object

    graphics.lineStyle(2, 0x00ff00, 1);

    graphics.beginPath();

    graphics.moveTo(0, 100);
    graphics.lineTo(800, 100);

    graphics.moveTo(0, 300);
    graphics.lineTo(800, 300);

    graphics.moveTo(0, 500);
    graphics.lineTo(800, 500);

    graphics.strokePath();

    graphics.closePath();
}
