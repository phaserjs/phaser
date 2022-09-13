var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var container = this.add.container(0, 0);

    var sprite = this.add.image(200, 200, 'eye').setInteractive();

    sprite.setScale(-1, 1);
    sprite.setOrigin(0);
    
    container.add(sprite);

    sprite.on('pointerover', function () {
        console.log('over');
        this.setTint(0xff0000);
   });

    sprite.on('pointerout', function () {
        console.log('out');
        this.clearTint();
   });
}
