var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics({
        lineStyle: {
            width: 1,
            color: 0xff0000,
            alpha: 1
        },
        fillStyle: {
            color: 0xff0000,
            alpha: 1
        },
    });

    var rect1 = this.add.rectangle(400, 200, 1, 1, 0x555555);
    var rect2 = this.add.rectangle(400, 300, 2, 2, 0x555555);
    var rect3 = this.add.rectangle(400, 400, 60, 30, 0x555555);

    rect1.displayWidth = 60;
    rect1.displayHeight = 30;

    rect2.displayWidth = 60;
    rect2.displayHeight = 30;

    console.log('do', rect1._displayOriginX, rect1._displayOriginY, 'wh', rect1.width, rect1.height, 'scale', rect1.scaleX, rect1.scaleY);
    console.log('do', rect2._displayOriginX, rect2._displayOriginY, 'wh', rect2.width, rect2.height, 'scale', rect2.scaleX, rect2.scaleY);
    console.log('do', rect3._displayOriginX, rect3._displayOriginY, 'wh', rect3.width, rect3.height, 'scale', rect3.scaleX, rect3.scaleY);

    graphics.strokeRectShape(rect1.getBounds());
    graphics.strokeRectShape(rect2.getBounds());
    graphics.strokeRectShape(rect3.getBounds());
}
