const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    clearBeforeRender: false,
    preserveDrawingBuffer: true,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
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
}
