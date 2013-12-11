var  GSSolver = require('../solver/GSSolver')
,    NaiveBroadphase = require('../collision/NaiveBroadphase')
,    vec2 = require('../math/vec2')
,    Circle = require('../shapes/Circle')
,    Rectangle = require('../shapes/Rectangle')
,    Convex = require('../shapes/Convex')
,    Line = require('../shapes/Line')
,    Plane = require('../shapes/Plane')
,    Capsule = require('../shapes/Capsule')
,    Particle = require('../shapes/Particle')
,    EventEmitter = require('../events/EventEmitter')
,    Body = require('../objects/Body')
,    Spring = require('../objects/Spring')
,    Material = require('../material/Material')
,    ContactMaterial = require('../material/ContactMaterial')
,    DistanceConstraint = require('../constraints/DistanceConstraint')
,    LockConstraint = require('../constraints/LockConstraint')
,    RevoluteConstraint = require('../constraints/RevoluteConstraint')
,    PrismaticConstraint = require('../constraints/PrismaticConstraint')
,    pkg = require('../../package.json')
,    Broadphase = require('../collision/Broadphase')
,    Narrowphase = require('../collision/Narrowphase')

module.exports = World;

var currentVersion = pkg.version.split(".").slice(0,2).join("."); // "X.Y"

function now(){
    if(typeof(performance)!="undefined"){
        if(performance.now)
            return performance.now();
        else if(performance.webkitNow)
            return performance.webkitNow();
    } else
        return new Date().getTime();
}

/**
 * The dynamics world, where all bodies and constraints lives.
 *
 * @class World
 * @constructor
 * @param {Object}          [options]
 * @param {Solver}          options.solver Defaults to GSSolver.
 * @param {Float32Array}    options.gravity Defaults to [0,-9.78]
 * @param {Broadphase}      options.broadphase Defaults to NaiveBroadphase
 * @extends {EventEmitter}
 */
function World(options){
    EventEmitter.apply(this);

    options = options || {};

    /**
     * All springs in the world.
     *
     * @property springs
     * @type {Array}
     */
    this.springs = [];

    /**
     * All bodies in the world.
     *
     * @property bodies
     * @type {Array}
     */
    this.bodies = [];

    /**
     * The solver used to satisfy constraints and contacts.
     *
     * @property solver
     * @type {Solver}
     */
    this.solver = options.solver || new GSSolver();

    /**
     * The narrowphase to use to generate contacts.
     *
     * @property narrowphase
     * @type {Narrowphase}
     */
    this.narrowphase = new Narrowphase();

    /**
     * Gravity in the world. This is applied on all bodies in the beginning of each step().
     *
     * @property
     * @type {Float32Array}
     */
    this.gravity = options.gravity || vec2.fromValues(0, -9.78);

    /**
     * Whether to do timing measurements during the step() or not.
     *
     * @property doPofiling
     * @type {Boolean}
     */
    this.doProfiling = options.doProfiling || false;

    /**
     * How many millisecconds the last step() took. This is updated each step if .doProfiling is set to true.
     *
     * @property lastStepTime
     * @type {Number}
     */
    this.lastStepTime = 0.0;

    /**
     * The broadphase algorithm to use.
     *
     * @property broadphase
     * @type {Broadphase}
     */
    this.broadphase = options.broadphase || new NaiveBroadphase();

    /**
     * User-added constraints.
     *
     * @property constraints
     * @type {Array}
     */
    this.constraints = [];

    /**
     * Friction between colliding bodies. This value is used if no matching ContactMaterial is found for the body pair.
     * @property defaultFriction
     * @type {Number}
     */
    this.defaultFriction = 0.3;

    /**
     * For keeping track of what time step size we used last step
     * @property lastTimeStep
     * @type {Number}
     */
    this.lastTimeStep = 1/60;

    /**
     * Enable to automatically apply spring forces each step.
     * @property applySpringForces
     * @type {Boolean}
     */
    this.applySpringForces = true;

    /**
     * Enable to automatically apply body damping each step.
     * @property applyDamping
     * @type {Boolean}
     */
    this.applyDamping = true;

    /**
     * Enable/disable constraint solving in each step.
     * @property solveConstraints
     * @type {Boolean}
     */
    this.solveConstraints = true;

    /**
     * The ContactMaterials added to the World.
     * @property contactMaterials
     * @type {Array}
     */
    this.contactMaterials = [];

    /**
     * World time.
     * @property time
     * @type {Number}
     */
    this.time = 0.0;

    /**
     * Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
     * @property emitImpactEvent
     * @type {Boolean}
     */
    this.emitImpactEvent = true;

    // Id counters
    this._constraintIdCounter = 0;
    this._bodyIdCounter = 0;

    /**
     * Fired after the step().
     * @event postStep
     */
    this.postStepEvent = {
        type : "postStep",
    };

    /**
     * @event addBody
     * @param {Body} body
     */
    this.addBodyEvent = {
        type : "addBody",
        body : null
    };

    /**
     * @event removeBody
     * @param {Body} body
     */
    this.removeBodyEvent = {
        type : "removeBody",
        body : null
    };

    /**
     * Fired when a spring is added to the world.
     * @event addSpring
     * @param {Spring} spring
     */
    this.addSpringEvent = {
        type : "addSpring",
        spring : null,
    };

    /**
     * Fired when a first contact is created between two bodies. This event is fired after the step has been done.
     * @event impact
     * @param {Body} bodyA
     * @param {Body} bodyB
     */
    this.impactEvent = {
        type: "impact",
        bodyA : null,
        bodyB : null,
    };
};
World.prototype = new Object(EventEmitter.prototype);

