 
 <?php
    $title = "Tweening an entire group";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render});

    var robot;
    var eye,
        body,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg;

    

    function preload() {

        game.load.image('eye', 'assets/sprites/robot/eye.png');
        game.load.image('body', 'assets/sprites/robot/body.png');
        game.load.image('arm-l', 'assets/sprites/robot/arm-l.png');
        game.load.image('arm-r', 'assets/sprites/robot/arm-r.png');
        game.load.image('leg-l', 'assets/sprites/robot/leg-l.png');
        game.load.image('leg-r', 'assets/sprites/robot/leg-r.png');
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        
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
        leftArm = robot.create(90, 175, 'arm-l');
        rightArm = robot.create(549, 175, 'arm-r');
        leftLeg = robot.create(270, 325, 'leg-l');
        rightLeg = robot.create(410, 325, 'leg-r');
        body = robot.create(219, 32, 'body');
        eye = robot.create(335, 173,'eye');

        // Tween the robot's size, so all the components also scaled.
         game.add.tween(robot._container.scale)
            .to({x: 1.2, y: 1.2}, 1000, Phaser.Easing.Back.InOut, true, 0, false)
            .yoyo(true);
    }


    function render() {

        game.debug.renderText('The robot is a group and every component is a sprite.', 240, 580);
    }

})();

</script>

<?php
    require('../foot.php');
?>
