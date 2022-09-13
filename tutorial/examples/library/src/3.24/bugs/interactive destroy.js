var config = {
    type: Phaser.AUTO,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var image = this.add.image(400, 300, 'block').setInteractive();

    //  Works
    // this.input.on('pointerdown', function () {
    //     image.destroy();
    // }, this);

    //  Works
    // this.input.on('gameobjectdown', function () {
    //     image.destroy();
    // }, this);

    //  Works
    // image.on('pointerdown', function () {
    //     image.destroy();
    // }, this);

    //  Works
    // this.input.on('pointerup', function () {
    //     image.destroy();
    // }, this);

    //  Works
    // this.input.on('gameobjectup', function (pointer) {
    //     console.log(pointer);
    //     console.log(pointer.wasTouch);
    //     image.destroy();
    // }, this);

    //  Works
    // image.on('pointerup', function (pointer) {
    //     console.log(pointer);
    //     console.log(pointer.wasTouch);
    //     image.destroy();
    // }, this);

    var image2 = this.add.image(600, 300, 'block').setInteractive();

    this.input.setDraggable(image);

    this.input.setDraggable(image2);

    image.on('pointerdown', function (pointer) {
        image.destroy();
    }, this);

    image2.on('pointerdown', function (pointer) {
        image2.destroy();
    }, this);


    // this.input.on('dragstart', function (pointer, gameObject) {
    //     gameObject.setTint(0xff0000);
    // });

    // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    //     gameObject.x = dragX;
    //     gameObject.y = dragY;
    // });

    // this.input.on('dragend', function (pointer, gameObject) {
    //     gameObject.clearTint();
    // });


}
