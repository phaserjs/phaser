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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    var div1 = document.createElement('div');
    div1.style = 'background-color: lime; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
    div1.innerText = 'Phaser 3';

    var div2 = document.createElement('div');
    div2.style = 'background-color: yellow; width: 220px; height: 100px; font: 48px Arial; font-weight: bold';
    div2.innerText = 'Phaser 3';

    var element1 = this.add.dom(300, 0, div1);
    var element2 = this.add.dom(400, 0, div2);

    element1.setDepth(2);

    this.tweens.add({
        targets: [ element1, element2 ],
        y: 600,
        angle: 200,
        duration: 3000,
        scaleX: 2,
        ease: 'Sine.easeInOut',
        loop: -1,
        yoyo: true
    });

    this.add.image(400, 300, 'einstein');
}
