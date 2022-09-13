var config = {
    type: Phaser.WEBGL,
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
    var zone = this.add.zone(100, 100, 32, 32).setDropZone();

    //  Just a visual display of the drop zone
    var graphics = this.add.graphics();

    var color = 0xffff00;

    graphics.lineStyle(2, color);
    graphics.strokeRect(zone.x + zone.input.hitArea.x, zone.y + zone.input.hitArea.y, zone.input.hitArea.width, zone.input.hitArea.height);

    this.input.setPollAlways();

    // this.input.on('dragenter', function (pointer, gameObject, dropZone) {
    this.input.on('gameobjectover', function (pointer, gameObject, dropZone) {

        color = 0x00ffff;

    });

    // this.input.on('dragleave', function (pointer, gameObject, dropZone) {
    this.input.on('gameobjectout', function (pointer, gameObject, dropZone) {

        color = 0xffff00;

    });

    this.tweens.add({
        targets: zone,
        width: 400,
        height: 200,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        onUpdate: function ()
        {
            zone.setSize(zone.width, zone.height, true);
            graphics.clear();
            graphics.lineStyle(2, color);
            graphics.strokeRect(zone.x + zone.input.hitArea.x, zone.y + zone.input.hitArea.y, zone.input.hitArea.width, zone.input.hitArea.height);
        }

    });
}
