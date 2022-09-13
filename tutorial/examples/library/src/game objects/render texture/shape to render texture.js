var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var rt = this.add.renderTexture(0, 0, 800, 600);

    var circle = this.add.circle(200, 200, 80, 0x6666ff);

    // var rect = this.add.rectangle(0, 0, 100, 100, 0xff0000);

    rt.draw(circle, 300, 300);
}
