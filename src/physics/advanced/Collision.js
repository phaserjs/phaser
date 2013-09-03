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

var collision = {};

(function() {
	var colFuncs = [];

	function addCollideFunc(a, b, func) {
		colFuncs[a * Shape.NUM_TYPES + b] = func;
	}

	function _circle2Circle(c1, r1, c2, r2, contactArr) {
		var rmax = r1 + r2;
		var t = vec2.sub(c2, c1);
		var distsq = t.lengthsq();

		if (distsq > rmax * rmax) {
			return 0;
		}

		var dist = Math.sqrt(distsq);

		var p = vec2.mad(c1, t, 0.5 + (r1 - r2) * 0.5 / dist);
		var n = (dist != 0) ? vec2.scale(t, 1 / dist) : vec2.zero;
		var d = dist - rmax;

		contactArr.push(new Contact(p, n, d, 0));

		return 1;
	}

	function circle2Circle(circ1, circ2, contactArr) {
		return _circle2Circle(circ1.tc, circ1.r, circ2.tc, circ2.r, contactArr);
	}

	function circle2Segment(circ, seg, contactArr) {
		var rsum = circ.r + seg.r;

		// Normal distance from segment
		var dn = vec2.dot(circ.tc, seg.tn) - vec2.dot(seg.ta, seg.tn);  
		var dist = (dn < 0 ? dn * -1 : dn) - rsum;
		if (dist > 0) {
			return 0;
		}

		// Tangential distance along segment
		var dt = vec2.cross(circ.tc, seg.tn);
		var dtMin = vec2.cross(seg.ta, seg.tn);
		var dtMax = vec2.cross(seg.tb, seg.tn);

		if (dt < dtMin) {
			if (dt < dtMin - rsum) {
				return 0;
			}

			return _circle2Circle(circ.tc, circ.r, seg.ta, seg.r, contactArr);
		} 
		else if (dt > dtMax) {
			if (dt > dtMax + rsum) {
				return 0;
			}

			return _circle2Circle(circ.tc, circ.r, seg.tb, seg.r, contactArr);
		}

		var n = (dn > 0) ? seg.tn : vec2.neg(seg.tn);

		contactArr.push(new Contact(vec2.mad(circ.tc, n, -(circ.r + dist * 0.5)), vec2.neg(n), dist, 0));

		return 1;
	}

	function circle2Poly(circ, poly, contactArr) {
		var minDist = -999999;
		var minIdx = -1;

		for (var i = 0; i < poly.verts.length; i++) {
			var plane = poly.tplanes[i];
			var dist = vec2.dot(circ.tc, plane.n) - plane.d - circ.r;

			if (dist > 0) {
				return 0;
			}
			else if (dist > minDist) {
				minDist = dist;
				minIdx = i;
			}
		}

		var n = poly.tplanes[minIdx].n;
		var a = poly.tverts[minIdx];
		var b = poly.tverts[(minIdx + 1) % poly.verts.length];
		var dta = vec2.cross(a, n);
		var dtb = vec2.cross(b, n);
		var dt = vec2.cross(circ.tc, n);

		if (dt > dta) {
			return _circle2Circle(circ.tc, circ.r, a, 0, contactArr);
		}
		else if (dt < dtb) {
			return _circle2Circle(circ.tc, circ.r, b, 0, contactArr);
		}

		contactArr.push(new Contact(vec2.mad(circ.tc, n, -(circ.r + minDist * 0.5)), vec2.neg(n), minDist, 0));

		return 1;
	}

	function segmentPointDistanceSq(seg, p) {
		var w = vec2.sub(p, seg.ta);
		var d = vec2.sub(seg.tb, seg.ta);

		var proj = w.dot(d);
		if (proj <= 0) {
			return w.dot(w);
		}

		var vsq = d.dot(d)
		if (proj >= vsq) {
			return w.dot(w) - 2 * proj + vsq;
		}

		return w.dot(w) - proj * proj / vsq;
	}

	// FIXME !!
	function segment2Segment(seg1, seg2, contactArr) {
		var d = [];
		d[0] = segmentPointDistanceSq(seg1, seg2.ta);
		d[1] = segmentPointDistanceSq(seg1, seg2.tb);
		d[2] = segmentPointDistanceSq(seg2, seg1.ta);
		d[3] = segmentPointDistanceSq(seg2, seg1.tb);

		var idx1 = d[0] < d[1] ? 0 : 1;
		var idx2 = d[2] < d[3] ? 2 : 3;
		var idxm = d[idx1] < d[idx2] ? idx1 : idx2;
		var s, t;

		var u = vec2.sub(seg1.tb, seg1.ta);
		var v = vec2.sub(seg2.tb, seg2.ta);

		switch (idxm) {
			case 0:
				s = vec2.dot(vec2.sub(seg2.ta, seg1.ta), u) / vec2.dot(u, u);
				s = s < 0 ? 0 : (s > 1 ? 1 : s);
				t = 0;
				break;
			case 1:
				s = vec2.dot(vec2.sub(seg2.tb, seg1.ta), u) / vec2.dot(u, u);
				s = s < 0 ? 0 : (s > 1 ? 1 : s);
				t = 1;
				break;
			case 2:
				s = 0;
				t = vec2.dot(vec2.sub(seg1.ta, seg2.ta), v) / vec2.dot(v, v);
				t = t < 0 ? 0 : (t > 1 ? 1 : t);
				break;
			case 3:
				s = 1;
				t = vec2.dot(vec2.sub(seg1.tb, seg2.ta), v) / vec2.dot(v, v);
				t = t < 0 ? 0 : (t > 1 ? 1 : t);
				break;
		}

		var minp1 = vec2.mad(seg1.ta, u, s);
		var minp2 = vec2.mad(seg2.ta, v, t);

		return _circle2Circle(minp1, seg1.r, minp2, seg2.r, contactArr);
	}

	// Identify vertexes that have penetrated the segment.
	function findPointsBehindSeg(contactArr, seg, poly, dist, coef) {
		var dta = vec2.cross(seg.tn, seg.ta);
		var dtb = vec2.cross(seg.tn, seg.tb);
		var n = vec2.scale(seg.tn, coef);

		for (var i = 0; i < poly.verts.length; i++) {
			var v = poly.tverts[i];
			if (vec2.dot(v, n) < vec2.dot(seg.tn, seg.ta) * coef + seg.r) {
				var dt = vec2.cross(seg.tn, v);
				if (dta >= dt && dt >= dtb) {
					contactArr.push(new Contact(v, n, dist, (poly.id << 16) | i));
				}
			}
		}
	}

	function segment2Poly(seg, poly, contactArr) {
		var seg_td = vec2.dot(seg.tn, seg.ta);
		var seg_d1 = poly.distanceOnPlane(seg.tn, seg_td) - seg.r;
		if (seg_d1 > 0) {
			return 0;
		}
		var seg_d2 = poly.distanceOnPlane(vec2.neg(seg.tn), -seg_td) - seg.r;
		if (seg_d2 > 0) {
			return 0;
		}

		var poly_d = -999999;
		var poly_i = -1;

		for (var i = 0; i < poly.verts.length; i++) {
			var plane = poly.tplanes[i];
			var dist = seg.distanceOnPlane(plane.n, plane.d);
			if (dist > 0) {
				return 0;
			}

			if (dist > poly_d) {
				poly_d = dist;
				poly_i = i;
			}
		}

		var poly_n = vec2.neg(poly.tplanes[poly_i].n);
		var va = vec2.mad(seg.ta, poly_n, seg.r);
		var vb = vec2.mad(seg.tb, poly_n, seg.r);

		if (poly.containPoint(va)) {
			contactArr.push(new Contact(va, poly_n, poly_d, (seg.id << 16) | 0));
		}

		if (poly.containPoint(vb)) {
			contactArr.push(new Contact(vb, poly_n, poly_d, (seg.id << 16) | 1));
		}

		// Floating point precision problems here.
		// This will have to do for now.
		poly_d -= 0.1
		if (seg_d1 >= poly_d || seg_d2 >= poly_d) {
			if (seg_d1 > seg_d2) {
				findPointsBehindSeg(contactArr, seg, poly, seg_d1, 1);
			}
			else {
				findPointsBehindSeg(contactArr, seg, poly, seg_d2, -1);
			}
		}

		// If no other collision points are found, try colliding endpoints.
		if (contactArr.length == 0) {
			var poly_a = poly.tverts[poly_i];
			var poly_b = poly.tverts[(poly_i + 1) % poly.verts.length];

			if (_circle2Circle(seg.ta, seg.r, poly_a, 0, contactArr))
				return 1;
			
			if (_circle2Circle(seg.tb, seg.r, poly_a, 0, contactArr))
				return 1;
			
			if (_circle2Circle(seg.ta, seg.r, poly_b, 0, contactArr))
				return 1;
			
			if (_circle2Circle(seg.tb, seg.r, poly_b, 0, contactArr))
				return 1;
		}

		return contactArr.length;
	}

	// Find the minimum separating axis for the given poly and plane list.
	function findMSA(poly, planes, num)	{
		var min_dist = -999999;
		var min_index = -1;

		for (var i = 0; i < num; i++) {
			var dist = poly.distanceOnPlane(planes[i].n, planes[i].d);
			if (dist > 0) { // no collision
				return { dist: 0, index: -1 };
			} 
			else if (dist > min_dist) {
				min_dist = dist;
				min_index = i;
			}
		}

		return { dist: min_dist, index: min_index };
	}

	function findVertsFallback(contactArr, poly1, poly2, n, dist) {
		var num = 0;

		for (var i = 0; i < poly1.verts.length; i++) {
			var v = poly1.tverts[i];
			if (poly2.containPointPartial(v, n)) {
				contactArr.push(new Contact(v, n, dist, (poly1.id << 16) | i));

				num++;
			}
		}

		for (var i = 0; i < poly2.verts.length; i++) {
			var v = poly2.tverts[i];
			if (poly1.containPointPartial(v, n)) {
				contactArr.push(new Contact(v, n, dist, (poly2.id << 16) | i));

				num++;
			}
		}

		return num;
	}

	// Find the overlapped vertices.
	function findVerts(contactArr, poly1, poly2, n, dist) {
		var num = 0;

		for (var i = 0; i < poly1.verts.length; i++) {
			var v = poly1.tverts[i];
			if (poly2.containPoint(v)) {
				contactArr.push(new Contact(v, n, dist, (poly1.id << 16) | i));

				num++;
			}
		}

		for (var i = 0; i < poly2.verts.length; i++) {
			var v = poly2.tverts[i];
			if (poly1.containPoint(v)) {
				contactArr.push(new Contact(v, n, dist, (poly2.id << 16) | i));

				num++;
			}
		}

		return num > 0 ? num : findVertsFallback(contactArr, poly1, poly2, n, dist);
	}

	function poly2Poly(poly1, poly2, contactArr) {
		var msa1 = findMSA(poly2, poly1.tplanes, poly1.verts.length);
		if (msa1.index == -1) {
			return 0;
		}

		var msa2 = findMSA(poly1, poly2.tplanes, poly2.verts.length);
		if (msa2.index == -1) {
			return 0;
		}

		// Penetration normal direction shoud be from poly1 to poly2
		if (msa1.dist > msa2.dist) {
			return findVerts(contactArr, poly1, poly2, poly1.tplanes[msa1.index].n, msa1.dist);
		}

		return findVerts(contactArr, poly1, poly2, vec2.neg(poly2.tplanes[msa2.index].n), msa2.dist);
	}
	
	collision.init = function() {
		addCollideFunc(Shape.TYPE_CIRCLE, Shape.TYPE_CIRCLE, circle2Circle);
		addCollideFunc(Shape.TYPE_CIRCLE, Shape.TYPE_SEGMENT, circle2Segment);
		addCollideFunc(Shape.TYPE_CIRCLE, Shape.TYPE_POLY, circle2Poly);
		addCollideFunc(Shape.TYPE_SEGMENT, Shape.TYPE_SEGMENT, segment2Segment);
		addCollideFunc(Shape.TYPE_SEGMENT, Shape.TYPE_POLY, segment2Poly);
		addCollideFunc(Shape.TYPE_POLY, Shape.TYPE_POLY, poly2Poly);
	};

	collision.collide = function(a, b, contactArr) {
		if (a.type > b.type) {
			var c = a;
			a = b;
			b = c;
		}

		return colFuncs[a.type * Shape.NUM_TYPES + b.type](a, b, contactArr);
	};
})();
