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

    //  Change originX to 1 so sprites are right-aligned

    this.add.image(200, 200, 'atlas', 'mana_card').setOrigin(1, 0.5);
    this.add.image(200, 400, 'card').setOrigin(1, 0.5);

    //   By default the origin is set to 0.5 (the center of the image)

    this.add.image(400, 200, 'atlas', 'mana_card');
    this.add.image(400, 400, 'card');

    //  Change originX to 0 so sprites are left-aligned

    this.add.image(600, 200, 'atlas', 'mana_card').setOrigin(0, 0.5);
    this.add.image(600, 400, 'card').setOrigin(0, 0.5);

    //  Draw the alignment lines to our Graphics object

    graphics.lineStyle(2, 0x00ff00, 1);

    graphics.beginPath();

    graphics.moveTo(200, 0);
    graphics.lineTo(200, 600);

    graphics.moveTo(400, 0);
    graphics.lineTo(400, 600);

    graphics.moveTo(600, 0);
    graphics.lineTo(600, 600);

    graphics.strokePath();

    graphics.closePath();
}
