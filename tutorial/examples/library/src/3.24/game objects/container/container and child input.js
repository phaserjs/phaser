var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('buttonBG', 'assets/sprites/button-bg.png');
    this.load.image('buttonText', 'assets/sprites/button-text.png');
}

function create ()
{
    var bg = this.add.image(0, 0, 'buttonBG');
    var text = this.add.image(0, 0, 'buttonText');

    var bg2 = this.add.image(0, 80, 'buttonBG');
    var text2 = this.add.image(0, 80, 'buttonText');

    var container = this.add.container(400, 200, [ bg, text, bg2, text2 ]);

    container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);

    bg2.setInteractive();

    container.on('pointerover', function () {

        bg.setTint(0x44ff44);

    });

    container.on('pointerout', function () {

        bg.clearTint();

    });

    bg2.on('pointerover', function () {

        this.setTint(0xff44ff);

    });

    bg2.on('pointerout', function () {

        this.clearTint();

    });

    //  Just to display the hit area, not actually needed to work
    var graphics = this.add.graphics();

    graphics.lineStyle(2, 0x00ffff, 1);

    graphics.strokeCircle(container.x, container.y, container.input.hitArea.radius);
}