/**
 * Add a constraint to the simulation.
 *
 * @method addConstraint
 * @param {Constraint} c
 */
World.prototype.addConstraint = function(c){
    this.constraints.push(c);
};

/**
 * Add a ContactMaterial to the simulation.
 * @method addContactMaterial
 * @param {ContactMaterial} contactMaterial
 */
World.prototype.addContactMaterial = function(contactMaterial){
    this.contactMaterials.push(contactMaterial);
};

/**
 * Removes a contact material
 *
 * @method removeContactMaterial
 * @param {ContactMaterial} cm
 */
World.prototype.removeContactMaterial = function(cm){
    var idx = this.contactMaterials.indexOf(cm);
    if(idx!==-1)
        this.contactMaterials.splice(idx,1);
};

/**
 * Get a contact material given two materials
 * @method getContactMaterial
 * @param {Material} materialA
 * @param {Material} materialB
 * @return {ContactMaterial} The matching ContactMaterial, or false on fail.
 * @todo Use faster hash map to lookup from material id's
 */
World.prototype.getContactMaterial = function(materialA,materialB){
    var cmats = this.contactMaterials;
    for(var i=0, N=cmats.length; i!==N; i++){
        var cm = cmats[i];
        if( (cm.materialA === materialA) && (cm.materialB === materialB) ||
            (cm.materialA === materialB) && (cm.materialB === materialA) )
            return cm;
    }
    return false;
};

/**
 * Removes a constraint
 *
 * @method removeConstraint
 * @param {Constraint} c
 */
World.prototype.removeConstraint = function(c){
    var idx = this.constraints.indexOf(c);
    if(idx!==-1){
        this.constraints.splice(idx,1);
    }
};

var step_r = vec2.create(),
    step_runit = vec2.create(),
    step_u = vec2.create(),
    step_f = vec2.create(),
    step_fhMinv = vec2.create(),
    step_velodt = vec2.create(),
    step_mg = vec2.create(),
    xiw = vec2.fromValues(0,0),
    xjw = vec2.fromValues(0,0),
    zero = vec2.fromValues(0,0);

/**
 * Step the physics world forward in time.
 *
 * @method step
 * @param {Number} dt The time step size to use.
 *
 * @example
 *     var world = new World();
 *     world.step(0.01);
 */
