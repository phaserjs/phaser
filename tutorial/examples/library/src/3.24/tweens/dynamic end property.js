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
    this.load.image('ball', 'assets/sprites/shinyball.png');
    this.load.image('cursor', 'assets/sprites/drawcursor.png');
}

function create ()
{
    var from = this.add.image(400, 300, 'ball').setAlpha(0.6);
    var marker = this.add.image(400, 300, 'cursor').setAlpha(0.6);
    var image = this.add.image(400, 300, 'ball');

    this.input.on('pointerdown', function (pointer) {

        marker.setPosition(pointer.x, pointer.y);

    });

    var tween = this.tweens.add({
        targets: image,
        props: {
            x: { value: function () { return marker.x; }, ease: 'Power1' },
            y: { value: function () { return marker.y; }, ease: 'Power3' }
        },
        duration: 500,
        yoyo: true,
        repeat: -1
    });
}
