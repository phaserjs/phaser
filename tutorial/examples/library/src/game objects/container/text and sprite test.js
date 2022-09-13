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
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.load.image('ball', 'assets/demoscene/doc-ball.png');
}

function create ()
{
    var container = this.add.container(400, 300);

    var ball = this.add.image(0, 0, 'ball');
    var text = this.add.text(0, 0, 'Testing');
    text.font = "Arial";
    text.setOrigin(0.5, 0.5);

    container.add(ball);
    container.add(text);
    container.setScale(4);

    this.tweens.add({
        targets: container,
        x: container.x + 100,
        ease: 'Power1',
        duration: 5000,
        delay: 500,
        yoyo: true,
        repeat: -1
    });
}