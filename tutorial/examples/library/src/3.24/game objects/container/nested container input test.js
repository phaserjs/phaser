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
    var container1 = this.add.container(100, 100);
    var container2 = this.add.container(200, 200);

    var sprite = this.add.image(0, 0, 'eye').setInteractive();
    
    container1.add(container2);
    container2.add(sprite);

    // container1.setVisible(false);

    sprite.on('pointerover', function () {
        console.log('over');
        this.setTint(0xff0000);
   });

    sprite.on('pointerout', function () {
        console.log('out');
        this.clearTint();
   });
}
