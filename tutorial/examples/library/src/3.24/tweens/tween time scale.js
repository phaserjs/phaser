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

    var image1 = this.add.image(100, 80, 'fish', 0);
    var image2 = this.add.image(100, 180, 'fish', 1);
    var image3 = this.add.image(100, 280, 'fish', 2);
    var image4 = this.add.image(100, 380, 'fish', 1);
    var image5 = this.add.image(100, 480, 'fish', 0);

    var tween = this.tweens.add({
        targets: [ image1, image2, image3, image4, image5 ],
        x: 700,
        duration: 4000,
        ease: 'Sine.easeInOut',
        flipX: true,
        yoyo: true,
        repeat: -1,
        delay: function (target, key, value, targetIndex) {
            return targetIndex * 1000;
        }
    });

    //  Buttons to control the Tween timescale

    var text = this.add.text(250, 0, 'timeScale: 1').setFont('32px Arial Black').setFill('#ffffff').setShadow(2, 2, "#333333", 2);

    var downButton = this.add.image(70, 530, 'down').setInteractive();
    var upButton = this.add.image(730, 530, 'up').setInteractive();

    this.input.on('gameobjectup', function (pointer, gameobject) {

        if (gameobject === downButton && tween.timeScale > 0)
        {
            tween.timeScale -= 0.1;
        }
        else if (gameobject === upButton && tween.timeScale < 9.9)
        {
            tween.timeScale += 0.1;
        }

        text.setText('timeScale: ' + tween.timeScale.toFixed(2));

    });
}
