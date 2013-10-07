 
 <?php
    $title = "Grouping and dragging";
    require('../head.php');
?>

<script type="text/javascript">



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
        
    }
    function create() {

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


    function render() {

        game.debug.renderSpriteInfo(leftArm, 32, 30);
        game.debug.renderSpriteInfo(rightArm, 32, 180);
        game.debug.renderSpriteInfo(leftLeg, 32, 325);
        game.debug.renderSpriteInfo(rightLeg, 32, 470);
        game.debug.renderSpriteInfo(rightLeg, 450, 30);
        game.debug.renderSpriteInfo(rightLeg, 450, 180);

        game.debug.renderText('The robot is a group and every component is a sprite.', 240, 580);
        game.debug.renderText('Drag each part to re-position them. ', 288, 592);
    }



</script>

<?php
    require('../foot.php');
?>
