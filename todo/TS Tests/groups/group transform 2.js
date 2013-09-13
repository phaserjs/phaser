/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var robot;
    var eye, body, leftArm, rightArm, leftLeg, rightLeg;
    var draggable;

    function init() {
        game.load.image('eye', 'assets/sprites/robot/eye.png');
        game.load.image('body', 'assets/sprites/robot/body.png');
        game.load.image('arm-l', 'assets/sprites/robot/arm-l.png');
        game.load.image('arm-r', 'assets/sprites/robot/arm-r.png');
        game.load.image('leg-l', 'assets/sprites/robot/leg-l.png');
        game.load.image('leg-r', 'assets/sprites/robot/leg-r.png');

        game.load.start();
    }
    function create() {
        // Add some items.
        var item;
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            item = game.add.sprite(290, 98 * (i + 1), 'item', i);
            // An item besides the left one.
            item = game.add.sprite(388, 98 * (i + 1), 'item', i + 3);
        }
        // Use groups of sprites to create a big robot.
        // Robot itself, you can subclass group class in a real game.
        robot = game.add.group();
        // Robot components.
        leftArm = robot.addNewSprite(90, 175, 'arm-l', 0, Phaser.Types.BODY_DISABLED);
        rightArm = robot.addNewSprite(549, 175, 'arm-r', 0, Phaser.Types.BODY_DISABLED);
        leftLeg = robot.addNewSprite(270, 325, 'leg-l', 0, Phaser.Types.BODY_DISABLED);
        rightLeg = robot.addNewSprite(410, 325, 'leg-r', 0, Phaser.Types.BODY_DISABLED);
        body = robot.addNewSprite(219, 32, 'body', 0, Phaser.Types.BODY_DISABLED);
        eye = robot.addNewSprite(335, 173,'eye', 0, Phaser.Types.BODY_DISABLED);
    }
    function update() {
        // Change parent's rotation to change all the childs.
        // robot.transform.rotation += 2;
        game.world.group.transform.rotation += 2;
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = 'rgb(0, 160, 213)';
        Phaser.DebugUtils.context.fillText('The robot is a group and every component is a sprite.', 240, 580);
    }
})();
