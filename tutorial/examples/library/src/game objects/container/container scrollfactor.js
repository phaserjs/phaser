var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{

    var container0 = this.add.container(0, 0);
    var container1 = this.add.container(0, 0);
    var container2 = this.add.container(0, 0);
    var container3 = this.add.container(0, 0);

    var image0 = this.add.image(0, 0, 'lemming');
    var image1 = this.add.image(-100, -100, 'lemming');
    var image2 = this.add.image(100, -100, 'lemming');
    var image3 = this.add.image(100, 100, 'lemming');
    var image4 = this.add.image(-100, 100, 'lemming');

    for (var index = 0; index < 10; index++)
    {
        container0.add(this.add.image(Math.random() * 800, Math.random() * 600, 'lemming'));
        container1.add(this.add.image(Math.random() * 800, Math.random() * 600, 'lemming'));
        container2.add(this.add.image(Math.random() * 800, Math.random() * 600, 'lemming'));
        container3.add(this.add.image(Math.random() * 800, Math.random() * 600, 'lemming'));
    }

    container3.setScrollFactor(1.00);
    container2.setScrollFactor(0.75);
    container1.setScrollFactor(0.50);
    container0.setScrollFactor(0.25);

    this.time = 0.0;

}

function update()
{
    this.cameras.main.scrollX = Math.cos(this.time) * 100;
    this.cameras.main.scrollY = Math.sin(this.time) * 100;
    this.time += 0.01;
}
