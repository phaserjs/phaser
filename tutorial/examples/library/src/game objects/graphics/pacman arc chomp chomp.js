var config = {
    width: 800,
    height: 600,
    backgroundColor: '#010166',
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    this.tweens.addCounter({
        from: 0,
        to: 30,
        duration: 200,
        yoyo: true,
        repeat: -1,
        onUpdate: function (tween)
        {
            var t = tween.getValue();

            graphics.clear();
            graphics.fillStyle(0xffff00, 1);
            graphics.slice(260, 300, 200, Phaser.Math.DegToRad(330 + t), Phaser.Math.DegToRad(30 - t), true);
            graphics.fillPath();

            graphics.fillStyle(0x000000, 1);
            graphics.fillEllipse(260, 180, 30, 90);

            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(580, 300, 30);
            graphics.fillCircle(740, 300, 30);
        }
    });

}
