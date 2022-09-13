var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('face', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
}

function create ()
{
    var image = this.add.image(400, 300, 'face');

    this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 5000,
        onUpdate: function (tween)
        {
            var value = Math.floor(tween.getValue());

            image.setTint(Phaser.Display.Color.GetColor(value, value, value));
        }
    });
}
