var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('lemming', 'assets/sprites/lemming.png');

}

var container;

function create() {

    container = this.add.container();

    //  Let's add 10 children to the container

    for (var i = 0; i < 10; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        //  You can add to a container like this:

        this.add.image(x, y, 'lemming', null, container);

        //  Or like this (direct to its children component):

        // container.children.add(this.make.image(x, y, 'lemming'));
    }

    this.input.keyboard.on('KEY_DOWN_SPACE', function () {

        container.visible = false;

    });

}
