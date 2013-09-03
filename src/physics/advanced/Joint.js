/*
* Copyright (c) 2012 Ju Hyung Lee
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
* and associated documentation files (the "Software"), to deal in the Software without 
* restriction, including without limitation the rights to use, copy, modify, merge, publish, 
* distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
* BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Joint = function(type, body1, body2, collideConnected) {
	if (arguments.length == 0)
		return;

    if (Joint.id_counter == undefined)
        Joint.id_counter = 0;
    
    this.id = Joint.id_counter++;
    this.type = type;

	this.body1 = body1;
	this.body2 = body2;

	// Allow collision between to cennected body
	this.collideConnected = collideConnected;

	// Constraint force limit
	this.maxForce = 9999999999;

	// Is breakable ?
	this.breakable = false;
}

Joint.TYPE_ANGLE = 0;
Joint.TYPE_REVOLUTE = 1;
Joint.TYPE_WELD = 2;
Joint.TYPE_WHEEL = 3;
Joint.TYPE_PRISMATIC = 4;
Joint.TYPE_DISTANCE = 5;
Joint.TYPE_ROPE = 6;
Joint.TYPE_MOUSE = 7;

Joint.LINEAR_SLOP = 0.0008;
Joint.ANGULAR_SLOP = deg2rad(2);
Joint.MAX_LINEAR_CORRECTION = 0.5;
Joint.MAX_ANGULAR_CORRECTION = deg2rad(8);

Joint.LIMIT_STATE_INACTIVE = 0;
Joint.LIMIT_STATE_AT_LOWER = 1;
Joint.LIMIT_STATE_AT_UPPER = 2;
Joint.LIMIT_STATE_EQUAL_LIMITS = 3;

Joint.prototype.getWorldAnchor1 = function() {
	return this.body1.getWorldPoint(this.anchor1);
}

Joint.prototype.getWorldAnchor2 = function() {
	return this.body2.getWorldPoint(this.anchor2);	
}

Joint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = this.body1.getLocalPoint(anchor1);	
}

Joint.prototype.setWorldAnchor2 = function(anchor2) {
	this.anchor2 = this.body2.getLocalPoint(anchor2);
}