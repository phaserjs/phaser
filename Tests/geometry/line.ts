/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update);

    var line: Phaser.GeomSprite;

    function create() {

        line = myGame.createGeomSprite(200, 200);

        line.createLine(400, 400);

    }

    function update() {

        //box.velocity.x = 0;
        //box.velocity.y = 0;
		//box.angularVelocity = 0;
		//box.angularAcceleration = 0;

        //if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        //{
        //    box.angularVelocity = -200;
        //}
        //else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        //{
        //    box.angularVelocity = 200;
        //}

        //if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        //{
        //    box.velocity.copyFrom(myGame.motion.velocityFromAngle(box.angle, 200));
        //}

    }

})();