World.prototype.step = function(dt){
    var that = this,
        doProfiling = this.doProfiling,
        Nsprings = this.springs.length,
        springs = this.springs,
        bodies = this.bodies,
        g = this.gravity,
        solver = this.solver,
        Nbodies = this.bodies.length,
        broadphase = this.broadphase,
        np = this.narrowphase,
        constraints = this.constraints,
        t0, t1,
        fhMinv = step_fhMinv,
        velodt = step_velodt,
        mg = step_mg,
        scale = vec2.scale,
        add = vec2.add,
        rotate = vec2.rotate;

    this.lastTimeStep = dt;

    if(doProfiling){
        t0 = now();
    }

    // Todo: remove. This is actually not needed any more
    var glen = vec2.length(g);

    // add gravity to bodies
    if(glen !== 0){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i],
                fi = b.force;
            vec2.scale(mg,g,b.mass);
            add(fi,fi,mg);
        }
    }

    // Add spring forces
    if(this.applySpringForces){
        for(var i=0; i!==Nsprings; i++){
            var s = springs[i];
            s.applyForce();
        }
    }

    if(this.applyDamping){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i];
            b.applyDamping(dt);
        }
    }

    // Broadphase
    var result = broadphase.getCollisionPairs(this);

    // Narrowphase
    np.reset();
    for(var i=0, Nresults=result.length; i!==Nresults; i+=2){
        var bi = result[i],
            bj = result[i+1];

        // Loop over all shapes of body i
        for(var k=0; k!==bi.shapes.length; k++){
            var si = bi.shapes[k],
                xi = bi.shapeOffsets[k] || zero,
                ai = bi.shapeAngles[k] || 0;

            // All shapes of body j
            for(var l=0; l!==bj.shapes.length; l++){
                var sj = bj.shapes[l],
                    xj = bj.shapeOffsets[l] || zero,
                    aj = bj.shapeAngles[l] || 0;

                var mu = this.defaultFriction,
                    restitution = 0.0;

                if(si.material && sj.material){
                    var cm = this.getContactMaterial(si.material,sj.material);
                    if(cm){
                        mu = cm.friction;
                        restitution = cm.restitution;
                    }
                }

                World.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,mu,glen,restitution);
            }
        }
    }

    // Add contact equations to solver
    solver.addEquations(np.contactEquations);
    solver.addEquations(np.frictionEquations);

    // Add user-defined constraint equations
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        var c = constraints[i];
        c.update();
        solver.addEquations(c.equations);
    }

    if(this.solveConstraints)
        solver.solve(dt,this);

    solver.removeAllEquations();

    // Step forward
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];

        if(body.mass>0){
            World.integrateBody(body,dt);
        }
    }

    // Reset force
    for(var i=0; i!==Nbodies; i++){
        bodies[i].setZeroForce();
    }

    if(doProfiling){
        t1 = now();
        that.lastStepTime = t1-t0;
    }

    // Emit impact event
    if(this.emitImpactEvent){
        var ev = this.impactEvent;
        for(var i=0; i!==np.contactEquations.length; i++){
            var eq = np.contactEquations[i];
            if(eq.firstImpact){
                ev.bodyA = eq.bi;
                ev.bodyB = eq.bj;
                this.emit(ev);
            }
        }
    }

    // Increment time
    this.time += dt;

    this.emit(this.postStepEvent);
};

var ib_fhMinv = vec2.create();
var ib_velodt = vec2.create();

/**
 * Move a body forward in time.
 * @static
 * @method integrateBody
 * @param  {Body} body
 * @param  {Number} dt
 */
World.integrateBody = function(body,dt){
    var minv = body.invMass,
        f = body.force,
        pos = body.position,
        velo = body.velocity;

    // Angular step
    body.angularVelocity += body.angularForce * body.invInertia * dt;
    body.angle += body.angularVelocity * dt;

    // Linear step
    vec2.scale(ib_fhMinv,f,dt*minv);
    vec2.add(velo,ib_fhMinv,velo);
    vec2.scale(ib_velodt,velo,dt);
    vec2.add(pos,pos,ib_velodt);
};

/**
 * Runs narrowphase for the shape pair i and j.
 * @static
 * @method runNarrowphase
 * @param  {Narrowphase} np
 * @param  {Body} bi
 * @param  {Shape} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Shape} sj
 * @param  {Array} xj
 * @param  {Number} aj
 * @param  {Number} mu
 * @param  {Number} glen
 */
