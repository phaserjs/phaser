function TransformMatrix()
{
	this.matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
}
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
function Transform(gameObject, root)
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
	// Only valid if you are the root.
	// This probably needs to be on State and not here.
	this.flatChildrenArray = [];
	this.flatRenderArray = [];
	this.transformStack = [];
	this.childStack = [];
	this.childCount = 0;
	this.renderCount = 0;
	this.dirty = false;
	this.root = root || this;
    this.gameObject = gameObject;
}
// this must be called only once on the root of the tree. Never on children
Transform.prototype.flattenTree = function (children, flatRenderArray, flatChildrenArray, childCount, renderCount)
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
			var counts = this.flattenTree(children[index].children, flatChildrenArray, childCount);
			childCount = counts[0];
			renderCount = counts[1];
			flatChildrenArray[childCount++] = children[index]; // add ending tag
		}
	}
	return [childCount, renderCount];
};
Transform.prototype.add = function (transform)
{
	this.root.dirty = true;
	this.hasChildren = true;
	transform.root = this.root;
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
	}
};

// Only call this function once per frame. Should probably
// be only available at State
Transform.prototype.updateRoot = function ()
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
	if (this.dirty)
	{
		var counts = this.flattenTree(this.children, this.flatRenderArray, childrenArray, 0, 0);
		this.childCount = counts[0];
		this.renderCount = counts[1];
		this.dirty = false;
	}
	this.updateLocal();
	currentTransform = this.localMatrix;
	for (var index = 0, length = this.childCount; index < length; ++index)
	{
		var child = childrenArray[index];
		if (child !== currentChild)
		{
			child.update(currentTransform);
			if (child.hasChildren)
			{
				transformStack[stackLength] = currentTransform;
				childStack[stackLength++] = currentChild;
				currentTransform = child.worldMatrix;
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
Transform.prototype.update = function (parentTransformMatrix)
{
    var parent = parentTransformMatrix.matrix;
    var world = this.worldMatrix.matrix;
	var localm = this.localMatrix.loadIdentity();
	var rotation = this.rotation;
	localm.translate(this.positionX, this.positionY);
	if (rotation !== 0) localm.rotate(this.rotation);
	var local = localm.scale(this.scaleX, this.scaleY).matrix;
    
    world[0] = parent[0] * local[0] + parent[1] * local[2];
    world[1] = parent[0] * local[1] + parent[1] * local[3];
    world[2] = parent[2] * local[0] + parent[3] * local[2];
    world[3] = parent[2] * local[1] + parent[3] * local[3];
    world[4] = parent[4] * local[0] + parent[5] * local[2] + local[4];
    world[5] = parent[4] * local[1] + parent[5] * local[3] + local[5];
};
Transform.prototype.updateLocal = function ()
{
	var local = this.localMatrix.loadIdentity();
	local.translate(this.positionX, this.positionY);
	local.rotate(this.rotation);
	local.scale(this.scaleX, this.scaleY);
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
