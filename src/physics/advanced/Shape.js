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

Shape = function(type) {
	if (arguments.length == 0)
		return;

	if (Shape.id_counter == undefined)
		Shape.id_counter = 0;
	
	this.id = Shape.id_counter++;
	this.type = type;

	// Coefficient of restitution (elasticity)
	this.e = 0.0;

	// Frictional coefficient
	this.u = 1.0;

	// Mass density
	this.density = 1;

	// Axis-aligned bounding box
	this.bounds = new Bounds;    
}

Shape.TYPE_CIRCLE = 0;
Shape.TYPE_SEGMENT = 1;
Shape.TYPE_POLY = 2;
Shape.NUM_TYPES = 3;

