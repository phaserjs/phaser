var config = {
    type: Phaser.AUTO,
    scale: {
        _mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    var element = this.add.dom(400, 300, 'div', 'background-color: rgba(255, 255, 0, 0.5); width: 300px; height: 200px; font: 48px Arial; font-weight: bold', 'Phaser 3');

    element.setOrigin(1);

    var marker = this.add.rectangle(400, 300, 16, 16, 0xff00ff);

    this.tweens.add({
        targets: element,
        duration: 3000,
        angle: 360,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        loop: -1,
        yoyo: true
    });
}
