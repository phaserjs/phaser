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
    this.load.image('buttonBG', 'assets/sprites/button-bg.png');
}

function create ()
{
    //  Normal image
    this.add.image(200, 150, 'buttonBG').setAngle(20);

    //  Single level container
    var containerImage = this.add.image(0, 0, 'buttonBG').setAngle(20);
    var container = this.add.container(600, 150, containerImage).setAngle(20);

    //  2 level container
    var containerImage2 = this.add.image(0, 0, 'buttonBG').setAngle(20);
    var container2a = this.add.container(0, 0, containerImage2).setAngle(20);
    var container2b = this.add.container(200, 450, container2a).setAngle(20);

    //  3 level container
    var containerImage3 = this.add.image(0, 0, 'buttonBG').setAngle(20);
    var container3a = this.add.container(0, 0, containerImage3).setAngle(20);
    var container3b = this.add.container(0, 0, container3a).setAngle(20);
    var container3c = this.add.container(600, 450, container3b).setAngle(20);
}
