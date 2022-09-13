var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var element;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    var div = document.createElement('div');
    div.style = 'background-color: lime; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
    div.innerText = 'Phaser 3';

    element = this.add.dom(400, 300, div);
    element.setPerspective(800);
    // element.rotate3d.set(1, 0, 0, 0);
    element.rotate3d.set(0, 1, 0, 0);

    this.tweens.add({
        targets: element.rotate3d,
        w: 80,
        duration: 3000,
        ease: 'Sine.easeInOut',
        loop: -1,
        yoyo: true
    });

    this.add.image(400, 300, 'einstein');
}
