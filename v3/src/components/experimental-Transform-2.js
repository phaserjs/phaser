// this must be called only once on the root of the tree. Never on children
var flattenTree = function (children, flatRenderArray, flatChildrenArray, childCount, renderCount)
{
	for (var index = 0, length = children.length; index < length; ++index)
	{
		var child = children[index];
		// we need a rendering list since we avoid iterating over
		// repeating children used as tags for the applying transformations.
		flatRenderArray[renderCount++] = child; 
		flatChildrenArray[childCount++] = child;
		if (children[index].children.length > 0)
		{
			var counts = flattenTree(children[index].children, flatRenderArray, flatChildrenArray, childCount, renderCount);
			childCount = counts[0];
			renderCount = counts[1];
			flatChildrenArray[childCount++] = children[index]; // add ending tag
		}
	}
	return [childCount, renderCount];
};

var TransformMatrix = function ()
{
	this.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
};
TransformMatrix.prototype.loadIdentity = function ()
{
	var matrix = this.matrix;
	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 1;
	matrix[4] = 0;
	matrix[5] = 0;
	return this;
};
TransformMatrix.prototype.translate = function (x, y)
{
    var matrix = this.matrix;
    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
    return this;
};
TransformMatrix.prototype.scale = function (x, y) 
{
    var matrix = this.matrix;
    matrix[0] = matrix[0] * x;
    matrix[1] = matrix[1] * x;
    matrix[2] = matrix[2] * y;
    matrix[3] = matrix[3] * y;
    return this;
};
TransformMatrix.prototype.rotate = function (radian)
{
    var matrix = this.matrix;
    var a = matrix[0];
    var b = matrix[1];
    var c = matrix[2];
    var d = matrix[3];
    var tcos = Math.cos(radian);
    var tsin = Math.sin(radian);

    matrix[0] = a * tcos + c * tsin;
    matrix[1] = b * tcos + d * tsin;
    matrix[2] = a * -tsin + c * tcos;
    matrix[3] = b * -tsin + d * tcos;
    return this;
};
var Transform = function (gameObject, root)
{
	this.positionX = 0;
	this.positionY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;
	this.localMatrix = new TransformMatrix();
	this.worldMatrix = new TransformMatrix();
	// Never iterate this list internally.
	// Only for user
	this.children = [];
	this.hasChildren = false;
	this.parent = this;
	// Only valid if you are the root.
	// This probably needs to be on State and not here.
	this.flatChildrenArray = [];
	this.flatRenderArray = [];
	this.transformStack = [];
	this.childStack = [];
	this.childCount = 0;
	this.renderCount = 0;
	this.dirty = false;
	this.dirtyLocal = true;
	this.root = root || this;
    this.gameObject = gameObject;
}
Transform.prototype.add = function (transform)
{
	this.root.dirty = true;
	this.hasChildren = true;
	transform.root = this.root;
	transform.parent.remove(transform);
	transform.parent = this;
	this.children.push(transform);
};
Transform.prototype.remove = function (transform)
{
	var children = this.children;
	var index = children.indexOf(transform);
	if (index >= 0)
	{
		children.splice(index, 1);
		this.hasChildren = (children.length > 0);
		this.root.dirty = true;
		transform.parent = transform;
	}
};

Transform.updateRoot = function (root)
{
	var currentTransform;
	var currentChild = null;
	var stackLength = 0;
	var transformStack = root.transformStack;
	var childStack = root.childStack;
	var childrenArray = root.flatChildrenArray;
	var cos = Math.cos;
	var sin = Math.sin;

	if (root.dirty)
	{
		var counts = flattenTree(root.children, root.flatRenderArray, childrenArray, 0, 0);
		root.childCount = counts[0];
		root.renderCount = counts[1];
		root.dirty = false;
	}
	var transX = root.positionX; 
	var transY = root.positionY;
	var scaleX = root.scaleX;
	var scaleY = root.scaleY;
	var rotation = root.rotation;
	var tcos = cos(rotation);
	var tsin = sin(rotation);

	currentTransform = root.localMatrix.matrix;
	currentTransform[0] = tcos * scaleX;
	currentTransform[1] = tsin * scaleX;
    currentTransform[2] = -tsin * scaleY;
	currentTransform[3] = tcos * scaleY;
	currentTransform[4] = transX;
	currentTransform[5] = transY;

	for (var index = 0, length = root.childCount; index < length; ++index)
	{
		var child = childrenArray[index];
		if (child !== currentChild)
		{
			// inlined transformation
		    var world = child.worldMatrix.matrix;
			var local = child.localMatrix.matrix;
			var p0 = currentTransform[0];
		    var p1 = currentTransform[1];
		    var p2 = currentTransform[2];
		    var p3 = currentTransform[3];
		    var p4 = currentTransform[4];
		    var p5 = currentTransform[5];
			
			transX = child.positionX;
			transY = child.positionY;
			scaleX = child.scaleX;
			scaleY = child.scaleY;
			rotation = child.rotation;
		    tcos = cos(rotation);
		    tsin = sin(rotation);

		    // Rotate + Scale + Translate
		    var l0 = tcos * scaleX;
    		var l1 = tsin * scaleX;
    		var l2 = -tsin * scaleY;
    		var l3 = tcos * scaleY;

    		// Apply world transformation
		    world[0] = l0 * p0 + l1 * p2;
		    world[1] = l0 * p1 + l1 * p3;
		    world[2] = l2 * p0 + l3 * p2;
		    world[3] = l2 * p1 + l3 * p3;
		    world[4] = transX * p0 + transY * p2 + p4;
		    world[5] = transX * p1 + transY * p3 + p5;

		    // Store local transformation
		    local[0] = l0;
		    local[1] = l1;
		    local[2] = l2;
		    local[3] = l3;
		    local[4] = transX;
		    local[5] = transY;

			if (child.hasChildren)
			{
				transformStack[stackLength] = currentTransform;
				childStack[stackLength++] = currentChild;
				currentTransform = local;
				currentChild = child;
			}
		}
		else
		{
			currentTransform = transformStack[--stackLength];
			currentChild = childStack[stackLength];
		}
	}
};