World.runNarrowphase = function(np,bi,si,xi,ai,bj,sj,xj,aj,mu,glen,restitution){

    if(!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0))
        return;

    var reducedMass = bi.invMass + bj.invMass;
    if(reducedMass > 0)
        reducedMass = 1/reducedMass;

    var mug = mu * glen * reducedMass,
        doFriction = mu > 0;

    // Get world position and angle of each shape
    vec2.rotate(xiw, xi, bi.angle);
    vec2.rotate(xjw, xj, bj.angle);
    vec2.add(xiw, xiw, bi.position);
    vec2.add(xjw, xjw, bj.position);
    var aiw = ai + bi.angle;
    var ajw = aj + bj.angle;

    // Run narrowphase
    np.enableFriction = mu > 0;
    np.slipForce = mug;
    np.frictionCoefficient = mu;
    np.restitution = restitution;

    var resolver = np[si.type | sj.type];
    if (resolver) {
        if (si.type < sj.type) {
            resolver.call(np, bi,si,xiw,aiw, bj,sj,xjw,ajw);
        } else {
            resolver.call(np, bj,sj,xjw,ajw, bi,si,xiw,aiw);
        }
    }
};

/**
 * Add a spring to the simulation
 *
 * @method addSpring
 * @param {Spring} s
 */
World.prototype.addSpring = function(s){
    this.springs.push(s);
    this.addSpringEvent.spring = s;
    this.emit(this.addSpringEvent);
};

/**
 * Remove a spring
 *
 * @method removeSpring
 * @param {Spring} s
 */
World.prototype.removeSpring = function(s){
    var idx = this.springs.indexOf(s);
    if(idx===-1)
        this.springs.splice(idx,1);
};

/**
 * Add a body to the simulation
 *
 * @method addBody
 * @param {Body} body
 *
 * @example
 *     var world = new World(),
 *         body = new Body();
 *     world.addBody(body);
 *
 */
World.prototype.addBody = function(body){
    this.bodies.push(body);
    this.addBodyEvent.body = body;
    this.emit(this.addBodyEvent);
};

/**
 * Remove a body from the simulation
 *
 * @method removeBody
 * @param {Body} body
 */
World.prototype.removeBody = function(body){
    var idx = this.bodies.indexOf(body);
    if(idx!==-1){
        this.bodies.splice(idx,1);
        this.removeBodyEvent.body = body;
        body.resetConstraintVelocity();
        this.emit(this.removeBodyEvent);
    }
};

/**
 * Get a body by its id.
 * @method getBodyById
 * @return {Body|Boolean} The body, or false if it was not found.
 */
World.prototype.getBodyById = function(id){
    var bodies = this.bodies;
    for(var i=0; i<bodies.length; i++){
        var b = bodies[i];
        if(b.id === id)
            return b;
    }
    return false;
};

/**
 * Convert the world to a JSON-serializable Object.
 *
 * @method toJSON
 * @return {Object}
 */
