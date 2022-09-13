var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
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
    var element = this.add.dom(400, 100, 'div', 'background: linear-gradient(to bottom, rgba(30,87,153,0) 0%,rgba(30,87,153,0.8) 15%,rgba(30,87,153,1) 19%,rgba(30,87,153,1) 20%,rgba(41,137,216,1) 50%,rgba(30,87,153,1) 80%,rgba(30,87,153,1) 81%,rgba(30,87,153,0.8) 85%,rgba(30,87,153,0) 100%); width: 220px; height: 100px; font: 48px Arial; font-weight: bold; color: white', 'Phaser 3');
    element.setBlendMode('HUE');

    var element2 = this.add.dom(500, 200, 'div', 'background: linear-gradient(to bottom, rgba(30,87,153,0) 0%,rgba(30,87,153,0.8) 15%,rgba(30,87,153,1) 19%,rgba(30,87,153,1) 20%,rgba(41,137,216,1) 50%,rgba(30,87,153,1) 80%,rgba(30,87,153,1) 81%,rgba(30,87,153,0.8) 85%,rgba(30,87,153,0) 100%); width: 220px; height: 100px; font: 48px Arial; font-weight: bold; color: white', 'Phaser 3');
    element2.setBlendMode('HUE');

    this.tweens.add({
        targets: [ element, element2 ],
        y: 500,
        duration: 3000,
        ease: 'Sine.easeInOut',
        loop: -1,
        yoyo: true
    });

    this.add.image(400, 300, 'einstein');
}
