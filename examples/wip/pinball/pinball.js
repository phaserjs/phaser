(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.PinballPhysics = (function(_super) {
    __extends(PinballPhysics, _super);

    function PinballPhysics(game) {
      PinballPhysics.__super__.constructor.call(this, game);
      this.physicsWorld = this.game.physics.world;
      this.build();
      this.registerKeys();
    }

    PinballPhysics.prototype.build = function() {
      this.groundBody = new p2.Body();
      this.physicsWorld.addBody(this.groundBody);
      this.table = this.createTable();
      this.flipperLeft = this.createFlipperLeft();
      this.flipperRight = this.createFlipperRight();
      return this.ball = this.createBall();
    };

    PinballPhysics.prototype.registerKeys = function() {
      this.key_left = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
      return this.key_right = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    };

    PinballPhysics.prototype.update = function() {
      if (this.key_left.isDown) {
        this.flipperLeftRevolute.lowerLimit = 35 * Math.PI / 180;
        this.flipperLeftRevolute.upperLimit = 35 * Math.PI / 180;
      } else {
        this.flipperLeftRevolute.lowerLimit = 0 * Math.PI / 180;
        this.flipperLeftRevolute.upperLimit = 0 * Math.PI / 180;
      }
      if (this.key_right.isDown) {
        this.flipperRightRevolute.lowerLimit = -35 * Math.PI / 180;
        return this.flipperRightRevolute.upperLimit = -35 * Math.PI / 180;
      } else {
        this.flipperRightRevolute.lowerLimit = 0 * Math.PI / 180;
        return this.flipperRightRevolute.upperLimit = 0 * Math.PI / 180;
      }
    };

    PinballPhysics.prototype.createFlipperRevolute = function(sprite, pivotA, pivotB, motorSpeed) {
      var revolute;
      revolute = new p2.RevoluteConstraint(sprite.body.data, pivotA, this.groundBody, pivotB);
      revolute.upperLimitEnabled = true;
      revolute.lowerLimitEnabled = true;
      revolute.enableMotor();
      revolute.setMotorSpeed(motorSpeed);
      this.physicsWorld.addConstraint(revolute);
      return revolute;
    };

    PinballPhysics.prototype.createTable = function() {
      var table;
      table = this.create(this.game.world.width / 2, this.game.world.height / 2, 'table');
      table.physicsEnabled = true;
      table.body.clearShapes();
      table.body.loadPolygon('pinball', 'table');
      table.body.collideWorldBounds = false;
      table.body["static"] = true;
      return table;
    };

    PinballPhysics.prototype.createBall = function() {
      var ball;
      ball = this.create(250, 500, 'ball');
      ball.physicsEnabled = true;
      ball.body.setCircle(20);
      return ball;
    };

    PinballPhysics.prototype.createFlipperLeft = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperLeft');
      flipper.physicsEnabled = true;
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_left');
      pivotA = [this.game.math.px2p(flipper.width / 2 - 30), this.game.math.px2p(10)];
      pivotB = [this.game.math.px2pi(200), this.game.math.px2pi(900)];
      this.flipperLeftRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, -20);
      return flipper;
    };

    PinballPhysics.prototype.createFlipperRight = function() {
      var flipper, pivotA, pivotB;
      flipper = this.create(0, 0, 'flipperRight');
      flipper.physicsEnabled = true;
      flipper.body.clearShapes();
      flipper.body.loadPolygon('pinball', 'flipper_right');
      pivotA = [-this.game.math.px2p(flipper.width / 2 - 30), this.game.math.px2p(10)];
      pivotB = [this.game.math.px2pi(500), this.game.math.px2pi(900)];
      this.flipperRightRevolute = this.createFlipperRevolute(flipper, pivotA, pivotB, 20);
      return flipper;
    };

    return PinballPhysics;

  })(Phaser.Group);

}).call(this);
