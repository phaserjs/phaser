var Vector3 = require('../../math/Vector3');
var Sphere = require('../math/Sphere');

var helpVector3 = new Vector3();
var helpSphere = new Sphere();

var sortFrontToBack = function (a, b)
{
    if (a.renderOrder !== b.renderOrder)
    {
        return a.renderOrder - b.renderOrder;
    }
    else if (a.material.id !== b.material.id)
    {
        // batch
        return a.material.id - b.material.id;
    }
    else if (a.z !== b.z)
    {
        return a.z - b.z;
    }
    else
    {
        return a.id - b.id;
    }
};

var sortBackToFront = function (a, b)
{
    if (a.renderOrder !== b.renderOrder)
    {
        return a.renderOrder - b.renderOrder;
    }
    else if (a.z !== b.z)
    {
        return b.z - a.z;
    }
    else if (a.material.id !== b.material.id)
    {
        // fix Unstable sort below chrome version 7.0
        // if render same object with different materials
        return a.material.id - b.material.id;
    }
    else
    {
        return a.id - b.id;
    }
};

function RenderList ()
{
    var renderItems = [];
    var renderItemsIndex = 0;

    var opaque = [];
    var opaqueCount = 0;

    var transparent = [];
    var transparentCount = 0;

    function startCount ()
    {
        renderItemsIndex = 0;

        opaqueCount = 0;
        transparentCount = 0;
    }

    function add (object, camera)
    {
        //  Frustum test
        if (object.frustumCulled && camera.frustumCulled)
        {
            helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);

            var frustumTest = camera.frustum.intersectsSphere(helpSphere);

            if (!frustumTest)
            {
                //  Only test bounding sphere
                return;
            }
        }

        // calculate z
        helpVector3.setFromMatrixPosition(object.worldMatrix);

        // helpVector3.project(camera);
        helpVector3.projectViewMatrix(camera.viewMatrix, camera.projectionMatrix);

        if (Array.isArray(object.material))
        {
            var groups = object.geometry.groups;

            for (var i = 0; i < groups.length; i++)
            {
                var group = groups[i];
                var groupMaterial = object.material[group.materialIndex];
                if (groupMaterial)
                {
                    _doAdd(object, object.geometry, groupMaterial, helpVector3.z, group);
                }
            }
        }
        else
        {
            _doAdd(object, object.geometry, object.material, helpVector3.z);
        }
    }

    function _doAdd (object, geometry, material, z, group)
    {
        var renderable = renderItems[renderItemsIndex];

        if (renderable === undefined)
        {
            renderable = {
                object: object,
                geometry: geometry,
                material: material,
                z: z,
                renderOrder: object.renderOrder,
                group: group
            };
            renderItems[renderItemsIndex] = renderable;
        }
        else
        {
            renderable.object = object;
            renderable.geometry = geometry;
            renderable.material = material;
            renderable.z = z;
            renderable.renderOrder = object.renderOrder;
            renderable.group = group;
        }

        if (material.transparent)
        {
            transparent[transparentCount] = renderable;
            transparentCount++;
        }
        else
        {
            opaque[opaqueCount] = renderable;
            opaqueCount++;
        }

        renderItemsIndex++;
    }

    function endCount ()
    {
        opaque.length = opaqueCount;
        transparent.length = transparentCount;
    }

    function sort ()
    {
        opaque.sort(sortFrontToBack);
        transparent.sort(sortBackToFront);
    }

    return {
        opaque: opaque,
        transparent: transparent,
        startCount: startCount,
        add: add,
        endCount: endCount,
        sort: sort
    };
}

module.exports = RenderList;
