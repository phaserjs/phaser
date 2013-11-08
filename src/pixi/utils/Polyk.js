/*
	PolyK library
	url: http://polyk.ivank.net
	Released under MIT licence.

	Copyright (c) 2012 Ivan Kuckir

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

	This is an amazing lib!

	slightly modified by mat groves (matgroves.com);
*/

PIXI.PolyK = {};

/**
 * Triangulates shapes for webGL graphic fills
 *
 * @method Triangulate
 * @namespace PolyK
 * @constructor
 */
PIXI.PolyK.Triangulate = function(p)
{
	var sign = true;

	var n = p.length>>1;
	if(n<3) return [];
	var tgs = [];
	var avl = [];
	for(var i=0; i<n; i++) avl.push(i);

	var i = 0;
	var al = n;
	while(al > 3)
	{
		var i0 = avl[(i+0)%al];
		var i1 = avl[(i+1)%al];
		var i2 = avl[(i+2)%al];

		var ax = p[2*i0],  ay = p[2*i0+1];
		var bx = p[2*i1],  by = p[2*i1+1];
		var cx = p[2*i2],  cy = p[2*i2+1];

		var earFound = false;
		if(PIXI.PolyK._convex(ax, ay, bx, by, cx, cy, sign))
		{
			earFound = true;
			for(var j=0; j<al; j++)
			{
				var vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(PIXI.PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i = 0;
		}
		else if(i++ > 3*al)
		{
			// need to flip flip reverse it!
			// reset!
			if(sign)
			{
				var tgs = [];
				avl = [];
				for(var i=0; i<n; i++) avl.push(i);

				i = 0;
				al = n;

				sign = false;
			}
			else
			{
				console.log("PIXI Warning: shape too complex to fill")
				return [];
			}
		}
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
}

/**
 * Checks if a point is within a triangle
 *
 * @class _PointInTriangle
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
	var v0x = cx-ax;
	var v0y = cy-ay;
	var v1x = bx-ax;
	var v1y = by-ay;
	var v2x = px-ax;
	var v2y = py-ay;

	var dot00 = v0x*v0x+v0y*v0y;
	var dot01 = v0x*v1x+v0y*v1y;
	var dot02 = v0x*v2x+v0y*v2y;
	var dot11 = v1x*v1x+v1y*v1y;
	var dot12 = v1x*v2x+v1y*v2y;

	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	// Check if point is in triangle
	return (u >= 0) && (v >= 0) && (u + v < 1);
}

/**
 * Checks if a shape is convex
 *
 * @class _convex
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._convex = function(ax, ay, bx, by, cx, cy, sign)
{
	return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) == sign;
}
