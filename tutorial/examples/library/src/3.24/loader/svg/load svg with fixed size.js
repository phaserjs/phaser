var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    //  The original svg size is 104x97
    this.load.svg('cartman', 'assets/svg/cartman.svg');

    //  This svg will be loaded in using the new size given
    this.load.svg('cartman2', 'assets/svg/cartman.svg', { width: 416, height: 388 });
}

function create ()
{
    this.add.image(200, 300, 'cartman').setScale(2.6);

    this.add.image(600, 300, 'cartman2');
}
