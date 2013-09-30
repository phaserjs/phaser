 
 <?php
    $title = "Rotating an entire group";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,update : update,render:render});

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

    }
    function update() {
        // Change parent's rotation to change all the childs.
        robot.angle+=2;

    }


    function render() {
        
        game.debug.renderText('The robot is a group and every component is a sprite.', 240, 580);
    }

})();

</script>

<?php
    require('../foot.php');
?>
