var World = require('../world/World')

var num = { type:"number", required:true };

/*
 * Serialize a World instance to JSON
 * @method serialize
 * @param  {World} world
 * @return {Object}
 */
exports.serialize = function(world){
    return {};
};

/*
 * Load a World instance from JSON
 * @param  {Object} json
 * @return {World}
 */
exports.deserialize = function(json){
    var world = new World();
    return world;
};

var schemas = exports.schemas = {};

schemas['0.3.0'] = {
    type: "object",
    additionalProperties:false,
    properties: {
        gravity:          { $ref:"vec2" },
        p2:               { type:"string", pattern:"^0.3$", required:true },
        solver:           { type:"object", required:true  },
        broadphase:       { type:"object", required:true  },
        bodies:           {
            type:"array",
            required:true,
            additionalItems:false,
            items:{
                type:"object",
                additionalProperties:false,
                properties:{
                    id :                num,
                    mass :              num,
                    angle :             num,
                    position :          { $ref:"vec2" },
                    velocity :          { $ref:"vec2" },
                    angularVelocity :   num,
                    force :             { $ref:"vec2" },
                    shapes :            { required:true, type:"array" },
                    concavePath :       { required:true, type:["array","null"] },
                },
            }
        },
        springs: {
            type:"array",
            required:true,
            additionalItems:false,
            items:{
                type:"object",
                additionalProperties:false,
                properties:{
                    bodyA :         num,
                    bodyB :         num,
                    stiffness :     num,
                    damping :       num,
                    restLength :    num,
                    localAnchorA :  { $ref:"vec2" },
                    localAnchorB :  { $ref:"vec2" },
                },
            },
        },
        constraints:      {
            type:"array",
            required:true,
            items:[{
                type:"object",
                additionalProperties:false,
                properties:{
                    bodyA:      num,
                    bodyB:      num,
                    type:       { type:"string", match:"^DistanceConstraint$" },
                    distance:   num,
                    maxForce:   num,
                },
            },{
                type:"object",
                additionalProperties:false,
                properties:{
                    bodyA:      num,
                    bodyB:      num,
                    type:       { type:"string", match:"^PrismaticConstraint$" },
                    localAxisA: { $ref:"vec2" },
                    localAxisB: { $ref:"vec2" },
                    maxForce:   num,
                },
            },{
                type:"object",
                additionalProperties:false,
                properties:{
                    bodyA: num,
                    bodyB: num,
                    type: { type:"string", match:'^RevoluteConstraint$' },
                    pivotA: { $ref:"vec2" },
                    pivotB: { $ref:"vec2" },
                    maxForce: num,
                    motorSpeed: { type:["number","boolean"] },
                    lowerLimit: num,
                    lowerLimitEnabled: { type:"boolean" },
                    upperLimit: num,
                    upperLimitEnabled: { type:"boolean" },
                },
            }],
        },
        contactMaterials: {
            type:"array",
            required:true,
            additionalItems:false,
            items: {
                properties : {
                    id:                 num,
                    materialA:          num,
                    materialB:          num,
                    friction:           num,
                    restitution:        num,
                    stiffness:          num,
                    relaxation:         num,
                    frictionStiffness:  num,
                    frictionRelaxation: num,
                }
            }
        },
    }
};

exports.vec2 = {
    id: "/vec2",
    type:"array",
    maxItems:2,
    minItems:2,
    items:{
        type:"number",
    },
    additionalItems:false,
    required:true,
};
