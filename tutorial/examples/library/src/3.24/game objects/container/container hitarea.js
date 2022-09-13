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

    var container = this.add.container(400, 300, [ bg, text ]).setAngle(-30);

    container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);

    this.tweens.add({
        targets: container,
        angle: 30,
        duration: 3000,
        ease: 'Sine.easeOut',
        yoyo: true,
        repeat: -1
    });

    this.tweens.add({
        targets: text,
        alpha: 0.5,
        duration: 1000,
        ease: 'Sine.easeOut',
        yoyo: true,
        repeat: -1
    });

    container.on('pointerover', function () {

        bg.setTint(0x44ff44);

    });

    container.on('pointerout', function () {

        bg.clearTint();

    });

    container.once('pointerup', function () {

        this.destroy();

    });

    //  Just to display the hit area, not actually needed to work
    var graphics = this.add.graphics();

    graphics.lineStyle(2, 0x00ffff, 1);

    graphics.strokeCircle(container.x, container.y, container.input.hitArea.radius);
}