World.prototype.toJSON = function(){
    var json = {
        p2 : currentVersion,
        bodies : [],
        springs : [],
        solver : {},
        gravity : v2a(this.gravity),
        broadphase : {},
        constraints : [],
        contactMaterials : [],
    };

    // Serialize springs
    for(var i=0; i!==this.springs.length; i++){
        var s = this.springs[i];
        json.springs.push({
            bodyA : this.bodies.indexOf(s.bodyA),
            bodyB : this.bodies.indexOf(s.bodyB),
            stiffness : s.stiffness,
            damping : s.damping,
            restLength : s.restLength,
            localAnchorA : v2a(s.localAnchorA),
            localAnchorB : v2a(s.localAnchorB),
        });
    }

    // Serialize constraints
    for(var i=0; i<this.constraints.length; i++){
        var c = this.constraints[i];
        var jc = {
            bodyA : this.bodies.indexOf(c.bodyA),
            bodyB : this.bodies.indexOf(c.bodyB),
        }
        if(c instanceof DistanceConstraint){
            jc.type = "DistanceConstraint";
            jc.distance = c.distance;
            jc.maxForce = c.getMaxForce();
        } else if(c instanceof RevoluteConstraint){
            jc.type = "RevoluteConstraint";
            jc.pivotA = v2a(c.pivotA);
            jc.pivotB = v2a(c.pivotB);
            jc.maxForce = c.maxForce;
            jc.motorSpeed = c.getMotorSpeed(); // False if motor is disabled, otherwise number.
            jc.lowerLimit = c.lowerLimit;
            jc.lowerLimitEnabled = c.lowerLimitEnabled;
            jc.upperLimit = c.upperLimit;
            jc.upperLimitEnabled = c.upperLimitEnabled;
        } else if(c instanceof PrismaticConstraint){
            jc.type = "PrismaticConstraint";
            jc.localAxisA = v2a(c.localAxisA);
            jc.localAnchorA = v2a(c.localAnchorA);
            jc.localAnchorB = v2a(c.localAnchorB);
            jc.maxForce = c.maxForce;
        } else if(c instanceof LockConstraint){
            jc.type = "LockConstraint";
            jc.localOffsetB = v2a(c.localOffsetB);
            jc.localAngleB = c.localAngleB;
            jc.maxForce = c.maxForce;
        } else {
            console.error("Constraint not supported yet!");
            continue;
        }

        json.constraints.push(jc);
    }

    // Serialize bodies
    for(var i=0; i!==this.bodies.length; i++){
        var b = this.bodies[i],
            ss = b.shapes,
            jsonShapes = [];

        for(var j=0; j<ss.length; j++){
            var s = ss[j],
                jsonShape;

            // Check type
            if(s instanceof Circle){
                jsonShape = {
                    type : "Circle",
                    radius : s.radius,
                };
            } else if(s instanceof Plane){
                jsonShape = { type : "Plane", };
            } else if(s instanceof Particle){
                jsonShape = { type : "Particle", };
            } else if(s instanceof Line){
                jsonShape = {   type : "Line",
                                length : s.length };
            } else if(s instanceof Rectangle){
                jsonShape = {   type : "Rectangle",
                                width : s.width,
                                height : s.height };
            } else if(s instanceof Convex){
                var verts = [];
                for(var k=0; k<s.vertices.length; k++)
                    verts.push(v2a(s.vertices[k]));
                jsonShape = {   type : "Convex",
                                verts : verts };
            } else if(s instanceof Capsule){
                jsonShape = {   type : "Capsule",
                                length : s.length,
                                radius : s.radius };
            } else {
                throw new Error("Shape type not supported yet!");
            }

            jsonShape.offset = v2a(b.shapeOffsets[j]);
            jsonShape.angle = b.shapeAngles[j];
            jsonShape.collisionGroup = s.collisionGroup;
            jsonShape.collisionMask = s.collisionMask;
            jsonShape.material = s.material && {
                id : s.material.id,
            };

            jsonShapes.push(jsonShape);
        }

        json.bodies.push({
            id : b.id,
            mass : b.mass,
            angle : b.angle,
            position : v2a(b.position),
            velocity : v2a(b.velocity),
            angularVelocity : b.angularVelocity,
            force : v2a(b.force),
            shapes : jsonShapes,
            concavePath : b.concavePath,
        });
    }

    // Serialize contactmaterials
    for(var i=0; i<this.contactMaterials.length; i++){
        var cm = this.contactMaterials[i];
        json.contactMaterials.push({
            id : cm.id,
            materialA :             cm.materialA.id, // Note: Reference by id!
            materialB :             cm.materialB.id,
            friction :              cm.friction,
            restitution :           cm.restitution,
            stiffness :             cm.stiffness,
            relaxation :            cm.relaxation,
            frictionStiffness :     cm.frictionStiffness,
            frictionRelaxation :    cm.frictionRelaxation,
        });
    }

    return json;

    function v2a(v){
        if(!v) return v;
        return [v[0],v[1]];
    }
};

/**
 * Upgrades a JSON object to current version
 * @method upgradeJSON
 * @param  {Object} json
 * @return {Object|Boolean} New json object, or false on failure.
 */
