var Class = require('../../utils/Class');
var Matrix4 = require('../../math/Matrix4');
var RandomXYZ = require('../../math/RandomXYZ');
var RandomXYZW = require('../../math/RandomXYZW');
var RotateVec3 = require('../../math/RotateVec3');
var Set = require('../../structs/Set');
var Sprite3D = require('../../gameobjects/sprite3d/Sprite3D');
var Vector2 = require('../../math/Vector2');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

//  Local cache vars
var tmpVec3 = new Vector3();
var tmpVec4 = new Vector4();
var dirvec = new Vector3();
var rightvec = new Vector3();
var billboardMatrix = new Matrix4();

var Camera3D = new Class({

    initialize: function (scene)
    {
        this.scene = scene;

        this.displayList = scene.sys.displayList;
        this.updateList = scene.sys.updateList;

        this.name = '';

        this.direction = new Vector3(0, 0, -1);
        this.up = new Vector3(0, 1, 0);
        this.position = new Vector3();

        //  The mapping from 3D size units to pixels.
        //  In the default case 1 3D unit = 128 pixels. So a sprite that is
        //  256 x 128 px in size will be 2 x 1 units.
        //  Change to whatever best fits your game assets.
        this.pixelScale = 128;

        this.projection = new Matrix4();
        this.view = new Matrix4();
        this.combined = new Matrix4();
        this.invProjectionView = new Matrix4();

        this.near = 1;
        this.far = 100;

        this.ray = {
            origin: new Vector3(),
            direction: new Vector3()
        };

        this.viewportWidth = 0;
        this.viewportHeight = 0;

        this.billboardMatrixDirty = true;

        this.children = new Set();
    },

    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this.update();
    },

    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    setPixelScale: function (value)
    {
        this.pixelScale = value;

        return this.update();
    },

    add: function (sprite3D)
    {
        this.children.set(sprite3D);

        this.updateChildren();

        return sprite3D;
    },

    remove: function (child)
    {
        this.displayList.remove(child.gameObject);
        this.updateList.remove(child.gameObject);

        this.children.delete(child);

        return this;
    },

    clear: function ()
    {
        var children = this.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            this.remove(children[i]);
        }

        return this;
    },

    getChildren: function ()
    {
        return this.children.entries;
    },

    create: function (x, y, z, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var child = new Sprite3D(this.scene, x, y, z, key, frame);

        this.displayList.add(child.gameObject);
        this.updateList.add(child.gameObject);

        child.visible = visible;

        this.children.set(child);

        this.updateChildren();

        return child;
    },

    createMultiple: function (quantity, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var output = [];

        for (var i = 0; i < quantity; i++)
        {
            var child = new Sprite3D(this.scene, 0, 0, 0, key, frame);

            this.displayList.add(child.gameObject);
            this.updateList.add(child.gameObject);

            child.visible = visible;

            this.children.set(child);

            output.push(child);
        }

        return output;
    },

    randomSphere: function (radius, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZ(sprites[i].position, radius);
        }

        return this.update();
    },

    randomCube: function (scale, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZW(sprites[i].position, scale);
        }

        return this.update();
    },

    translateChildren: function (vec3, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.add(vec3);
        }

        return this.update();
    },

    transformChildren: function (mat4, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.transformMat4(mat4);
        }

        return this.update();
    },

    /**
     * Sets the width and height of the viewport. Does not
     * update any matrices.
     * 
     * @method  setViewport
     * @param {Number} width  the viewport width
     * @param {Number} height the viewport height
     */
    setViewport: function (width, height)
    {
        this.viewportWidth = width;
        this.viewportHeight = height;

        return this.update();
    },

    /**
     * Translates this camera by a specified Vector3 object
     * or x, y, z parameters. Any undefined x y z values will
     * default to zero, leaving that component unaffected.
     * If you wish to set the camera position directly call setPosition instead.
     *
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    translate: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.position.x += x.x || 0;
            this.position.y += x.y || 0;
            this.position.z += x.z || 0;
        }
        else
        {
            this.position.x += x || 0;
            this.position.y += y || 0;
            this.position.z += z || 0;
        }

        return this.update();
    },

    lookAt: function (x, y, z)
    {
        var dir = this.direction;
        var up = this.up;

        if (typeof x === 'object')
        {
            dir.copy(x);
        }
        else
        {
            dir.set(x, y, z);
        }

        dir.sub(this.position).normalize();

        //  Calculate right vector
        tmpVec3.copy(dir).cross(up).normalize();

        //  Calculate up vector
        up.copy(tmpVec3).cross(dir).normalize();

        return this.update();
    },

    rotate: function (radians, axis)
    {
        RotateVec3(this.direction, axis, radians);
        RotateVec3(this.up, axis, radians);

        return this.update();
    },

    rotateAround: function (point, radians, axis)
    {
        tmpVec3.copy(point).sub(this.position);

        this.translate(tmpVec3);
        this.rotate(radians, axis);
        this.translate(tmpVec3.negate());

        return this.update();
    },

    project: function (vec, out)
    {
        if (out === undefined) { out = new Vector4(); }

        //  TODO: support viewport XY
        var viewportWidth = this.viewportWidth;
        var viewportHeight = this.viewportHeight;
        var n = Camera3D.NEAR_RANGE;
        var f = Camera3D.FAR_RANGE;

        //  For useful Z and W values we should do the usual steps: clip space -> NDC -> window coords

        //  Implicit 1.0 for w component
        tmpVec4.set(vec.x, vec.y, vec.z, 1.0);

        //  Transform into clip space
        tmpVec4.transformMat4(this.combined);

        //  Avoid divide by zero when 0x0x0 camera projects to a 0x0x0 vec3
        if (tmpVec4.w === 0)
        {
            tmpVec4.w = 1;
        }

        //  Now into NDC
        tmpVec4.x = tmpVec4.x / tmpVec4.w;
        tmpVec4.y = tmpVec4.y / tmpVec4.w;
        tmpVec4.z = tmpVec4.z / tmpVec4.w;

        //  And finally into window coordinates
        out.x = viewportWidth / 2 * tmpVec4.x + (0 + viewportWidth / 2);
        out.y = viewportHeight / 2 * tmpVec4.y + (0 + viewportHeight / 2);
        out.z = (f - n) / 2 * tmpVec4.z + (f + n) / 2;

        //  If the out vector has a fourth component, we also store (1/clip.w), same idea as gl_FragCoord.w
        if (out.w === 0 || out.w)
        {
            out.w = 1 / tmpVec4.w;
        }

        return out;
    },

    unproject: function (vec, out)
    {
        if (out === undefined) { out = new Vector3(); }

        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);

        return out.copy(vec).unproject(viewport, this.invProjectionView);
    },

    getPickRay: function (x, y)
    {
        var origin = this.ray.origin.set(x, y, 0);
        var direction = this.ray.direction.set(x, y, 1);
        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);
        var mtx = this.invProjectionView;

        origin.unproject(viewport, mtx);

        direction.unproject(viewport, mtx);

        direction.sub(origin).normalize();

        return this.ray;
    },

    updateChildren: function ()
    {
        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            children[i].project(this);
        }

        return this;
    },

    //  Overriden by subclasses
    update: function ()
    {
        return this.updateChildren();
    },

    updateBillboardMatrix: function ()
    {
        var dir = dirvec.set(this.direction).negate();

        // Better view-aligned billboards might use this:
        // var dir = tmp.set(camera.position).sub(p).normalize();
        
        var right = rightvec.set(this.up).cross(dir).normalize();
        var up = tmpVec3.set(dir).cross(right).normalize();

        var out = billboardMatrix.val;

        out[0] = right.x;
        out[1] = right.y;
        out[2] = right.z;
        out[3] = 0;

        out[4] = up.x;
        out[5] = up.y;
        out[6] = up.z;
        out[7] = 0;

        out[8] = dir.x;
        out[9] = dir.y;
        out[10] = dir.z;
        out[11] = 0;

        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        this.billboardMatrixDirty = false;
    },
    
    /**
     * This is a utility function for canvas 3D rendering, 
     * which determines the "point size" of a camera-facing
     * sprite billboard given its 3D world position 
     * (origin at center of sprite) and its world width
     * and height in x/y. 
     *
     * We place into the output Vector2 the scaled width
     * and height. If no `out` is specified, a new Vector2
     * will be created for convenience (this should be avoided 
     * in tight loops).
     * 
     * @param  {Vector3} vec the position of the 3D sprite
     * @param  {Vector2} size the x and y dimensions of the sprite
     * @param  {Vector2} out the result, scaled x and y dimensions in 3D space
     * @return {Vector2} returns the out parameter, or a new Vector2 if none was given
     */
    getPointSize: function (vec, size, out)
    {
        if (out === undefined) { out = new Vector2(); }

        //TODO: optimize this with a simple distance calculation:
        //https://developer.valvesoftware.com/wiki/Field_of_View

        if (this.billboardMatrixDirty)
        {
            this.updateBillboardMatrix();
        }

        var tmp = tmpVec3;

        var dx = (size.x / this.pixelScale) / 2;
        var dy = (size.y / this.pixelScale) / 2;

        tmp.set(-dx, -dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var tlx = tmp.x;
        var tly = tmp.y;

        tmp.set(dx, dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var brx = tmp.x;
        var bry = tmp.y;

        var w = Math.abs(brx - tlx);
        var h = Math.abs(bry - tly);

        return out.set(w, h);
    },

    destroy: function ()
    {
        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    },

    setX: function (value)
    {
        this.position.x = value;

        return this.update();
    },

    setY: function (value)
    {
        this.position.y = value;

        return this.update();
    },

    setZ: function (value)
    {
        this.position.z = value;

        return this.update();
    },

    x: {
        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
            this.update();
        }
    },

    y: {
        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
            this.update();
        }
    },

    z: {
        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
            this.update();
        }
    }

});

Camera3D.FAR_RANGE = 1.0;
Camera3D.NEAR_RANGE = 0.0;

module.exports = Camera3D;
