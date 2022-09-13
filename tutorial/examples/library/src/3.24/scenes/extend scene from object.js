var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        extend: {
            hello: 1,
            test: 'atari',
            addImage: addImage
        }
    }
};

var game = new Phaser.Game(config);

function addImage (x, y)
{
    this.add.image(x, y, 'mech');
}

function preload ()
{
    this.load.image('mech', 'assets/pics/titan-mech.png');
}

function create ()
{
    //  We are able to use 'this.addImage' because we have defined 'addImage' as a local
    //  method in the scene.extend configuration.

    this.addImage(300, 200);
    this.addImage(600, 500);
    this.addImage(100, 400);

    //  We have also added the properties 'hello' and 'test' as Scene level properties,
    //  defined in the scene.extend configuration, meaning we can access them like this:

    console.log(this.hello);
    console.log(this.test);
}
