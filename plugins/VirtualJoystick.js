/**
* A Virtual Joystick
*/
Phaser.Plugin.VirtualJoystick = function (game, parent) {

	Phaser.Plugin.call(this, game, parent);

	this.x = 0;
	this.y = 0;
	this.limit = 10;

	this.baseCircle;

	this.baseBMD;
	this.nubBMD;

	this.base;
	this.nub;

	this.baseCenter;
	this.nubCenter;

	this.isDragging = false;
	this.distance = 0;
	
};

//	Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.VirtualJoystick.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.VirtualJoystick.prototype.constructor = Phaser.Plugin.VirtualJoystick;

Phaser.Plugin.VirtualJoystick.prototype.init = function (x, y, diameter) {

	if (typeof diameter === 'undefined') { diameter = 80; }

	this.x = x;
	this.y = y;

	var radius = Math.floor(diameter / 2);

	this.testCircle = new Phaser.Circle(200, 200, diameter);
	this.testPoint = new Phaser.Point();

	this.baseCircle = new Phaser.Circle(x, y, diameter);

	this.baseBMD = this.game.make.bitmapData(diameter, diameter);
	this.nubBMD = this.game.make.bitmapData(diameter - 4, diameter - 4);

	this.baseBMD.circle(radius, radius, radius, 'rgb(255, 0, 0)');
	this.nubBMD.circle(radius, radius, (radius) - 4, 'rgb(0, 255, 0)');

	//	Base
	this.base = this.game.add.sprite(x, y, this.baseBMD);
	this.base.anchor.set(0.5);

	//	Nub
	this.nub = this.game.add.sprite(x, y, this.nubBMD);
	this.nub.anchor.set(0.5);

	this.nub.inputEnabled = true;

	this.nub.events.onInputDown.add(this.startDrag, this);
	this.nub.events.onInputUp.add(this.stopDrag, this);

	this.game.input.setMoveCallback(this.move, this);

	this.isDragging = false;
	this.distance = 0;
	this.limit = radius;
	this.limitPoint = new Phaser.Point();

	this.m = new Phaser.Point();


	this.prev = new Phaser.Point(x, y);

}

Phaser.Plugin.VirtualJoystick.prototype.startDrag = function () {

	this.isDragging = true;
	this.distance = 0;
	this.angle = 0;

};

Phaser.Plugin.VirtualJoystick.prototype.stopDrag = function () {

	this.isDragging = false;
	this.distance = 0;
	this.angle = 0;
	this.nub.x = this.base.x;
	this.nub.y = this.base.y;
	this.prev.set(this.base.x, this.base.y);

};

Phaser.Plugin.VirtualJoystick.prototype.move = function (pointer, x, y) {

	if (!this.isDragging)
	{
		return;
	}

	this.m.set(x, y);

	this.distance = Phaser.Point.distance(this.base, this.m, true);

	this.angle = Phaser.Point.angle(this.base, this.m) * 180 / Math.PI;
	this.angle = this.game.math.wrapAngle(this.angle + 180, false);

	Phaser.Circle.circumferencePoint(this.testCircle, this.angle, true, this.testPoint);
	Phaser.Circle.circumferencePoint(this.baseCircle, this.angle, true, this.limitPoint);

	//	If the pointer is outside the baseCircle then we don't need to set the sprite like this

	if (this.baseCircle.contains(x, y))
	{
		this.nub.x = x;
		this.nub.y = y;
	}
	else
	{
		// this.nub.position.set(this.limitPoint.x, this.limitPoint.y);
		this.nub.x = this.limitPoint.x;
		this.nub.y = this.limitPoint.y;
	}

	// if (this.distance < this.limit)
	// {
	// }
	// else
	// {
		// this.nub.x = this.limitPoint.x;
		// this.nub.y = this.limitPoint.y;
	// }

};

Phaser.Plugin.VirtualJoystick.prototype.update = function () {

};

Phaser.Plugin.VirtualJoystick.prototype.render = function () {

	this.game.debug.text(this.distance, 32, 32);
	this.game.debug.text(this.angle, 132, 32);

	this.game.debug.text('x: ' + this.m.x + ' y: ' + this.m.y, 32, 64);
	// this.game.debug.text('x: ' + this.limitPoint.x + ' y: ' + this.limitPoint.y, 32, 64);
	// this.game.debug.text('x: ' + this.prev.x + ' y: ' + this.prev.y, 32, 64);
	// this.game.debug.text(Phaser.Point.distance(this.base, this.prev, true), 32, 96);

	this.game.debug.geom(this.testCircle);
	this.game.debug.geom(this.testPoint, 'rgb(255,0,0)');

};
