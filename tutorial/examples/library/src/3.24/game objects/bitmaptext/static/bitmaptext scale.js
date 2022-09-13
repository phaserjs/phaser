var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
}

function create()
{
    var text = this.add.bitmapText(100, 100, 'ice', 'Terminator', 32);

    this.tweens.add({
        targets: text,
        duration: 4000,
        scaleX: 4,
        ease: 'Quad.easeInOut',
        repeat: -1,
        yoyo: true
    });

    this.tweens.add({
        targets: text,
        duration: 3000,
        scaleY: 8,
        ease: 'Cubic.easeInOut',
        repeat: -1,
        yoyo: true
    });
}
