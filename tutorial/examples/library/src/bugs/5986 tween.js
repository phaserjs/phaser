var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);
var tween = null;
var tweenAlive = false;

function create ()
{
    var box = this.add.rectangle(100, 100, 100, 100, 0xff0000);
    var reference = this.add.rectangle(100, 210, 100, 100, 0xff0000);
    var boxWidthText = this.add.text(200, 100, "BOX SCALE X: " + box.scaleX);

    this.input.on(Phaser.Input.Events.POINTER_DOWN, function () {
        if (tween) {
            tween.stop(0);
            tween = null;
            boxWidthText.setText("BOX SCALE X: " + box.scaleX);

        } else {
            tween = this.tweens.add({
                targets: box,
                scaleX: 0.25,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        }

    }, this);

    this.add.text(20, 20, 'Click to start/stop scale tween');
}
