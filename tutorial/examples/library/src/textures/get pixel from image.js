var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('wheel', 'assets/pics/color-wheel.png');
}

function create ()
{
    //  white
    var color = this.textures.getPixel(0, 0, 'wheel');

    console.log(color);

    //  140x170 = #f7901e - rgb(247, 144, 30)
    color = this.textures.getPixel(140, 170, 'wheel');

    console.log(color);

    //  412x300 = #43bed8 rgb(67, 190, 216)
    color = this.textures.getPixel(412, 300, 'wheel');

    console.log(color);

    //  100x420 = #b21e3b rgb(178, 30, 59)
    color = this.textures.getPixel(100, 420, 'wheel');

    console.log(color);

    //  520x260 = #0e9553 rgb(14, 149, 83)
    color = this.textures.getPixel(520, 260, 'wheel');

    console.log(color);
}