World.upgradeJSON = function(json){
    if(!json || !json.p2)
        return false;

    // Clone the json object
    json = JSON.parse(JSON.stringify(json));

    // Check version
    switch(json.p2){

        case currentVersion:
            // We are at latest json version
            return json;

        case "0.3":
            // Changes:
            // - Started caring about versioning

            // - Added LockConstraint type
            // Can't do much about that now though. Ignore.

            // Changed PrismaticConstraint arguments...
            for(var i=0; i<json.constraints.length; i++){
                var jc = json.constraints[i];
                if(jc.type=="PrismaticConstraint"){

                    // ...from these...
                    delete jc.localAxisA;
                    delete jc.localAxisB;

                    // ...to these. We cant make up anything good here, just do something
                    jc.localAxisA = [1,0];
                    jc.localAnchorA = [0,0];
                    jc.localAnchorB = [0,0];
                }
            }

            // Upgrade version number
            json.p2 = "0.4";
            break;
    }

    return World.upgradeJSON(json);
};

/**
 * Load a scene from a serialized state in JSON format.
 *
 * @method fromJSON
 * @param  {Object} json
 * @return {Boolean} True on success, else false.
 */
World.prototype.fromJSON = function(json){
    this.clear();
    json = World.upgradeJSON(json);

    // Upgrade failed.
    if(!json) return false;

    if(!json.p2)
        return false;

    // Set gravity
    vec2.copy(this.gravity, json.gravity);

    var bodies = this.bodies;

    // Load bodies
    var id2material = {};
    for(var i=0; i!==json.bodies.length; i++){
        var jb = json.bodies[i],
            jss = jb.shapes;

        var b = new Body({
            mass :              jb.mass,
            position :          jb.position,
            angle :             jb.angle,
            velocity :          jb.velocity,
            angularVelocity :   jb.angularVelocity,
            force :             jb.force,
        });
        b.id = jb.id;

        for(var j=0; j<jss.length; j++){
            var shape, js=jss[j];

            switch(js.type){
                case "Circle":      shape = new Circle(js.radius);              break;
                case "Plane":       shape = new Plane();                        break;
                case "Particle":    shape = new Particle();                     break;
                case "Line":        shape = new Line(js.length);                break;
                case "Rectangle":   shape = new Rectangle(js.width,js.height);  break;
                case "Convex":      shape = new Convex(js.verts);               break;
                case "Capsule":     shape = new Capsule(js.length, js.radius);  break;
                default:
                    throw new Error("Shape type not supported: "+js.type);
                    break;
            }
            shape.collisionMask = js.collisionMask;
            shape.collisionGroup = js.collisionGroup;
            shape.material = js.material;
            if(shape.material){
                shape.material = new Material();
                shape.material.id = js.material.id;
                id2material[shape.material.id+""] = shape.material;
            }
            b.addShape(shape,js.offset,js.angle);
        }

        if(jb.concavePath)
            b.concavePath = jb.concavePath;

        this.addBody(b);
    }

    // Load springs
    for(var i=0; i<json.springs.length; i++){
        var js = json.springs[i];
        var s = new Spring(bodies[js.bodyA], bodies[js.bodyB], {
            stiffness : js.stiffness,
            damping : js.damping,
            restLength : js.restLength,
            localAnchorA : js.localAnchorA,
            localAnchorB : js.localAnchorB,
        });
        this.addSpring(s);
    }

    // Load contact materials
    for(var i=0; i<json.contactMaterials.length; i++){
        var jm = json.contactMaterials[i];
        var cm = new ContactMaterial(id2material[jm.materialA+""], id2material[jm.materialB+""], {
            friction :              jm.friction,
            restitution :           jm.restitution,
            stiffness :             jm.stiffness,
            relaxation :            jm.relaxation,
            frictionStiffness :     jm.frictionStiffness,
            frictionRelaxation :    jm.frictionRelaxation,
        });
        cm.id = jm.id;
        this.addContactMaterial(cm);
    }

    // Load constraints
    for(var i=0; i<json.constraints.length; i++){
        var jc = json.constraints[i],
            c;
        switch(jc.type){
            case "DistanceConstraint":
                c = new DistanceConstraint(bodies[jc.bodyA], bodies[jc.bodyB], jc.distance, jc.maxForce);
                break;
            case "RevoluteConstraint":
                c = new RevoluteConstraint(bodies[jc.bodyA], jc.pivotA, bodies[jc.bodyB], jc.pivotB, jc.maxForce);
                if(jc.motorSpeed){
                    c.enableMotor();
                    c.setMotorSpeed(jc.motorSpeed);
                }
                c.lowerLimit = jc.lowerLimit || 0;
                c.upperLimit = jc.upperLimit || 0;
                c.lowerLimitEnabled = jc.lowerLimitEnabled || false;
                c.upperLimitEnabled = jc.upperLimitEnabled || false;
                break;
            case "PrismaticConstraint":
                c = new PrismaticConstraint(bodies[jc.bodyA], bodies[jc.bodyB], {
                    maxForce : jc.maxForce,
                    localAxisA : jc.localAxisA,
                    localAnchorA : jc.localAnchorA,
                    localAnchorB : jc.localAnchorB,
                });
                break;
            case "LockConstraint":
                c = new LockConstraint(bodies[jc.bodyA], bodies[jc.bodyB], {
                    maxForce :     jc.maxForce,
                    localOffsetB : jc.localOffsetB,
                    localAngleB :  jc.localAngleB,
                });
                break;
            default:
                throw new Error("Constraint type not recognized: "+jc.type);
        }
        this.addConstraint(c);
    }

    return true;
};

