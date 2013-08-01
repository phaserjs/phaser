/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var robot: Phaser.Group;
    var eye: Phaser.Sprite,
        body: Phaser.Sprite,
        leftArm: Phaser.Sprite,
        rightArm: Phaser.Sprite,
        leftLeg: Phaser.Sprite,
        rightLeg: Phaser.Sprite;

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
        var item: Phaser.Sprite;
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

        leftArm.input.start(0, false, true);
        leftArm.input.enableDrag();
        rightArm.input.start(0, false, true);
        rightArm.input.enableDrag();
        leftLeg.input.start(0, false, true);
        leftLeg.input.enableDrag();
        rightLeg.input.start(0, false, true);
        rightLeg.input.enableDrag();
        body.input.start(0, false, true);
        body.input.enableDrag();
        eye.input.start(0, false, true);
        eye.input.enableDrag();
    }
    function update() {
    }
    function render() {
        Phaser.DebugUtils.renderSpriteInfo(leftArm, 32, 32);
        Phaser.DebugUtils.renderSpriteInfo(rightArm, 32, 152);
        Phaser.DebugUtils.renderSpriteInfo(leftLeg, 32, 272);
        Phaser.DebugUtils.renderSpriteInfo(rightLeg, 32, 392);
        Phaser.DebugUtils.renderSpriteInfo(rightLeg, 450, 32);
        Phaser.DebugUtils.renderSpriteInfo(rightLeg, 450, 152);

        Phaser.DebugUtils.context.fillStyle = 'rgb(0, 160, 213)';
        Phaser.DebugUtils.context.fillText('The robot is a group and every component is a sprite.', 240, 580);
        // Phaser.DebugUtils.context.fillText('Drag each part to re-position them.', 288, 592);
        Phaser.DebugUtils.context.fillText('Drag each part to re-position them. ', 288, 592);
    }
})();
