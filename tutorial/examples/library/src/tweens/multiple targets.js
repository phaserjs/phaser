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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var image1 = this.add.image(50, 100, 'block');
    var image2 = this.add.image(60, 200, 'block');
    var image3 = this.add.image(70, 300, 'block');

    var tween = this.tweens.add({
        targets: [ image1, image2, image3 ],
        x: '+=600',
        y: '+=200',
        duration: 4000,
        ease: 'Power3'
    });

    console.log(tween);
}
