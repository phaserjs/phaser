var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/ui/undersea-bg.png');
    this.load.image('up', 'assets/ui/up-bubble.png');
    this.load.image('down', 'assets/ui/down-bubble.png');
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var image1 = this.add.image(0, 80, 'fish', 0);

    this.tweens.add({
        targets: image1,
        props: {
            x: { value: 700, duration: 4000, flipX: true },
            y: { value: 500, duration: 8000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    var image2 = this.add.image(400, 80, 'fish', 1);

    this.tweens.add({
        targets: image2,
        props: {
            x: { value: 500, duration: 2000, flipX: true },
            y: { value: 500, duration: 10000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    var image3 = this.add.image(800, 200, 'fish', 2).setFlipX(true);

    this.tweens.add({
        targets: image3,
        props: {
            x: { value: 70, flipX: true },
            y: { value: 250 },
        },
        duration: 3000,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
    });

    var image4 = this.add.image(100, 550, 'fish', 2).setScale(0.75);

    this.tweens.add({
        targets: image4,
        props: {
            x: { value: 700, duration: 2000, flipX: true },
            y: { value: 50, duration: 15000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    //  Buttons to control the Tween timescale

    var text = this.add.text(180, 0, 'Global timeScale: 1').setFont('32px Arial Black').setFill('#ffffff').setShadow(2, 2, "#333333", 2);

    var tweens = this.tweens;

    var downButton = this.add.image(70, 530, 'down').setInteractive();

    downButton.on('pointerdown', function (event) {

        if (tweens.timeScale > 0)
        {
            tweens.timeScale -= 0.1;
        }

        text.setText('Global timeScale: ' + tweens.timeScale.toFixed(2));

    });

    var upButton = this.add.image(730, 530, 'up').setInteractive();

    upButton.on('pointerdown', function (event) {

        if (tweens.timeScale < 9.9)
        {
            tweens.timeScale += 0.1;
        }

        text.setText('Global timeScale: ' + tweens.timeScale.toFixed(2));

    });

}