/**
 * Resets the World, removes all bodies, constraints and springs.
 *
 * @method clear
 */
World.prototype.clear = function(){

    this.time = 0;

    // Remove all solver equations
    if(this.solver && this.solver.equations.length)
        this.solver.removeAllEquations();

    // Remove all constraints
    var cs = this.constraints;
    for(var i=cs.length-1; i>=0; i--){
        this.removeConstraint(cs[i]);
    }

    // Remove all bodies
    var bodies = this.bodies;
    for(var i=bodies.length-1; i>=0; i--){
        this.removeBody(bodies[i]);
    }

    // Remove all springs
    var springs = this.springs;
    for(var i=springs.length-1; i>=0; i--){
        this.removeSpring(springs[i]);
    }

    // Remove all contact materials
    var cms = this.contactMaterials;
    for(var i=cms.length-1; i>=0; i--){
        this.removeContactMaterial(cms[i]);
    }
};

/**
 * Get a copy of this World instance
 * @method clone
 * @return {World}
 */
World.prototype.clone = function(){
    var world = new World();
    world.fromJSON(this.toJSON());
    return world;
};

var hitTest_tmp1 = vec2.create(),
    hitTest_zero = vec2.fromValues(0,0),
    hitTest_tmp2 = vec2.fromValues(0,0);

/**
 * Test if a world point overlaps bodies
 * @method hitTest
 * @param  {Array}  worldPoint  Point to use for intersection tests
 * @param  {Array}  bodies      A list of objects to check for intersection
 * @param  {Number} precision   Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
 * @return {Array}              Array of bodies that overlap the point
 */
World.prototype.hitTest = function(worldPoint,bodies,precision){
    precision = precision || 0;

    // Create a dummy particle body with a particle shape to test against the bodies
    var pb = new Body({ position:worldPoint }),
        ps = new Particle(),
        px = worldPoint,
        pa = 0,
        x = hitTest_tmp1,
        zero = hitTest_zero,
        tmp = hitTest_tmp2;
    pb.addShape(ps);

    var n = this.narrowphase,
        result = [];

    // Check bodies
    for(var i=0, N=bodies.length; i!==N; i++){
        var b = bodies[i];
        for(var j=0, NS=b.shapes.length; j!==NS; j++){
            var s = b.shapes[j],
                offset = b.shapeOffsets[j] || zero,
                angle = b.shapeAngles[j] || 0.0;

            // Get shape world position + angle
            vec2.rotate(x, offset, b.angle);
            vec2.add(x, x, b.position);
            var a = angle + b.angle;

            if( (s instanceof Circle    && n.circleParticle  (b,s,x,a,     pb,ps,px,pa, true)) ||
                (s instanceof Convex    && n.particleConvex  (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Plane     && n.particlePlane   (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Capsule   && n.particleCapsule (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Particle  && vec2.squaredLength(vec2.sub(tmp,x,worldPoint)) < precision*precision)
                ){
                result.push(b);
            }
        }
    }

    return result;
};
