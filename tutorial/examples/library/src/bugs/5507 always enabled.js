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

function create()
{
    //  Test 1

    /*
    var invisibleRect = this.add.rectangle(400, 300, 300, 300, 0x00ff00);
    var rect = this.add.rectangle(400, 300, 256, 256, 0x0000ff);
    var text = this.add.text(128, 128, "0").setFontSize(28);
    var count = 0;

    invisibleRect.name = 'invis';
    invisibleRect.setInteractive();
    invisibleRect.input.alwaysEnabled = true;

    invisibleRect.on('pointerdown', function () {
        count++;
        text.text = count.toString();
    });

    rect.name = 'rect';
    rect.setInteractive();

    invisibleRect.alpha = 0;

    // invisibleRect.setDepth(0);
    rect.setDepth(-1);
    */

    //  Test 2
    var invisibleRect = this.add.rectangle(400, 300, 300, 300, 0x00ff00);
    var rect = this.add.rectangle(400, 300, 256, 256, 0x0000ff).setAlpha(0.5);
    var rect2 = this.add.rectangle(350, 300, 256, 256, 0xff0000).setAlpha(0.5);
    var text = this.add.text(128, 128, "0").setFontSize(28);
    var count = 0;

    invisibleRect.name = 'invis';
    invisibleRect.setInteractive();
    invisibleRect.input.alwaysEnabled = true;

    invisibleRect.on('pointerdown', function () {
        count++;
        text.text = count.toString();
    });

    rect.name = 'rect';
    rect.setInteractive();

    rect2.name = "rect2"
    rect2.setInteractive();

    invisibleRect.alpha = 0;
    //invisibleRect.alpha = 0.3;

    invisibleRect.setDepth(3);
    rect.setDepth(2);
    rect2.setDepth(1);
}