// Only call this function once per frame. Should probably
// be only available at State
Transform.prototype.___updateRoot___old = function ()
{
	if (this.root !== this)
	{
		return;
	}
	var currentTransform;
	var currentChild = null;
	var stackLength = 0;
	var transformStack = this.transformStack;
	var childStack = this.childStack;
	var childrenArray = this.flatChildrenArray;
	var currentTransform = this.localMatrix;
	var cos = Math.cos;
	var sin = Math.sin;

	if (this.dirty)
	{
		var counts = this.flattenTree(this.children, this.flatRenderArray, childrenArray, 0, 0);
		this.childCount = counts[0];
		this.renderCount = counts[1];
		this.dirty = false;
	}

	this.localMatrix.loadIdentity();
	this.localMatrix.translate(this.positionX, this.positionY);
	this.localMatrix.rotate(this.rotation);
	this.localMatrix.scale(this.scaleX, this.scaleY);
	currentTransform = this.localMatrix.matrix;

	for (var index = 0, length = this.childCount; index < length; ++index)
	{
		var child = childrenArray[index];
		if (child !== currentChild)
		{
			// inlined transformation
			var parent = currentTransform;
		    var world = child.worldMatrix.matrix;
			var rotation = child.rotation;
			var local = child.localMatrix.matrix;
			var transX = child.positionX;
			var transY = child.positionY;
			var scaleX = child.scaleX;
			var scaleY = child.scaleY;
			var rotation = child.rotation;
		    var tcos = 1;
		    var tsin = 0;

		    var p0 = parent[0];
		    var p1 = parent[1];
		    var p2 = parent[2];
		    var p3 = parent[3];
		    var p4 = parent[4];
		    var p5 = parent[5];

		    // Rotate + Scale + Translate
		    if (rotation !== 0)
		    {
		    	tcos = cos(rotation);
				tsin = sin(rotation);
		    }
		    var l0 = tcos * scaleX;
    		var l1 = tsin * scaleX;
    		var l2 = -tsin * scaleY;
    		var l3 = tcos * scaleY;

    		// Apply world transformation
		    world[0] = l0 * p0 + l1 * p2;
		    world[1] = l0 * p1 + l1 * p3;
		    world[2] = l2 * p0 + l3 * p2;
		    world[3] = l2 * p1 + l3 * p3;
		    world[4] = transX * p0 + transY * p2 + p4;
		    world[5] = transX * p1 + transY * p3 + p5;

		    // Store local transformation
		    local[0] = l0;
		    local[1] = l1;
		    local[2] = l2;
		    local[3] = l3;
		    local[4] = transX;
		    local[5] = transY;

			if (child.hasChildren)
			{
				transformStack[stackLength] = currentTransform;
				childStack[stackLength++] = currentChild;
				currentTransform = local;
				currentChild = child;
			}
		}
		else
		{
			currentTransform = transformStack[--stackLength];
			currentChild = childStack[stackLength];
		}
	}
};

Object.defineProperties(Transform.prototype,{
	worldPositionX: {
		enumarable: true,
		get: function ()
		{
			return this.world[4];
		}
	},
	worldPositionY: {
		enumarable: true,
		get: function ()
		{
			return this.world[5];
		}
	},
	worldScaleX: {
		enumarable: true,
		get: function ()
		{
			var world = this.world;
		    var a = world[0];
		    var c = world[2];
		    var a2 = a * a;
		    var c2 = c * c;
		    var sx = Math.sqrt(a2 + c2);
		    return sx;
		}
	},
	worldScaleY: {
		enumarable: true,
		get: function ()
		{
			var world = this.world;
		    var b = world[1];
		    var d = world[3];
		    var b2 = b * b;
		    var d2 = d * d;
		    var sy = Math.sqrt(b2 + d2);
		    return sy;
		}
	},
	worldRotation: {
		enumarable: true,
		get: function ()
		{
			var world = this.world;
		    var a = world[0];
		    var c = world[2];
		    var a2 = a * a;
		    var c2 = c * c;
		    return Math.acos(a / Math.sqrt(a2 + c2)) * (Math.atan(-c / a) < 0 ? -1 : 1);
		}
	}
});

module.exports = Transform;
