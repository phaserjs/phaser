declare class box2d {
    static DEBUG: boolean;
    static ENABLE_ASSERTS: boolean;
    static b2Assert(condition: boolean, opt_message?: string, ...var_args: any[]): void;
    static b2_maxFloat: number;
    static b2_epsilon: number;
    static b2_epsilon_sq: number;
    static b2_pi: number;
    //  The maximum number of contact points between two convex 
    //  shapes. Do not change this value. 
    static b2_maxManifoldPoints: number;
    //  The maximum number of vertices on a convex polygon. You 
    //  cannot increase this too much because b2BlockAllocator has a 
    //  maximum object size. 
    static b2_maxPolygonVertices: number;
    //  This is used to fatten AABBs in the dynamic tree. This allows 
    //  proxies to move by a small amount without triggering a tree 
    //  adjustment. 
    //  This is in meters. 
    static b2_aabbExtension: number;
    //  This is used to fatten AABBs in the dynamic tree. This is 
    //  used to predict the future position based on the current 
    //  displacement. 
    //  This is a dimensionless multiplier. 
    static b2_aabbMultiplier: number;
    //  A small length used as a collision and constraint tolerance. 
    //  Usually it is chosen to be numerically significant, but 
    //  visually insignificant. 
    static b2_linearSlop: number;
    //  A small angle used as a collision and constraint tolerance. 
    //  Usually it is chosen to be numerically significant, but 
    //  visually insignificant. 
    static b2_angularSlop: number;
    //  The radius of the polygon/edge shape skin. This should not be 
    //  modified. Making this smaller means polygons will have an 
    //  insufficient buffer for continuous collision. 
    //  Making it larger may create artifacts for vertex collision.
    static b2_polygonRadius: number;
    //  Maximum number of sub-steps per contact in continuous physics 
    //  simulation. 
    static b2_maxSubSteps: number;
    //  Maximum number of contacts to be handled to solve a TOI 
    //  impact. 
    static b2_maxTOIContacts: number;
    //  A velocity threshold for elastic collisions. Any collision 
    //  with a relative linear velocity below this threshold will be 
    //  treated as inelastic. 
    static b2_velocityThreshold: number;
    //  The maximum linear position correction used when solving 
    //  constraints. This helps to prevent overshoot. 
    static b2_maxLinearCorrection: number;
    //  The maximum angular position correction used when solving 
    //  constraints. This helps to prevent overshoot. 
    static b2_maxAngularCorrection: number;
    //  The maximum linear velocity of a body. This limit is very 
    //  large and is used to prevent numerical problems. You 
    //  shouldn't need to adjust this. 
    static b2_maxTranslation: number;
    static b2_maxTranslationSquared: number;
    //  The maximum angular velocity of a body. This limit is very 
    //  large and is used to prevent numerical problems. You 
    //  shouldn't need to adjust this. 
    static b2_maxRotation: number;
    static b2_maxRotationSquared: number;
    //  This scale factor controls how fast overlap is resolved. 
    //  Ideally this would be 1 so that overlap is removed in one 
    //  time step. However using values close to 1 often lead to 
    //  overshoot. 
    static b2_baumgarte: number;
    static b2_toiBaumgarte: number;
    //  The time that a body must be still before it will go to 
    //  sleep. 
    static b2_timeToSleep: number;
    //  A body cannot sleep if its linear velocity is above this 
    //  tolerance. 
    static b2_linearSleepTolerance: number;
    //  A body cannot sleep if its angular velocity is above this 
    //  tolerance. 
    static b2_angularSleepTolerance: number;
    //  Implement this function to use your own memory allocator. 
    static b2Alloc(size: number): any;
    //  If you implement b2Alloc, you should also implement this 
    //  function. 
    static b2Free(mem: any): void;
    //  Logging function. 
    //  You can modify this to use your logging facility.
    static b2Log(...var_args: any[]): void;
    //  Current version. 
    static b2_version: box2d.b2Version;
    static b2_changelist: number;
    static b2ParseInt(v: string): number;
    static b2ParseUInt(v: string): number;
    static b2MakeArray(length?: number, init?: (length: number) => any): Array<any>;
    static b2MakeNumberArray(length?: number): Array<number>;
    static b2_pi_over_180: number;
    static b2_180_over_pi: number;
    static b2_two_pi: number;
    static b2Abs(n: number): number;
    static b2Min(a: number, b: number): number;
    static b2Max(a: number, b: number): number;
    static b2Clamp(a: number, lo: number, hi: number): number;
    static b2Swap(a: Array<number>, b: Array<number>): void;
    //  This function is used to ensure that a floating point number 
    //  is not a NaN or infinity. 
    static b2IsValid(n: number): boolean;
    static b2Sq(n: number): number;
    //  This is a approximate yet fast inverse square-root. 
    static b2InvSqrt(n: number): number;
    static b2Sqrt(n: number): number;
    static b2Pow(x: number, y: number): number;
    static b2DegToRad(degrees: number): number;
    static b2RadToDeg(radians: number): number;
    static b2Cos(radians: number): number;
    static b2Sin(radians: number): number;
    static b2Acos(n: number): number;
    static b2Asin(n: number): number;
    static b2Atan2(y: number, x: number): number;
    //  Next Largest Power of 2 
    //  Given a binary integer value x, the next largest power of 2 
    //  can be computed by a SWAR algorithm that recursively "folds" 
    //  the upper bits into the lower bits. This process yields a bit 
    //  vector with the same most significant 1 as x, but all 1's 
    //  below it. Adding 1 to that value yields the next largest 
    //  power of 2. For a 32-bit value: 
    static b2NextPowerOfTwo(x: number): number;
    static b2IsPowerOfTwo(x: number): boolean;
    static b2Random(): number;
    static b2RandomRange(lo: number, hi: number): number;
    static b2Vec2_zero: box2d.b2Vec2;
    static b2AbsV(v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MinV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MaxV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2ClampV(v: box2d.b2Vec2, lo: box2d.b2Vec2, hi: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2RotateV(v: box2d.b2Vec2, c: number, s: number, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2RotateRadiansV(v: box2d.b2Vec2, radians: number, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2RotateDegreesV(v: box2d.b2Vec2, degrees: number, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Perform the dot product on two vectors. 
    //  a.x * b.x + a.y * b.y 
    static b2DotVV(a: box2d.b2Vec2, b: box2d.b2Vec2): number;
    //  Perform the cross product on two vectors. In 2D this produces a scalar. 
    //  a.x * b.y - a.y * b.x 
    static b2CrossVV(a: box2d.b2Vec2, b: box2d.b2Vec2): number;
    //  Perform the cross product on a vector and a scalar. In 2D 
    //  this produces a vector. 
    static b2CrossVS(v: box2d.b2Vec2, s: number, out: box2d.b2Vec2): box2d.b2Vec2;
    //  box2d.b2CrossVS(v, 1.0, out) 
    static b2CrossVOne(v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Perform the cross product on a scalar and a vector. In 2D 
    //  this produces a vector. 
    static b2CrossSV(s: number, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  box2d.b2CrossSV(1.0, v, out) 
    static b2CrossOneV(v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Add two vectors component-wise. 
    static b2AddVV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Subtract two vectors component-wise. 
    static b2SubVV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MulSV(s: number, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  out = a + (s * b)
    static b2AddVMulSV(a: box2d.b2Vec2, s: number, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  out = a - (s * b)
    static b2SubVMulSV(a: box2d.b2Vec2, s: number, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  out = a + b2CrossSV(s, v) 
    static b2AddVCrossSV(a: box2d.b2Vec2, s: number, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Get the center of two vectors. 
    static b2MidVV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Get the extent of two vectors (half-widths). 
    static b2ExtVV(a: box2d.b2Vec2, b: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2IsEqualToV(a: box2d.b2Vec2, b: box2d.b2Vec2): boolean;
    static b2DistanceVV(a: box2d.b2Vec2, b: box2d.b2Vec2): number;
    static b2DistanceSquaredVV(a: box2d.b2Vec2, b: box2d.b2Vec2): number;
    static b2NegV(v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Perform the dot product on two vectors. 
    static b2DotV3V3(a: box2d.b2Vec3, b: box2d.b2Vec3): number;
    //  Perform the cross product on two vectors. 
    static b2CrossV3V3(a: box2d.b2Vec3, b: box2d.b2Vec3, out: box2d.b2Vec3): box2d.b2Vec3;
    static b2AbsM(M: box2d.b2Mat22, out: box2d.b2Mat22): box2d.b2Mat22;
    //  Multiply a matrix times a vector. If a rotation matrix is 
    //  provided, then this transforms the vector from one frame to 
    //  another. 
    static b2MulMV(M: box2d.b2Mat22, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Multiply a matrix transpose times a vector. If a rotation 
    //  matrix is provided, then this transforms the vector from one 
    //  frame to another (inverse transform). 
    static b2MulTMV(M: box2d.b2Mat22, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2AddMM(A: box2d.b2Mat22, B: box2d.b2Mat22, out: box2d.b2Mat22): box2d.b2Mat22;
    static b2MulMM(A: box2d.b2Mat22, B: box2d.b2Mat22, out: box2d.b2Mat22): box2d.b2Mat22;
    static b2MulTMM(A: box2d.b2Mat22, B: box2d.b2Mat22, out: box2d.b2Mat22): box2d.b2Mat22;
    //  Multiply a matrix times a vector. 
    static b2MulM33V3(A: box2d.b2Mat33, v: box2d.b2Vec3, out: box2d.b2Vec3): box2d.b2Vec3;
    static b2MulM33XYZ(A: box2d.b2Mat33, x: number, y: number, z: number, out: box2d.b2Vec3): box2d.b2Vec3;
    static b2MulM33V2(A: box2d.b2Mat33, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MulM33XY(A: box2d.b2Mat33, x: number, y: number, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Multiply two rotations: q * r 
    static b2MulRR(q: box2d.b2Rot, r: box2d.b2Rot, out: box2d.b2Rot): box2d.b2Rot;
    //  Transpose multiply two rotations: qT * r 
    static b2MulTRR(q: box2d.b2Rot, r: box2d.b2Rot, out: box2d.b2Rot): box2d.b2Rot;
    //  Rotate a vector 
    static b2MulRV(q: box2d.b2Rot, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  Inverse rotate a vector 
    static b2MulTRV(q: box2d.b2Rot, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MulXV(T: box2d.b2Transform, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    static b2MulTXV(T: box2d.b2Transform, v: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    //  v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
    //     = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
    static b2MulXX(A: box2d.b2Transform, B: box2d.b2Transform, out: box2d.b2Transform): box2d.b2Transform;
    //  v2 = A.q' * (B.q * v1 + B.p - A.p)
    //     = A.q' * B.q * v1 + A.q' * (B.p - A.p)
    static b2MulTXX(A: box2d.b2Transform, B: box2d.b2Transform, out: box2d.b2Transform): box2d.b2Transform;
    static b2_gjkCalls: number;
    static b2_gjkIters: number;
    static b2_gjkMaxIters: number;
    //  Compute the closest points between two shapes. Supports any combination of:
    //  box2d.b2CircleShape, box2d.b2PolygonShape, box2d.b2EdgeShape. The simplex cache is input/output.
    //  On the first call set box2d.b2SimplexCache.count to zero.
    static b2Distance(output: box2d.b2DistanceOutput, cache: box2d.b2SimplexCache, input: box2d.b2DistanceInput): void;
    //  Compute the point states given two manifolds. The states 
    //  pertain to the transition from manifold1 to manifold2. So 
    //  state1 is either persist or remove while state2 is either add 
    //  or persist. 
    static b2GetPointStates(state1: Array<box2d.b2PointState>, state2: Array<box2d.b2PointState>, manifold1: box2d.b2Manifold, manifold2: box2d.b2Manifold): void;
    static b2TestOverlapAABB(a: box2d.b2AABB, b: box2d.b2AABB): boolean;
    //  Clipping for contact manifolds. 
    //  Sutherland-Hodgman clipping. 
    static b2ClipSegmentToLine(vOut: Array<box2d.b2ClipVertex>, vIn: Array<box2d.b2ClipVertex>, normal: box2d.b2Vec2, offset: number, vertexIndexA: number): number;
    static b2TestOverlapShape(shapeA: box2d.b2Shape, shapeB: box2d.b2Shape, xfA: box2d.b2Transform, xfB: box2d.b2Transform): boolean;
    static b2_toiTime: number;
    static b2_toiMaxTime: number;
    static b2_toiCalls: number;
    static b2_toiIters: number;
    static b2_toiMaxIters: number;
    static b2_toiRootIters: number;
    static b2_toiMaxRootIters: number;
    //  Compute the upper bound on time before two shapes penetrate. 
    //  Time is represented as a fraction between [0,tMax]. This uses
    //  a swept separating axis and may miss some intermediate, 
    //  non-tunneling collision. If you change the time interval, you 
    //  should call this function again. 
    //  Note: use box2d.b2Distance to compute the contact point and 
    //  normal at the time of impact. 
    static b2TimeOfImpact(output: box2d.b2TOIOutput, input: box2d.b2TOIInput): void;
    //  Friction mixing law. The idea is to allow either fixture to
    //  drive the restitution to zero. For example, anything slides
    //  on ice.
    static b2MixFriction(friction1: number, friction2: number): number;
    //  Restitution mixing law. The idea is allow for anything to
    //  bounce off an inelastic surface. For example, a superball
    //  bounces on anything.
    static b2MixRestitution(restitution1: number, restitution2: number): number;
    //  Compute the collision manifold between an edge and a circle. 
    //  Compute contact points for edge versus circle. 
    //  This accounts for edge connectivity.
    static b2CollideEdgeAndCircle(manifold: box2d.b2Manifold, edgeA: box2d.b2EdgeShape, xfA: box2d.b2Transform, circleB: box2d.b2CircleShape, xfB: box2d.b2Transform): void;
    //  Compute the collision manifold between an edge and a polygon.
    static b2CollideEdgeAndPolygon(manifold: box2d.b2Manifold, edgeA: box2d.b2EdgeShape, xfA: box2d.b2Transform, polygonB: box2d.b2PolygonShape, xfB: box2d.b2Transform): void;
    //  Find the max separation between poly1 and poly2 using edge
    //  normals from poly1.
    static b2FindMaxSeparation(edgeIndex: Array<number>, poly1: box2d.b2PolygonShape, xf1: box2d.b2Transform, poly2: box2d.b2PolygonShape, xf2: box2d.b2Transform): number;
    static b2FindIncidentEdge(c: Array<box2d.b2ClipVertex>, poly1: box2d.b2PolygonShape, xf1: box2d.b2Transform, edge1: number, poly2: box2d.b2PolygonShape, xf2: box2d.b2Transform): void;
    //  Find edge normal of max separation on A - return if separating axis is found
    //  Find edge normal of max separation on B - return if separation axis is found
    //  Choose reference edge as min(minA, minB)
    //  Find incident edge
    //  Clip
    //  The normal points from 1 to 2
    static b2CollidePolygons(manifold: box2d.b2Manifold, polyA: box2d.b2PolygonShape, xfA: box2d.b2Transform, polyB: box2d.b2PolygonShape, xfB: box2d.b2Transform): void;
    //  Compute the collision manifold between two circles. 
    static b2CollideCircles(manifold: box2d.b2Manifold, circleA: box2d.b2CircleShape, xfA: box2d.b2Transform, circleB: box2d.b2CircleShape, xfB: box2d.b2Transform): void;
    //  Compute the collision manifold between a polygon and a 
    //  circle. 
    static b2CollidePolygonAndCircle(manifold: box2d.b2Manifold, polygonA: box2d.b2PolygonShape, xfA: box2d.b2Transform, circleB: box2d.b2CircleShape, xfB: box2d.b2Transform): void;
    //  This is used to sort pairs. 
    static b2PairLessThan(pair1: box2d.b2Pair, pair2: box2d.b2Pair): number;
    static b2_minPulleyLength: number;
}


declare module box2d {
    enum b2JointType {
        e_unknownJoint = 0,
        e_revoluteJoint = 1,
        e_prismaticJoint = 2,
        e_distanceJoint = 3,
        e_pulleyJoint = 4,
        e_mouseJoint = 5,
        e_gearJoint = 6,
        e_wheelJoint = 7,
        e_weldJoint = 8,
        e_frictionJoint = 9,
        e_ropeJoint = 10,
        e_motorJoint = 11,
        e_areaJoint = 12
    }

    enum b2LimitState {
        e_inactiveLimit = 0,
        e_atLowerLimit = 1,
        e_atUpperLimit = 2,
        e_equalLimits = 3
    }

    enum b2ContactFeatureType {
        e_vertex = 0,
        e_face = 1
    }

    enum b2ManifoldType {
        e_unknown = -1,
        e_circles = 0,
        e_faceA = 1,
        e_faceB = 2
    }

    //  This is used for determining the state of contact points. 
    enum b2PointState {
        b2_nullState = 0, ///< point does not exist
        b2_addState = 1, ///< point was added in the update
        b2_persistState = 2, ///< point persisted across the update
        b2_removeState = 3  ///< point was removed in the update
    }

    enum b2TOIOutputState {
        e_unknown = 0,
        e_failed = 1,
        e_overlapped = 2,
        e_touching = 3,
        e_separated = 4
    }

    enum b2SeparationFunctionType {
        e_unknown = -1,
        e_points = 0,
        e_faceA = 1,
        e_faceB = 2
    }

    //  Flags stored in m_flags
    enum b2ContactFlag {
        e_none = 0,
        e_islandFlag = 0x0001, /// Used when crawling contact graph when forming islands.
        e_touchingFlag = 0x0002, /// Set when the shapes are touching.
        e_enabledFlag = 0x0004, /// This contact can be disabled (by user)
        e_filterFlag = 0x0008, /// This contact needs filtering because a fixture filter was changed.
        e_bulletHitFlag = 0x0010, /// This bullet contact had a TOI event
        e_toiFlag = 0x0020  /// This contact has a valid TOI in m_toi
    }

    enum b2ShapeType {
        e_unknown = -1,
        e_circleShape = 0,
        e_edgeShape = 1,
        e_polygonShape = 2,
        e_chainShape = 3,
        e_shapeTypeCount = 4
    }

    enum b2EPAxisType {
        e_unknown = 0,
        e_edgeA = 1,
        e_edgeB = 2
    }

    enum b2EPColliderVertexType {
        e_isolated = 0,
        e_concave = 1,
        e_convex = 2
    }

    enum b2DrawFlags {
        e_none = 0,
        e_shapeBit = 0x0001, ///< draw shapes
        e_jointBit = 0x0002, ///< draw joint connections
        e_aabbBit = 0x0004, ///< draw axis aligned bounding boxes
        e_pairBit = 0x0008, ///< draw broad-phase pairs
        e_centerOfMassBit = 0x0010, ///< draw center of mass frame
        e_controllerBit = 0x0020, /// @see box2d.b2Controller list
        e_all = 0x003f
    }

    //  The body type.
    //  enum= zero mass, zero velocity, may be manually moved
    //  kinematic= zero mass, non-zero velocity set by user, moved by solver
    //  dynamic= positive mass, non-zero velocity determined by forces, moved by solver
    enum b2BodyType {
        b2_unknown = -1,
        b2_staticBody = 0,
        b2_kinematicBody = 1,
        b2_dynamicBody = 2,
        b2_bulletBody = 3 // TODO_ERIN
    }

    enum b2BodyFlag {
        e_none = 0,
        e_islandFlag = 0x0001,
        e_awakeFlag = 0x0002,
        e_autoSleepFlag = 0x0004,
        e_bulletFlag = 0x0008,
        e_fixedRotationFlag = 0x0010,
        e_activeFlag = 0x0020,
        e_toiFlag = 0x0040
    }

    enum b2WorldFlag {
        e_none = 0,
        e_newFixture = 0x1,
        e_locked = 0x2,
        e_clearForces = 0x4
    }


    class b2Version {
        //  Version numberinf scheme See 
        //  http://en.wikipedia.org/wiki/Software_versioning 
        constructor(major?: number, minor?: number, revision?: number);
        major: number;
        minor: number;
        revision: number;
        toString(): string;
    }


    class b2Vec2 {
        //  A 2D column vector. 
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        static ZERO: b2Vec2;
        static UNITX: b2Vec2;
        static UNITY: b2Vec2;
        static s_t0: b2Vec2;
        static s_t1: b2Vec2;
        static s_t2: b2Vec2;
        static s_t3: b2Vec2;
        static MakeArray(length?: number): Array<b2Vec2>;
        Clone(): b2Vec2;
        //  Set this vector to all zeros. 
        SetZero(): b2Vec2;
        //  Set this vector to some specified coordinates. 
        SetXY(x: number, y: number): b2Vec2;
        Copy(other: b2Vec2): b2Vec2;
        //  Add a vector to this vector. 
        SelfAdd(v: b2Vec2): b2Vec2;
        SelfAddXY(x: number, y: number): b2Vec2;
        //  Subtract a vector from this vector. 
        SelfSub(v: b2Vec2): b2Vec2;
        SelfSubXY(x: number, y: number): b2Vec2;
        //  Multiply this vector by a scalar. 
        SelfMul(s: number): b2Vec2;
        //  this += s * v 
        SelfMulAdd(s: number, v: b2Vec2): b2Vec2;
        //  this -= s * v 
        SelfMulSub(s: number, v: b2Vec2): b2Vec2;
        Dot(v: b2Vec2): number;
        Cross(v: b2Vec2): number;
        //  Get the length of this vector (the norm). 
        Length(): number;
        GetLength(): number;
        //  Get the length squared. For performance, use this instead of 
        //  b2Vec2::Length (if possible). 
        LengthSquared(): number;
        GetLengthSquared(): number;
        //  Convert this vector into a unit vector. Returns the length. 
        Normalize(): number;
        SelfNormalize(): b2Vec2;
        SelfRotate(c: number, s: number): b2Vec2;
        SelfRotateRadians(radians: number): b2Vec2;
        SelfRotateDegrees(degrees: number): b2Vec2;
        //  Does this vector contain finite coordinates? 
        IsValid(): boolean;
        SelfCrossVS(s: number): b2Vec2;
        SelfCrossSV(s: number): b2Vec2;
        SelfMinV(v: b2Vec2): b2Vec2;
        SelfMaxV(v: b2Vec2): b2Vec2;
        SelfAbs(): b2Vec2;
        SelfNeg(): b2Vec2;
        //  Get the skew vector such that dot(skew_vec, other) === 
        //  cross(vec, other) 
        SelfSkew(): b2Vec2;
    }


    class b2Vec3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        static ZERO: b2Vec3;
        static s_t0: b2Vec3;
        Clone(): b2Vec3;
        SetZero(): b2Vec3;
        SetXYZ(x: number, y: number, z: number): b2Vec3;
        Copy(other: b2Vec3): b2Vec3;
        SelfNeg(): b2Vec3;
        SelfAdd(v: b2Vec3): b2Vec3;
        SelfAddXYZ(x: number, y: number, z: number): b2Vec3;
        SelfSub(v: b2Vec3): b2Vec3;
        SelfSubXYZ(x: number, y: number, z: number): b2Vec3;
        SelfMul(s: number): b2Vec3;
    }


    class b2Mat22 {
        //  A 2-by-2 matrix. Stored in column-major order. 
        constructor();
        ex: b2Vec2;
        ey: b2Vec2;
        static IDENTITY: b2Mat22;
        Clone(): b2Mat22;
        //  Construct this matrix using columns. 
        static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        //  Construct this matrix using scalars. 
        static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        //  Construct this matrix using an angle. This matrix becomes an 
        //  orthonormal rotation matrix. 
        static FromAngleRadians(radians: number): b2Mat22;
        //  Initialize this matrix using scalars. 
        SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        //  Initialize this matrix using columns. 
        SetVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        //  Initialize this matrix using an angle. This matrix becomes an 
        //  orthonormal rotation matrix. 
        SetAngle(radians: number): b2Mat22;
        Copy(other: b2Mat22): b2Mat22;
        //  Set this to the identity matrix. 
        SetIdentity(): b2Mat22;
        //  Set this matrix to all zeros. 
        SetZero(): b2Mat22;
        //  Extract the angle from this matrix (assumed to be a rotation 
        //  matrix). 
        GetAngle(): number;
        GetInverse(out: b2Mat22): b2Mat22;
        //  Solve A * x = b, where b is a column vector. This is more 
        //  efficient than computing the inverse in one-shot cases. 
        Solve(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        SelfAbs(): b2Mat22;
        SelfInv(): b2Mat22;
        SelfAddM(M: b2Mat22): b2Mat22;
        SelfSubM(M: b2Mat22): b2Mat22;
    }


    class b2Mat33 {
        //  A 3-by-3 matrix. Stored in column-major order. 
        constructor();
        ex: b2Vec3;
        ey: b2Vec3;
        ez: b2Vec3;
        static IDENTITY: b2Mat33;
        Clone(): b2Mat33;
        SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): b2Mat33;
        Copy(other: b2Mat33): b2Mat33;
        SetIdentity(): b2Mat33;
        //  Set this matrix to all zeros. 
        SetZero(): b2Mat33;
        SelfAddM(M: b2Mat33): b2Mat33;
        //  Solve A * x = b, where b is a column vector. This is more 
        //  efficient than computing the inverse in one-shot cases. 
        Solve33(b_x: number, b_y: number, b_z: number, out: b2Vec3): b2Vec3;
        //  Solve A * x = b, where b is a column vector. This is more 
        //  efficient than computing the inverse in one-shot cases. Solve 
        //  only the upper 2-by-2 matrix equation. 
        Solve22(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        //  Get the inverse of this matrix as a 2-by-2. 
        //  Returns the zero matrix if singular.
        GetInverse22(M: b2Mat33): void;
        //  Get the symmetric inverse of this matrix as a 3-by-3. 
        //  Returns the zero matrix if singular.
        GetSymInverse33(M: b2Mat33): void;
    }


    class b2Rot {
        //  Rotation 
        //  Initialize from an angle in radians 
        constructor(angle?: number);
        angle: number;
        s: number;
        c: number;
        static IDENTITY: b2Rot;
        Clone(): b2Rot;
        Copy(other: b2Rot): b2Rot;
        //  Set using an angle in radians. 
        SetAngle(angle: number): b2Rot;
        //  Set to the identity rotation 
        SetIdentity(): b2Rot;
        //  Get the angle in radians 
        GetAngle(): number;
        //  Get the x-axis 
        GetXAxis(out: b2Vec2): b2Vec2;
        //  Get the y-axis 
        GetYAxis(out: b2Vec2): b2Vec2;
    }


    class b2Transform {
        //  A transform contains translation and rotation. It is used to 
        //  represent the position and orientation of rigid frames. 
        constructor();
        p: b2Vec2;
        q: b2Rot;
        static IDENTITY: b2Transform;
        Clone(): b2Transform;
        Copy(other: b2Transform): b2Transform;
        //  Set this to the identity transform. 
        SetIdentity(): b2Transform;
        //  Set this based on the position and angle. 
        SetPositionRotation(position: b2Vec2, q: b2Rot): b2Transform;
        SetPositionAngleRadians(pos: b2Vec2, a: number): b2Transform;
        SetPosition(position: b2Vec2): b2Transform;
        SetPositionXY(x: number, y: number): b2Transform;
        SetRotation(rotation: b2Rot): b2Transform;
        SetRotationAngleRadians(radians: number): b2Transform;
        GetPosition(): b2Vec2;
        GetRotation(): b2Rot;
        GetRotationAngle(): number;
        GetAngle(): number;
    }


    class b2Sweep {
        //  This describes the motion of a body/shape for TOI computation.
        //  Shapes are defined with respect to the body origin, which may
        //  no coincide with the center of mass. However, to support dynamics
        //  we must interpolate the center of mass position.
        constructor();
        localCenter: b2Vec2;
        c0: b2Vec2;
        c: b2Vec2;
        a0: number;
        a: number;
        //  Fraction of the current time step in the range [0,1]
        //  c0 and a0 are the positions at alpha0.
        alpha0: number;
        Clone(): b2Sweep;
        Copy(other: b2Sweep): b2Sweep;
        //  Get the interpolated transform at a specific time. 
        GetTransform(xf: b2Transform, beta: number): b2Transform;
        //  Advance the sweep forward, yielding a new initial state. 
        Advance(alpha: number): void;
        //  Normalize an angle in radians to be between -pi and pi 
        //  (actually 0 and 2*pi) 
        Normalize(): void;
    }


    class b2ControllerEdge {
        //  A controller edge is used to connect bodies and controllers 
        //  together in a bipartite graph. 
        constructor();
        controller: b2Controller;
        body: b2Body;
        prevBody: b2ControllerEdge;
        nextBody: b2ControllerEdge;
        prevController: b2ControllerEdge;
        nextController: b2ControllerEdge;
    }


    class b2Controller {
        //  Base class for controllers. Controllers are a convience for 
        //  encapsulating common per-step functionality. 
        constructor();
        m_world: b2World;
        m_bodyList: b2ControllerEdge;
        m_bodyCount: number;
        m_prev: b2Controller;
        m_next: b2Controller;
        //  Controllers override this to implement per-step 
        //  functionality. 
        Step(step: b2TimeStep): void;
        //  Controllers override this to provide debug drawing. 
        Draw(debugDraw: b2Draw): void;
        //  Get the next controller in the world's body list. 
        GetNext(): b2Controller;
        //  Get the previous controller in the world's body list. 
        GetPrev(): b2Controller;
        //  Get the parent world of this body. 
        GetWorld(): b2World;
        //  Get the attached body list 
        GetBodyList(): b2ControllerEdge;
        //  Adds a body to the controller list. 
        AddBody(body: b2Body): void;
        //  Removes a body from the controller list. 
        RemoveBody(body: b2Body): void;
        //  Removes all bodies from the controller list. 
        Clear(): void;
    }


    class b2ConstantAccelController extends b2Controller {
        //  Applies a force every frame 
        constructor();
        //  The acceleration to apply 
        A: b2Vec2;
        Step(step: b2TimeStep): void;
        //  The force to apply 
        F: b2Vec2;
    }


    class b2Jacobian {
        constructor();
        linear: b2Vec2;
        angularA: number;
        angularB: number;
        SetZero(): b2Jacobian;
        Set(x: b2Vec2, a1: number, a2: number): b2Jacobian;
    }


    class b2JointEdge {
        //  A joint edge is used to connect bodies and joints together in 
        //  a joint graph where each body is a node and each joint is an 
        //  edge. A joint edge belongs to a doubly linked list maintained 
        //  in each attached body. Each joint has two joint nodes, one 
        //  for each attached body. 
        constructor();
        other: b2Body;
        joint: b2Joint;
        prev: b2JointEdge;
        next: b2JointEdge;
    }


    class b2JointDef {
        //  Joint definitions are used to construct joints. 
        constructor(type: b2JointType);
        //  The joint type is set automatically for concrete joint types.
        type: b2JointType;
        //  Use this to attach application specific data to your joints. 
        userData: any;
        //  The first attached body. 
        bodyA: b2Body;
        //  The second attached body. 
        bodyB: b2Body;
        //  Set this flag to true if the attached bodies should collide. 
        collideConnected: boolean;
    }


    class b2Joint {
        //  The base joint class. Joints are used to constraint two 
        //  bodies together in various fashions. Some joints also feature 
        //  limits and motors. 
        constructor();
        m_type: b2JointType;
        m_prev: b2Joint;
        m_next: b2Joint;
        m_edgeA: b2JointEdge;
        m_edgeB: b2JointEdge;
        m_bodyA: b2Body;
        m_bodyB: b2Body;
        m_index: number;
        m_islandFlag: boolean;
        m_collideConnected: boolean;
        m_userData: any;
        //  Get the anchor point on bodyA in world coordinates. 
        GetAnchorA(out: b2Vec2): b2Vec2;
        //  Get the anchor point on bodyB in world coordinates. 
        GetAnchorB(out: b2Vec2): b2Vec2;
        //  Get the reaction force on bodyB at the joint anchor in 
        //  Newtons. 
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        //  Get the reaction torque on bodyB in N*m. 
        GetReactionTorque(inv_dt: number): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        //  This returns true if the position errors are within 
        //  tolerance. 
        SolvePositionConstraints(data: b2SolverData): boolean;
        //  Get the type of the concrete joint. 
        GetType(): b2JointType;
        //  Get the first body attached to this joint. 
        GetBodyA(): b2Body;
        //  Get the second body attached to this joint. 
        GetBodyB(): b2Body;
        //  Get the next joint the world joint list. 
        GetNext(): b2Joint;
        //  Get the user data pointer. 
        GetUserData(): any;
        //  Set the user data pointer. 
        SetUserData(data: any): void;
        //  Get collide connected. 
        //  Note: modifying the collide connect flag won't work correctly 
        //  because the flag is only checked when fixture AABBs begin to 
        //  overlap. 
        GetCollideConnected(): boolean;
        //  Dump this joint to the log file. 
        Dump(): void;
        //  Short-cut function to determine if either body is inactive. 
        IsActive(): boolean;
        //  Shift the origin for any points stored in world coordinates. 
        ShiftOrigin(newOrigin: b2Vec2): void;
    }


    class b2RevoluteJointDef extends b2JointDef {
        //  Revolute joint definition. This requires defining an anchor 
        //  point where the bodies are joined. The definition uses local 
        //  anchor points so that the initial configuration can violate 
        //  the constraint slightly. You also need to specify the initial 
        //  relative angle for joint limits. This helps when saving and 
        //  loading a game. 
        //  The local anchor points are measured from the body's origin 
        //  rather than the center of mass because: 
        //  1. you might not know where the center of mass will be. 
        //  2. if you add/remove shapes from a body and recompute the 
        //  mass, the joints will be broken. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The bodyB angle minus bodyA angle in the reference state 
        //  (radians). 
        referenceAngle: number;
        //  A flag to enable joint limits. 
        enableLimit: boolean;
        //  The lower angle for the joint limit (radians). 
        lowerAngle: number;
        //  The upper angle for the joint limit (radians). 
        upperAngle: number;
        //  A flag to enable the joint motor. 
        enableMotor: boolean;
        //  The desired motor speed. Usually in radians per second. 
        motorSpeed: number;
        //  The maximum motor torque used to achieve the desired motor 
        //  speed. 
        //  Usually in N-m. 
        maxMotorTorque: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }


    class b2RevoluteJoint extends b2Joint {
        //  A revolute joint constrains two bodies to share a common 
        //  point while they are free to rotate about the point. The 
        //  relative rotation about the shared point is the joint angle. 
        //  You can limit the relative rotation with a joint limit that 
        //  specifies a lower and upper angle. You can use a motor to 
        //  drive the relative rotation about the shared point. A maximum 
        //  motor torque is provided so that infinite forces are not 
        //  generated. 
        constructor(def: b2RevoluteJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_impulse: b2Vec3;
        m_motorImpulse: number;
        m_enableMotor: boolean;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_referenceAngle: number;
        m_lowerAngle: number;
        m_upperAngle: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_motorMass: number;
        m_limitState: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        //  Get the reaction force given the inverse time step. 
        //  Unit is N.
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        //  Get the reaction torque due to the joint limit given the 
        //  inverse time step. 
        //  Unit is N*m. 
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out?: b2Vec2): b2Vec2;
        //  Get the reference angle. 
        GetReferenceAngle(): number;
        GetJointAngleRadians(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        //  Get the current motor torque given the inverse time step. 
        //  Unit is N*m. 
        GetMotorTorque(inv_dt: number): number;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        SetMotorSpeed(speed: number): void;
        //  Dump to b2Log. 
        Dump(): void;
    }


    class b2PrismaticJointDef extends b2JointDef {
        //  Prismatic joint definition. This requires defining a line of 
        //  motion using an axis and an anchor point. The definition uses 
        //  local anchor points and a local axis so that the initial 
        //  configuration can violate the constraint slightly. The joint 
        //  translation is zero when the local anchor points coincide in 
        //  world space. Using local anchors and a local axis helps when 
        //  saving and loading a game. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The local translation unit axis in bodyA. 
        localAxisA: b2Vec2;
        //  The constrained angle between the bodies: bodyB_angle - 
        //  bodyA_angle. 
        referenceAngle: number;
        //  Enable/disable the joint limit. 
        enableLimit: boolean;
        //  The lower translation limit, usually in meters. 
        lowerTranslation: number;
        //  The upper translation limit, usually in meters. 
        upperTranslation: number;
        //  Enable/disable the joint motor. 
        enableMotor: boolean;
        //  The maximum motor torque, usually in N-m. 
        maxMotorForce: number;
        //  The desired motor speed in radians per second. 
        motorSpeed: number;
        //  Initialize the bodies, anchors, axis, and reference angle 
        //  using the world anchor and unit world axis. 
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }


    class b2PrismaticJoint extends b2Joint {
        //  A prismatic joint. This joint provides one degree of freedom: 
        //  translation along an axis fixed in bodyA. Relative rotation 
        //  is prevented. You can use a joint limit to restrict the range 
        //  of motion and a joint motor to drive the motion or to model 
        //  joint friction. 
        constructor(def: b2PrismaticJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_referenceAngle: number;
        m_impulse: b2Vec3;
        m_motorImpulse: number;
        m_lowerTranslation: number;
        m_upperTranslation: number;
        m_maxMotorForce: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_enableMotor: boolean;
        m_limitState: b2LimitState;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_axis: b2Vec2;
        m_perp: b2Vec2;
        m_s1: number;
        m_s2: number;
        m_a1: number;
        m_a2: number;
        m_K: b2Mat33;
        m_K3: b2Mat33;
        m_K2: b2Mat22;
        m_motorMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        //  The local joint axis relative to bodyA. 
        GetLocalAxisA(out: b2Vec2): b2Vec2;
        //  Get the reference angle. 
        GetReferenceAngle(): number;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(upper: number, lower: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: number): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: number): number;
        //  Dump to b2Log 
        Dump(): void;
    }


    class b2GearJointDef extends b2JointDef {
        //  Gear joint definition. This definition requires two existing 
        //  revolute or prismatic joints (any combination will work). 
        constructor();
        //  The first revolute/prismatic joint attached to the gear 
        //  joint. 
        joint1: b2Joint;
        //  The second revolute/prismatic joint attached to the gear 
        //  joint. 
        joint2: b2Joint;
        //  The gear ratio. 
        ratio: number;
    }


    class b2GearJoint extends b2Joint {
        //  A gear joint is used to connect two joints together. Either 
        //  joint can be a revolute or prismatic joint. You specify a 
        //  gear ratio to bind the motions together: 
        //  coordinateA + ratio * coordinateB = constant 
        //  The ratio can be negative or positive. If one joint is a 
        //  revolute joint and the other joint is a prismatic joint, then 
        //  the ratio will have units of length or units of 1/length. 
        //  warning You have to manually destroy the gear joint if jointA 
        //  or jointB is destroyed. 
        constructor(def: b2GearJointDef);
        m_joint1: b2Joint;
        m_joint2: b2Joint;
        m_typeA: b2JointType;
        m_typeB: b2JointType;
        m_bodyC: b2Body;
        m_bodyD: b2Body;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localAnchorC: b2Vec2;
        m_localAnchorD: b2Vec2;
        m_localAxisC: b2Vec2;
        m_localAxisD: b2Vec2;
        m_referenceAngleA: number;
        m_referenceAngleB: number;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_indexC: number;
        m_indexD: number;
        m_lcA: b2Vec2;
        m_lcB: b2Vec2;
        m_lcC: b2Vec2;
        m_lcD: b2Vec2;
        m_mA: number;
        m_mB: number;
        m_mC: number;
        m_mD: number;
        m_iA: number;
        m_iB: number;
        m_iC: number;
        m_iD: number;
        m_JvAC: b2Vec2;
        m_JvBD: b2Vec2;
        m_JwA: number;
        m_JwB: number;
        m_JwC: number;
        m_JwD: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_qC: b2Rot;
        m_qD: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_lalcC: b2Vec2;
        m_lalcD: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  Get the first joint. 
        GetJoint1(): b2Joint;
        //  Get the second joint. 
        GetJoint2(): b2Joint;
        GetRatio(): number;
        SetRatio(ratio: number): void;
        //  Dump joint to dmLog 
        Dump(): void;
    }


    class b2DistanceProxy {
        //  A distance proxy is used by the GJK algorithm. 
        //  It encapsulates any shape.
        constructor();
        m_buffer: Array<b2Vec2>;
        m_vertices: Array<b2Vec2>;
        m_count: number;
        m_radius: number;
        Reset(): b2DistanceProxy;
        //  Initialize the proxy using the given shape. The shape must 
        //  remain in scope while the proxy is in use. 
        SetShape(shape: b2Shape, index: number): void;
        //  Get the supporting vertex index in the given direction. 
        GetSupport(d: b2Vec2): number;
        //  Get the supporting vertex in the given direction. 
        GetSupportVertex(d: b2Vec2, out: b2Vec2): b2Vec2;
        //  Get the vertex count. 
        GetVertexCount(): number;
        //  Get a vertex by index. Used by box2d.b2Distance. 
        GetVertex(index: number): b2Vec2;
    }


    class b2SimplexCache {
        //  Used to warm start box2d.b2Distance. 
        //  Set count to zero on first call.
        constructor();
        metric: number;
        count: number;
        indexA: Array<number>;
        indexB: Array<number>;
        Reset(): b2SimplexCache;
    }


    class b2DistanceInput {
        //  Input for box2d.b2Distance. 
        //  You have to option to use the shape radii in the computation. 
        constructor();
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        transformA: b2Transform;
        transformB: b2Transform;
        useRadii: boolean;
        Reset(): b2DistanceInput;
    }


    class b2DistanceOutput {
        //  Output for box2d.b2Distance. 
        constructor();
        pointA: b2Vec2;
        pointB: b2Vec2;
        distance: number;
        iterations: number;
        Reset(): b2DistanceOutput;
    }


    class b2SimplexVertex {
        constructor();
        wA: b2Vec2;
        wB: b2Vec2;
        w: b2Vec2;
        a: number;
        indexA: number;
        indexB: number;
        Copy(other: b2SimplexVertex): b2SimplexVertex;
    }


    class b2Simplex {
        constructor();
        m_v1: b2SimplexVertex;
        m_v2: b2SimplexVertex;
        m_v3: b2SimplexVertex;
        m_vertices: Array<b2SimplexVertex>;
        m_count: number;
        ReadCache(cache: b2SimplexCache, proxyA: b2DistanceProxy, transformA: b2Transform, proxyB: b2DistanceProxy, transformB: b2Transform): void;
        WriteCache(cache: b2SimplexCache): void;
        GetSearchDirection(out: b2Vec2): b2Vec2;
        GetClosestPoint(out: b2Vec2): b2Vec2;
        GetWitnessPoints(pA: b2Vec2, pB: b2Vec2): void;
        GetMetric(): number;
        //  Solve a line segment using barycentric coordinates.
        // 
        //  p = a1 * w1 + a2 * w2
        //  a1 + a2 = 1
        // 
        //  The vector from the origin to the closest point on the line is
        //  perpendicular to the line.
        //  e12 = w2 - w1
        //  dot(p, e) = 0
        //  a1 * dot(w1, e) + a2 * dot(w2, e) = 0
        // 
        //  2-by-2 linear system
        //  [1      1     ][a1] = [1]
        //  [w1.e12 w2.e12][a2] = [0]
        // 
        //  Define
        //  d12_1 =  dot(w2, e12)
        //  d12_2 = -dot(w1, e12)
        //  d12 = d12_1 + d12_2
        // 
        //  Solution
        //  a1 = d12_1 / d12
        //  a2 = d12_2 / d12
        //   
        Solve2(): void;
        //  Possible regions:
        //  - points[2]
        //  - edge points[0]-points[2]
        //  - edge points[1]-points[2]
        //  - inside the triangle
        Solve3(): void;
    }


    class b2WeldJointDef extends b2JointDef {
        //  Weld joint definition. You need to specify local anchor 
        //  points where they are attached and the relative body angle. 
        //  The position of the anchor points is important for computing 
        //  the reaction torque. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The bodyB angle minus bodyA angle in the reference state 
        //  (radians). 
        referenceAngle: number;
        //  The mass-spring-damper frequency in Hertz. Rotation only. 
        //  Disable softness with a value of 0. 
        frequencyHz: number;
        //  The damping ratio. 0 = no damping, 1 = critical damping. 
        dampingRatio: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }


    class b2WeldJoint extends b2Joint {
        //  A weld joint essentially glues two bodies together. A weld 
        //  joint may distort somewhat because the island constraint 
        //  solver is approximate. 
        constructor(def: b2WeldJointDef);
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_referenceAngle: number;
        m_gamma: number;
        m_impulse: b2Vec3;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat33;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        //  Get the reference angle. 
        GetReferenceAngle(): number;
        //  Set/get frequency in Hz. 
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        //  Set/get damping ratio. 
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        //  Dump to b2Log 
        Dump(): void;
    }


    class b2RopeJointDef extends b2JointDef {
        //  Rope joint definition. This requires two body anchor points 
        //  and a maximum lengths. 
        //  Note: by default the connected objects will not collide. see 
        //  collideConnected in box2d.b2JointDef. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The maximum length of the rope. 
        //  Warning: this must be larger than box2d.b2_linearSlop or the 
        //  joint will have no effect. 
        maxLength: number;
    }


    class b2RopeJoint extends b2Joint {
        //  A rope joint enforces a maximum distance between two points 
        //  on two bodies. It has no other effect. 
        //  Warning: if you attempt to change the maximum length during 
        //  the simulation you will get some non-physical behavior. A 
        //  model that would allow you to dynamically modify the length 
        //  would have some sponginess, so I chose not to implement it 
        //  that way. See box2d.b2DistanceJoint if you want to 
        //  dynamically control length. 
        constructor(def: b2RopeJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_maxLength: number;
        m_length: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_state: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        //  Set/Get the maximum length of the rope. 
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLimitState(): b2LimitState;
        //  Dump joint to dmLog 
        Dump(): void;
    }


    class b2GravityController extends b2Controller {
        //  Applies simplified gravity between every pair of bodies 
        constructor();
        //  Specifies the strength of the gravitiation force 
        G: number;
        //  If true, gravity is proportional to r^-2, otherwise r^-1 
        invSqr: boolean;
        Step(step: b2TimeStep): void;
    }


    class b2Profile {
        //  Profiling data. Times are in milliseconds. 
        constructor();
        step: number;
        collide: number;
        solve: number;
        solveInit: number;
        solveVelocity: number;
        solvePosition: number;
        broadphase: number;
        solveTOI: number;
        Reset(): b2Profile;
    }


    class b2TimeStep {
        //  This is an internal structure. 
        constructor();
        dt: number;
        inv_dt: number;
        dtRatio: number;
        velocityIterations: number;
        positionIterations: number;
        warmStarting: boolean;
        Copy(step: b2TimeStep): b2TimeStep;
    }


    class b2Position {
        //  This is an internal structure. 
        constructor();
        c: b2Vec2;
        a: number;
        static MakeArray(length: number): Array<b2Position>;
    }


    class b2Velocity {
        //  This is an internal structure. 
        constructor();
        v: b2Vec2;
        w: number;
        static MakeArray(length: number): Array<b2Velocity>;
    }


    class b2SolverData {
        //  Solver Data 
        constructor();
        step: b2TimeStep;
        positions: Array<b2Position>;
        velocities: Array<b2Velocity>;
    }


    class b2ContactFeature {
        //  The features that intersect to form the contact point 
        //  This must be 4 bytes or less.
        constructor(id: b2ContactID);
        _id: b2ContactID;
        _indexA: number;
        _indexB: number;
        _typeA: number;
        _typeB: number;

        indexA: number;
        indexB: number;
        typeA: number;
        typeB: number;
    }


    class b2ContactID {
        //  Contact ids to facilitate warm starting. 
        constructor();
        cf: b2ContactFeature;
        key: number;
        Copy(o: b2ContactID): b2ContactID;
        Clone(): b2ContactID;
    }


    class b2ManifoldPoint {
        //  A manifold point is a contact point belonging to a contact
        //  manifold. It holds details related to the geometry and dynamics
        //  of the contact points.
        //  The local point usage depends on the manifold type:
        //  -e_circles: the local center of circleB
        //  -e_faceA: the local center of cirlceB or the clip point of polygonB
        //  -e_faceB: the clip point of polygonA
        //  This structure is stored across time steps, so we keep it small.
        //  Note: the impulses are used for internal caching and may not
        //  provide reliable contact forces, especially for high speed collisions.
        constructor();
        localPoint: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        id: b2ContactID;
        static MakeArray(length: number): Array<b2ManifoldPoint>;
        Reset(): void;
        Copy(o: b2ManifoldPoint): b2ManifoldPoint;
    }


    class b2Manifold {
        //  A manifold for two touching convex shapes.
        //  Box2D supports multiple types of contact:
        //  - clip point versus plane with radius
        //  - point versus point with radius (circles)
        //  The local point usage depends on the manifold type:
        //  -e_circles: the local center of circleA
        //  -e_faceA: the center of faceA
        //  -e_faceB: the center of faceB
        //  Similarly the local normal usage:
        //  -e_circles: not used
        //  -e_faceA: the normal on polygonA
        //  -e_faceB: the normal on polygonB
        //  We store contacts in this way so that position correction can
        //  account for movement, which is critical for continuous physics.
        //  All contact scenarios must be expressed in one of these types.
        //  This structure is stored across time steps, so we keep it small.
        constructor();
        points: Array<b2ManifoldPoint>;
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        type: b2ManifoldType;
        pointCount: number;
        Reset(): void;
        Copy(o: b2Manifold): b2Manifold;
        Clone(): b2Manifold;
    }


    class b2WorldManifold {
        //  This is used to compute the current state of a contact 
        //  manifold. 
        constructor();
        normal: b2Vec2;
        points: Array<b2Vec2>;
        separations: Array<number>;
        //  Evaluate the manifold with supplied transforms. This assumes 
        //  modest motion from the original state. This does not change 
        //  the point count, impulses, etc. The radii must come from the 
        //  shapes that generated the manifold. 
        Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: number, xfB: b2Transform, radiusB: number): void;
    }


    class b2ClipVertex {
        //  Used for computing contact manifolds. 
        constructor();
        v: b2Vec2;
        id: b2ContactID;
        static MakeArray(length?: number): Array<b2ClipVertex>;
        Copy(other: b2ClipVertex): b2ClipVertex;
    }


    class b2RayCastInput {
        //  Ray-cast input data. The ray extends from p1 to p1 + 
        //  maxFraction * (p2 - p1). 
        constructor();
        p1: b2Vec2;
        p2: b2Vec2;
        maxFraction: number;
        Copy(o: b2RayCastInput): b2RayCastInput;
    }


    class b2RayCastOutput {
        //  Ray-cast output data. The ray hits at p1 + fraction * (p2 - 
        //  p1), where p1 and p2 come from box2d.b2RayCastInput. 
        constructor();
        normal: b2Vec2;
        fraction: number;
        Copy(o: b2RayCastOutput): b2RayCastOutput;
    }


    class b2AABB {
        //  An axis aligned bounding box. 
        constructor();
        lowerBound: b2Vec2;
        upperBound: b2Vec2;
        m_out_center: b2Vec2;
        m_out_extent: b2Vec2;
        Copy(o: b2AABB): b2AABB;
        //  Verify that the bounds are sorted. 
        IsValid(): boolean;
        //  Get the center of the AABB. 
        GetCenter(): b2Vec2;
        //  Get the extents of the AABB (half-widths). 
        GetExtents(): b2Vec2;
        //  Get the perimeter length 
        GetPerimeter(): number;
        //  Combine an AABB into this one. 
        Combine1(aabb: b2AABB): b2AABB;
        //  Combine two AABBs into this one. 
        Combine2(aabb1: b2AABB, aabb2: b2AABB): b2AABB;
        static Combine(aabb1: b2AABB, aabb2: b2AABB, out: b2AABB): b2AABB;
        //  Does this aabb contain the provided AABB. 
        Contains(aabb: b2AABB): boolean;
        //  From Real-time Collision Detection, p179. 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
        TestOverlap(other: b2AABB): boolean;
    }


    class b2Timer {
        //  Timer for profiling. This has platform specific code and may 
        //  not work on every platform. 
        constructor();
        m_start: number;
        Reset(): b2Timer;
        GetMilliseconds(): number;
    }


    class b2Counter {
        constructor();
        m_count: number;
        m_min_count: number;
        m_max_count: number;
        GetCount(): number;
        GetMinCount(): number;
        GetMaxCount(): number;
        ResetCount(): number;
        ResetMinCount(): void;
        ResetMaxCount(): void;
        Increment(): void;
        Decrement(): void;
    }


    class b2TOIInput {
        //  Input parameters for b2TimeOfImpact 
        constructor();
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        sweepA: b2Sweep;
        sweepB: b2Sweep;
        tMax: number;
    }


    class b2TOIOutput {
        //  Output parameters for b2TimeOfImpact. 
        constructor();
        state: b2TOIOutputState;
        t: number;
    }


    class b2SeparationFunction {
        constructor();
        m_proxyA: b2DistanceProxy;
        m_proxyB: b2DistanceProxy;
        m_sweepA: b2Sweep;
        m_sweepB: b2Sweep;
        m_type: b2SeparationFunctionType;
        m_localPoint: b2Vec2;
        m_axis: b2Vec2;
        //  TODO_ERIN might not need to return the separation 
        Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number;
        FindMinSeparation(indexA: Array<number>, indexB: Array<number>, t: number): number;
        Evaluate(indexA: number, indexB: number, t: number): number;
    }


    class b2ContactEdge {
        //  A contact edge is used to connect bodies and contacts
        //  together in a contact graph where each body is a node and
        //  each contact is an edge. A contact edge belongs to a doubly
        //  linked list maintained in each attached body. Each contact
        //  has two contact nodes, one for each attached body.
        constructor();
        other: b2Body;
        contact: b2Contact;
        prev: b2ContactEdge;
        next: b2ContactEdge;
    }


    class b2Contact {
        //  The class manages contact between two shapes. A contact
        //  exists for each overlapping AABB in the broad-phase (except
        //  if filtered). Therefore a contact object may exist that has
        //  no contact points.
        constructor();
        m_flags: b2ContactFlag;
        //  World pool and list pointers.
        m_prev: b2Contact;
        m_next: b2Contact;
        //  Nodes for connecting bodies.
        m_nodeA: b2ContactEdge;
        m_nodeB: b2ContactEdge;
        m_fixtureA: b2Fixture;
        m_fixtureB: b2Fixture;
        m_indexA: number;
        m_indexB: number;
        m_manifold: b2Manifold;
        m_toiCount: number;
        m_toi: number;
        m_friction: number;
        m_restitution: number;
        m_tangentSpeed: number;
        m_oldManifold: b2Manifold;
        //  Get the contact manifold. Do not modify the manifold unless
        //  you understand the internals of Box2D.
        GetManifold(): b2Manifold;
        //  Get the world manifold.
        GetWorldManifold(worldManifold: b2WorldManifold): void;
        //  Is this contact touching?
        IsTouching(): boolean;
        //  Enable/disable this contact. This can be used inside the
        //  pre-solve contact listener. The contact is only disabled for
        //  the current time step (or sub-step in continuous collisions).
        SetEnabled(flag: boolean): void;
        //  Has this contact been disabled?
        IsEnabled(): boolean;
        //  Get the next contact in the world's contact list.
        GetNext(): b2Contact;
        //  Get fixture A in this contact.
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): number;
        //  Get fixture B in this contact.
        GetFixtureB(): b2Fixture;
        GetChildIndexB(): number;
        //  Evaluate this contact with your own manifold and transforms.
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
        //  Flag this contact for filtering. Filtering will occur the
        //  next time step.
        FlagForFiltering(): void;
        //  Override the default friction mixture. You can call this in
        //  box2d.b2ContactListener::PreSolve.
        //  This value persists until set or reset.
        SetFriction(friction: number): void;
        //  Get the friction.
        GetFriction(): number;
        //  Reset the friction mixture to the default value.
        ResetFriction(): void;
        //  Override the default restitution mixture. You can call this
        //  in box2d.b2ContactListener::PreSolve.
        //  The value persists until you set or reset.
        SetRestitution(restitution: number): void;
        //  Get the restitution.
        GetRestitution(): number;
        //  Reset the restitution to the default value.
        ResetRestitution(): void;
        //  Set the desired tangent speed for a conveyor belt behavior.
        //  In meters per second.
        SetTangentSpeed(speed: number): void;
        //  Get the desired tangent speed. In meters per second.
        GetTangentSpeed(): number;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        //  Update the contact manifold and touching status.
        //  Note: do not assume the fixture AABBs are overlapping or are
        //  valid.
        Update(listener: b2ContactListener): void;
        ComputeTOI(sweepA: b2Sweep, sweepB: b2Sweep): number;
    }


    class b2PolygonAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2EdgeAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2MassData {
        //  This holds the mass data computed for a shape. 
        constructor();
        //  The mass of the shape, usually in kilograms. 
        mass: number;
        //  The position of the shape's centroid relative to the shape's 
        //  origin. 
        center: b2Vec2;
        //  The rotational inertia of the shape about the local origin. 
        I: number;
    }


    class b2Shape {
        //  A shape is used for collision detection. You can create a 
        //  shape however you like. 
        //  Shapes used for simulation in box2d.b2World are created 
        //  automatically when a box2d.b2Fixture is created. Shapes may 
        //  encapsulate a one or more child shapes. 
        constructor(type: b2ShapeType, radius: number);
        m_type: b2ShapeType;
        m_radius: number;
        //  Clone the concrete shape using the provided allocator. 
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        //  Get the type of this shape. You can use this to down cast to 
        //  the concrete shape. 
        GetType(): b2ShapeType;
        //  Get the number of child primitives. 
        GetChildCount(): number;
        //  Test a point for containment in this shape. This only works 
        //  for convex shapes. 
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        //  Cast a ray against a child shape. 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        //  Given a transform, compute the associated axis aligned 
        //  bounding box for a child shape. 
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        //  Compute the mass properties of this shape using its 
        //  dimensions and density. 
        //  The inertia tensor is computed about the local origin.
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        //  Dump this shape to the log file. 
        Dump(): void;
    }


    class b2PolygonShape extends b2Shape {
        //  A convex polygon. It is assumed that the interior of the 
        //  polygon is to the left of each edge. 
        //  Polygons have a maximum number of vertices equal to 
        //  box2d.b2_maxPolygonVertices. In most cases you should not 
        //  need many vertices for a convex polygon. 
        constructor();
        m_centroid: b2Vec2;
        m_vertices: Array<b2Vec2>;
        m_normals: Array<b2Vec2>;
        m_count: number;
        //  Implement box2d.b2Shape. 
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        //  Build vertices to represent an axis-aligned box centered on 
        //  the local origin. 
        SetAsBox(hx: number, hy: number): b2PolygonShape;
        //  Build vertices to represent an oriented box. 
        SetAsOrientedBox(hx: number, hy: number, center: b2Vec2, angle: number): b2PolygonShape;
        //  Create a convex hull from the given array of local points.
        //  The count must be in the range [3, b2_maxPolygonVertices].
        //  warning the points may be re-ordered, even if they form a 
        //  convex polygon 
        //  warning collinear points are handled but not removed. 
        //  Collinear points may lead to poor stacking behavior. 
        Set(vertices: Array<b2Vec2>, count?: number): b2PolygonShape;
        SetAsVector(vertices: Array<b2Vec2>, count?: number): b2PolygonShape;
        SetAsArray(vertices: Array<b2Vec2>, count?: number): b2PolygonShape;
        //  Implement box2d.b2Shape. 
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        //  Implement box2d.b2Shape. 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        //  Validate convexity. This is a very time consuming operation. 
        Validate(): boolean;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        //  Dump this shape to the log file. 
        Dump(): void;
        static ComputeCentroid(vs: Array<b2Vec2>, count: number, out: b2Vec2): b2Vec2;
    }


    class b2EPAxis {
        //  This structure is used to keep track of the best separating 
        //  axis. 
        constructor();
        type: b2EPAxisType;
        index: number;
        separation: number;
    }


    class b2TempPolygon {
        //  This holds polygon B expressed in frame A. 
        constructor();
        vertices: Array<b2Vec2>;
        normals: Array<b2Vec2>;
        count: number;
    }


    class b2ReferenceFace {
        //  Reference face used for clipping 
        constructor();
        i1: number;
        i2: number;
        v1: b2Vec2;
        v2: b2Vec2;
        normal: b2Vec2;
        sideNormal1: b2Vec2;
        sideOffset1: number;
        sideNormal2: b2Vec2;
        sideOffset2: number;
    }


    class b2EPCollider {
        //  This class collides and edge and a polygon, taking into 
        //  account edge adjacency. 
        constructor();
        m_polygonB: b2TempPolygon;
        m_xf: b2Transform;
        m_centroidB: b2Vec2;
        m_v0: b2Vec2;
        m_v1: b2Vec2;
        m_v2: b2Vec2;
        m_v3: b2Vec2;
        m_normal0: b2Vec2;
        m_normal1: b2Vec2;
        m_normal2: b2Vec2;
        m_normal: b2Vec2;
        m_type1: b2EPColliderVertexType;
        m_type2: b2EPColliderVertexType;
        m_lowerLimit: b2Vec2;
        m_upperLimit: b2Vec2;
        m_radius: number;
        m_front: boolean;
        //  Algorithm:
        //  1. Classify v1 and v2
        //  2. Classify polygon centroid as front or back
        //  3. Flip normal if necessary
        //  4. Initialize normal range to [-pi, pi] about face normal
        //  5. Adjust normal range according to adjacent edges
        //  6. Visit each separating axes, only accept axes within the range
        //  7. Return if _any_ axis indicates separation
        //  8. Clip
        Collide(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform): void;
        ComputeEdgeSeparation(out: b2EPAxis): b2EPAxis;
        ComputePolygonSeparation(out: b2EPAxis): b2EPAxis;
    }


    class b2EdgeShape extends b2Shape {
        //  A line segment (edge) shape. These can be connected in chains 
        //  or loops to other edge shapes. The connectivity information 
        //  is used to ensure correct contact normals. 
        constructor();
        //  These are the edge vertices 
        m_vertex1: b2Vec2;
        m_vertex2: b2Vec2;
        //  Optional adjacent vertices. These are used for smooth 
        //  collision. 
        m_vertex0: b2Vec2;
        m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
        //  Set this as an isolated edge. 
        Set(v1: b2Vec2, v2: b2Vec2): b2EdgeShape;
        //  Implement box2d.b2Shape. 
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        //  Implement box2d.b2Shape.
        //  p = p1 + t * d
        //  v = v1 + s * e
        //  p1 + t * d = v1 + s * e
        //  s * e - t * d = p1 - v1
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        //  Dump this shape to the log file. 
        Dump(): void;
    }


    class b2ChainShape extends b2Shape {
        //  A chain shape is a free form sequence of line segments.
        //  The chain has two-sided collision, so you can use inside and outside collision.
        //  Therefore, you may use any winding order.
        //  Since there may be many vertices, they are allocated using b2Alloc.
        //  Connectivity information is used to create smooth collisions.
        //  WARNING: The chain will not collide properly if there are self-intersections.
        constructor();
        //  The vertices. Owned by this class. 
        m_vertices: Array<b2Vec2>;
        //  The vertex count. 
        m_count: number;
        m_prevVertex: b2Vec2;
        m_nextVertex: b2Vec2;
        m_hasPrevVertex: boolean;
        m_hasNextVertex: boolean;
        //  Create a loop. This automatically adjusts connectivity. 
        CreateLoop(vertices: Array<b2Vec2>, count?: number): b2ChainShape;
        //  Create a chain with isolated end vertices. 
        CreateChain(vertices: Array<b2Vec2>, count?: number): b2ChainShape;
        //  Establish connectivity to a vertex that precedes the first vertex.
        //  Don't call this for loops.
        SetPrevVertex(prevVertex: b2Vec2): b2ChainShape;
        //  Establish connectivity to a vertex that follows the last vertex.
        //  Don't call this for loops.
        SetNextVertex(nextVertex: b2Vec2): b2ChainShape;
        //  Implement box2d.b2Shape. Vertices are cloned using b2Alloc. 
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetChildCount(): number;
        //  Get a child edge. 
        GetChildEdge(edge: b2EdgeShape, index: number): void;
        //  This always return false.
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        //  Implement box2d.b2Shape. 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        static s_edgeShape: b2EdgeShape;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        //  Dump this shape to the log file. 
        Dump(): void;
    }


    class b2ChainAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2PolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2CircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2ChainAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2EdgeAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }


    class b2VelocityConstraintPoint {
        constructor();
        rA: b2Vec2;
        rB: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
        static MakeArray(length: number): Array<b2VelocityConstraintPoint>;
    }


    class b2ContactVelocityConstraint {
        constructor();
        points: Array<b2VelocityConstraintPoint>;
        normal: b2Vec2;
        tangent: b2Vec2;
        normalMass: b2Mat22;
        K: b2Mat22;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        invIA: number;
        invIB: number;
        friction: number;
        restitution: number;
        tangentSpeed: number;
        pointCount: number;
        contactIndex: number;
        static MakeArray(length: number): Array<b2ContactVelocityConstraint>;
    }


    class b2ContactPositionConstraint {
        constructor();
        localPoints: Array<b2Vec2>;
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        localCenterA: b2Vec2;
        localCenterB: b2Vec2;
        invIA: number;
        invIB: number;
        type: b2ManifoldType;
        radiusA: number;
        radiusB: number;
        pointCount: number;
        static MakeArray(length: number): Array<b2ContactPositionConstraint>;
    }


    class b2ContactSolverDef {
        constructor();
        step: b2TimeStep;
        contacts: Array<b2Contact>;
        count: number;
        positions: Array<b2Position>;
        velocities: Array<b2Velocity>;
        allocator: any;
    }


    class b2ContactSolver {
        constructor();
        m_step: b2TimeStep;
        m_positions: Array<b2Position>;
        m_velocities: Array<b2Velocity>;
        m_allocator: any;
        m_positionConstraints: Array<b2ContactPositionConstraint>;
        m_velocityConstraints: Array<b2ContactVelocityConstraint>;
        m_contacts: Array<b2Contact>;
        m_count: number;
        Initialize(def: b2ContactSolverDef): b2ContactSolver;
        //  Initialize position dependent portions of the velocity 
        //  constraints. 
        InitializeVelocityConstraints(): void;
        WarmStart(): void;
        SolveVelocityConstraints(): void;
        StoreImpulses(): void;
        //  Sequential solver. 
        SolvePositionConstraints(): boolean;
        //  Sequential position solver for position constraints. 
        SolveTOIPositionConstraints(toiIndexA: number, toiIndexB: number): boolean;
    }


    class b2PositionSolverManifold {
        constructor();
        normal: b2Vec2;
        point: b2Vec2;
        separation: number;
        Initialize(pc: b2ContactPositionConstraint, xfA: b2Transform, xfB: b2Transform, index: number): void;
    }


    class b2DestructionListener {
        //  Joints and fixtures are destroyed when their associated body 
        //  is destroyed. Implement this listener so that you may nullify 
        //  references to these joints and shapes. 
        constructor();
        //  Called when any joint is about to be destroyed due to the 
        //  destruction of one of its attached bodies. 
        SayGoodbyeJoint(joint: b2Joint): void;
        //  Called when any fixture is about to be destroyed due to the 
        //  destruction of its parent body. 
        SayGoodbyeFixture(fixture: b2Fixture): void;
    }


    class b2ContactFilter {
        //  Implement this class to provide collision filtering. In other 
        //  words, you can implement this class if you want finer control 
        //  over contact creation. 
        constructor();
        //  Return true if contact calculations should be performed 
        //  between these two shapes. 
        //  warning for performance reasons this is only called when the 
        //  AABBs begin to overlap. 
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
    }


    class b2ContactImpulse {
        //  Contact impulses for reporting. Impulses are used instead of 
        //  forces because sub-step forces may approach infinity for 
        //  rigid body collisions. These match up one-to-one with the 
        //  contact points in b2Manifold. 
        constructor();

        normalImpulses: Array<number>;
        tangentImpulses: Array<number>;
        count:number;
    }


    class b2ContactListener {
        //  Implement this class to get contact information. You can use 
        //  these results for things like sounds and game logic. You can 
        //  also get contact results by traversing the contact lists 
        //  after the time step. However, you might miss some contacts 
        //  because continuous physics leads to sub-stepping. 
        //  Additionally you may receive multiple callbacks for the same 
        //  contact in a single time step. 
        //  You should strive to make your callbacks efficient because 
        //  there may be many callbacks per time step. 
        //  warning You cannot create/destroy Box2D entities inside these 
        //  callbacks. 
        constructor();
        //  Called when two fixtures begin to touch. 
        BeginContact(contact: b2Contact): void;
        //  Called when two fixtures cease to touch. 
        EndContact(contact: b2Contact): void;
        //  This is called after a contact is updated. This allows you to 
        //  inspect a contact before it goes to the solver. If you are 
        //  careful, you can modify the contact manifold (e.g. disable 
        //  contact). 
        //  A copy of the old manifold is provided so that you can detect 
        //  changes. 
        //  Note: this is called only for awake bodies. 
        //  Note: this is called even when the number of contact points 
        //  is zero. 
        //  Note: this is not called for sensors. 
        //  Note: if you set the number of contact points to zero, you 
        //  will not get an EndContact callback. However, you may get a 
        //  BeginContact callback the next step. 
        PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
        //  This lets you inspect a contact after the solver is finished. 
        //  This is useful for inspecting impulses. 
        //  Note: the contact manifold does not include time of impact 
        //  impulses, which can be arbitrarily large if the sub-step is 
        //  small. Hence the impulse is provided explicitly in a separate 
        //  data structure. 
        //  Note: this is only called for contacts that are touching, 
        //  solid, and awake. 
        PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
        static b2_defaultListener: b2ContactListener;
    }


    class b2QueryCallback {
        //  Callback class for AABB queries. 
        //  See b2World::Query 
        constructor();
        //  Called for each fixture found in the query AABB. 
        ReportFixture(): boolean;
    }


    class b2RayCastCallback {
        //  Callback class for ray casts. 
        //  See b2World::RayCast 
        constructor();
        //  Called for each fixture found in the query. You control how 
        //  the ray cast proceeds by returning a float: 
        //  return -1: ignore this fixture and continue 
        //  return 0: terminate the ray cast 
        //  return fraction: clip the ray to this point 
        //  return 1: don't clip the ray and continue
        //   	  of intersection
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    }


    class b2Island {
        //  This is an internal class. 
        constructor();
        m_allocator: any;
        m_listener: b2ContactListener;
        m_bodies: Array<b2Body>;
        m_contacts: Array<b2Contact>;
        m_joints: Array<b2Joint>;
        m_positions: Array<b2Position>;
        m_velocities: Array<b2Velocity>;
        m_bodyCount: number;
        m_jointCount: number;
        m_contactCount: number;
        m_bodyCapacity: number;
        m_contactCapacity: number;
        m_jointCapacity: number;
        Initialize(bodyCapacity: number, contactCapacity: number, jointCapacity: number, allocator: any, listener: b2ContactListener): void;
        Clear(): void;
        AddBody(body: b2Body): void;
        AddContact(contact: b2Contact): void;
        AddJoint(joint: b2Joint): void;
        Solve(profile: b2Profile, step: b2TimeStep, gravity: b2Vec2, allowSleep: boolean): void;
        SolveTOI(subStep: b2TimeStep, toiIndexA: number, toiIndexB: number): void;
        Report(constraints: Array<b2ContactVelocityConstraint>): void;
    }


    class b2ContactRegister {
        constructor();
    }


    class b2ContactFactory {
        constructor(allocator: any);
        AddType(createFcn: Function, destroyFcn: Function, type1: b2ShapeType, type2: b2ShapeType): void;
        InitializeRegisters(): void;
        Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact;
        Destroy(contact: b2Contact): void;
    }


    class b2GrowableStack {
        //  This is a growable LIFO stack with an initial capacity of N. 
        //  If the stack size exceeds the initial capacity, the heap is 
        //  used to increase the size of the stack. 
        constructor(N: number);
        m_stack: Array<any>;
        m_count: number;
        Reset(): b2GrowableStack;
        Push(element: any): void;
        Pop(): any;
        GetCount(): number;
    }


    class b2TreeNode {
        //  A node in the dynamic tree. The client does not interact with 
        //  this directly. 
        constructor(id?: number);
        m_id: number;
        //  Enlarged AABB 
        aabb: b2AABB;
        userData: any;
        parent: b2TreeNode;
        child1: b2TreeNode;
        child2: b2TreeNode;
        //  leaf = 0, free node = -1 
        height: number;
        IsLeaf(): boolean;
    }


    class b2DynamicTree {
        //  A dynamic tree arranges data in a binary tree to accelerate
        //  queries such as volume queries and ray casts. Leafs are proxies
        //  with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor
        //  so that the proxy AABB is bigger than the client object. This allows the client
        //  object to move by small amounts without triggering a tree update.
        // 
        //  Nodes are pooled and relocatable, so we use node indices rather than pointers.
        constructor();
        m_root: b2TreeNode;
        m_freeList: b2TreeNode;
        //  This is used to incrementally traverse the tree for 
        //  re-balancing. 
        m_path: number;
        m_insertionCount: number;
        //  Get proxy user data. 
        GetUserData(proxy: b2TreeNode): any;
        //  Get the fat AABB for a proxy. 
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        //  Query an AABB for overlapping proxies. The callback class is 
        //  called for each proxy that overlaps the supplied AABB. 
        Query(callback: (treeNode: b2TreeNode) => boolean, aabb: b2AABB): void;
        //  Ray-cast against the proxies in the tree. This relies on the callback
        //  to perform a exact ray-cast in the case were the proxy contains a shape.
        //  The callback also performs the any collision filtering. This has performance
        //  roughly equal to k * log(n), where k is the number of collisions and n is the
        //  number of proxies in the tree.
        RayCast(callback: (raycastInput: b2RayCastInput, treeNode: b2TreeNode) => number, input: b2RayCastInput): void;
        AllocateNode(): b2TreeNode;
        FreeNode(node: b2TreeNode): void;
        //  Create a proxy. Provide a tight fitting AABB and a userData 
        //  pointer. 
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        //  Destroy a proxy. This asserts if the id is invalid. 
        DestroyProxy(proxy: b2TreeNode): void;
        //  Move a proxy with a swepted AABB. If the proxy has moved 
        //  outside of its fattened AABB, then the proxy is removed from 
        //  the tree and re-inserted. Otherwise the function returns 
        //  immediately. 
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): boolean;
        InsertLeaf(leaf: b2TreeNode): void;
        RemoveLeaf(leaf: b2TreeNode): void;
        //  Perform a left or right rotation if node A is imbalanced.
        //  Returns the new root index.
        Balance(A: b2TreeNode): b2TreeNode;
        //  Compute the height of the binary tree in O(N) time. Should 
        //  not be called often. 
        GetHeight(): number;
        //  Get the ratio of the sum of the node areas to the root area. 
        GetAreaRatio(): number;
        //  Compute the height of a sub-tree. 
        ComputeHeightNode(node: b2TreeNode): number;
        ComputeHeight(): number;
        ValidateStructure(index: b2TreeNode): void;
        ValidateMetrics(index: b2TreeNode): void;
        //  Validate this tree. For testing. 
        Validate(): void;
        //  Get the maximum balance of an node in the tree. The balance 
        //  is the difference in height of the two children of a node. 
        GetMaxBalance(): number;
        //  Build an optimal tree. Very expensive. For testing. 
        RebuildBottomUp(): void;
        //  Shift the world origin. Useful for large worlds.
        //  The shift formula is: position -= newOrigin
        ShiftOrigin(newOrigin: b2Vec2): void;
    }


    class b2Pair {
        constructor();
        proxyA: b2TreeNode;
        proxyB: b2TreeNode;
    }


    class b2BroadPhase {
        //  The broad-phase is used for computing pairs and performing 
        //  volume queries and ray casts. This broad-phase does not 
        //  persist pairs. Instead, this reports potentially new pairs. 
        //  It is up to the client to consume the new pairs and to track 
        //  subsequent overlap. 
        constructor();
        m_tree: b2DynamicTree;
        m_proxyCount: number;
        m_moveCount: number;
        m_moveBuffer: Array<b2TreeNode>;
        m_pairCount: number;
        m_pairBuffer: Array<b2Pair>;
        //  Create a proxy with an initial AABB. Pairs are not reported 
        //  until UpdatePairs is called. 
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        //  Destroy a proxy. It is up to the client to remove any pairs. 
        DestroyProxy(proxy: b2TreeNode): void;
        //  Call MoveProxy as many times as you like, then when you are 
        //  done call UpdatePairs to finalized the proxy pairs (for your 
        //  time step). 
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): void;
        //  Call to trigger a re-processing of it's pairs on the next 
        //  call to UpdatePairs. 
        TouchProxy(proxy: b2TreeNode): void;
        //  Get the fat AABB for a proxy. 
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        //  Get user data from a proxy. Returns NULL if the id is 
        //  invalid. 
        GetUserData(proxy: b2TreeNode): any;
        //  Test overlap of fat AABBs. 
        TestOverlap(proxyA: b2TreeNode, proxyB: b2TreeNode): boolean;
        //  Get the number of proxies. 
        GetProxyCount(): number;
        //  Get the height of the embedded tree. 
        GetTreeHeight(): number;
        //  Get the balance of the embedded tree. 
        GetTreeBalance(): number;
        //  Get the quality metric of the embedded tree. 
        GetTreeQuality(): number;
        //  Shift the world origin. Useful for large worlds. The shift 
        //  formula is: position -= newOrigin 
        ShiftOrigin(newOrigin: b2Vec2): void;
        //  Update the pairs. This results in pair callbacks. This can 
        //  only add pairs. 
        UpdatePairs(contactManager: any): void;
        //  Query an AABB for overlapping proxies. The callback class is 
        //  called for each proxy that overlaps the supplied AABB. 
        Query(callback: Function, aabb: b2AABB): void;
        //  Ray-cast against the proxies in the tree. This relies on the 
        //  callback to perform a exact ray-cast in the case were the 
        //  proxy contains a shape. The callback also performs the any 
        //  collision filtering. This has performance roughly equal to k 
        //  * log(n), where k is the number of collisions and n is the 
        //  number of proxies in the tree.
        RayCast(callback: Function, input: b2RayCastInput): void;
        BufferMove(proxy: b2TreeNode): void;
        UnBufferMove(proxy: b2TreeNode): void;
    }


    class b2ContactManager {
        //  Delegate of box2d.b2World. 
        constructor();
        m_broadPhase: b2BroadPhase;
        m_contactList: b2Contact;
        m_contactCount: number;
        m_contactFilter: b2ContactFilter;
        m_contactListener: b2ContactListener;
        m_allocator: any;
        m_contactFactory: b2ContactFactory;
        Destroy(c: b2Contact): void;
        //  This is the top level collision call for the time step. Here 
        //  all the narrow phase collision is processed for the world 
        //  contact list. 
        Collide(): void;
        FindNewContacts(): void;
        //  Broad-phase callback. 
        AddPair(proxyUserDataA: b2FixtureProxy, proxyUserDataB: b2FixtureProxy): void;
    }


    class b2JointFactory {
        static Create(def: b2JointDef, allocator: any): b2Joint;
        static Destroy(joint: b2Joint, allocator: any): void;
    }


    class b2Color {
        //  Color for debug drawing. Each value has the range [0,1]. 
        constructor(rr: number, gg: number, bb: number);
        r: number;
        g: number;
        b: number;
        SetRGB(rr: number, gg: number, bb: number): b2Color;
        static MakeStyleString(): string;
        static RED: b2Color;
        static GREEN: b2Color;
        static BLUE: b2Color;
    }


    class b2Draw {
        //  Implement and register this class with a b2World to provide 
        //  debug drawing of physics entities in your game. 
        constructor();
        m_drawFlags: b2DrawFlags;
        //  Set the drawing flags. 
        SetFlags(flags: b2DrawFlags): void;
        //  Get the drawing flags. 
        GetFlags(): b2DrawFlags;
        //  Append flags to the current flags. 
        AppendFlags(flags: b2DrawFlags): void;
        //  Clear flags from the current flags. 
        ClearFlags(flags: b2DrawFlags): void;
        PushTransform(xf: b2Transform): void;
        PopTransform(xf: b2Transform): void;
        //  Draw a closed polygon provided in CCW order. 
        DrawPolygon(vertices: Array<b2Vec2>, vertexCount: number, color: b2Color): void;
        //  Draw a solid closed polygon provided in CCW order. 
        DrawSolidPolygon(vertices: Array<b2Vec2>, vertexCount: number, color: b2Color): void;
        //  Draw a circle. 
        DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
        //  Draw a solid circle. 
        DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
        //  Draw a line segment. 
        DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
        //  Draw a transform. Choose your own length scale. 
        DrawTransform(xf: b2Transform): void;
    }


    class b2Filter {
        //  This holds contact filtering data. 
        constructor();
        //  The collision category bits. Normally you would just set one 
        //  bit. 
        categoryBits: number;
        //  The collision mask bits. This states the categories that this 
        //  shape would accept for collision. 
        maskBits: number;
        //  Collision groups allow a certain group of objects to never 
        //  collide (negative) or always collide (positive). Zero means 
        //  no collision group. Non-zero group filtering always wins 
        //  against the mask bits. 
        groupIndex: number;
        Clone(): b2Filter;
        Copy(other: b2Filter): b2Filter;
    }


    class b2FixtureDef {
        //  A fixture definition is used to create a fixture. This class 
        //  defines an abstract fixture definition. You can reuse fixture 
        //  definitions safely. 
        constructor();
        //  The shape, this must be set. The shape will be cloned, so you 
        //  can create the shape on the stack. 
        shape: b2Shape;
        //  Use this to store application specific fixture data. 
        userData: any;
        //  The friction coefficient, usually in the range [0,1]. 
        friction: number;
        //  The restitution (elasticity) usually in the range [0,1]. 
        restitution: number;
        //  The density, usually in kg/m^2. 
        density: number;
        //  A sensor shape collects contact information but never 
        //  generates a collision response. 
        isSensor: boolean;
        //  Contact filtering data. 
        filter: b2Filter;
    }


    class b2FixtureProxy {
        //  This proxy is used internally to connect fixtures to the 
        //  broad-phase. 
        constructor();
        aabb: b2AABB;
        fixture: b2Fixture;
        childIndex: number;
        proxy: b2TreeNode;
        static MakeArray(length: number): Array<b2FixtureProxy>;
    }


    class b2Fixture {
        //  A fixture is used to attach a shape to a body for collision 
        //  detection. A fixture inherits its transform from its parent. 
        //  Fixtures hold additional non-geometric data such as friction, 
        //  collision filters, etc. 
        //  Fixtures are created via box2d.b2Body::CreateFixture. 
        //  warning you cannot reuse fixtures.
        constructor();
        m_density: number;
        m_next: b2Fixture;
        m_body: b2Body;
        m_shape: b2Shape;
        m_friction: number;
        m_restitution: number;
        m_proxies: Array<b2FixtureProxy>;
        m_proxyCount: number;
        m_filter: b2Filter;
        m_isSensor: boolean;
        m_userData: any;
        //  Get the type of the child shape. You can use this to down 
        //  cast to the concrete shape. 
        GetType(): b2ShapeType;
        //  Get the child shape. You can modify the child shape, however 
        //  you should not change the number of vertices because this 
        //  will crash some collision caching mechanisms. 
        //  Manipulating the shape may lead to non-physical behavior.
        GetShape(): b2Shape;
        //  Is this fixture a sensor (non-solid)? 
        IsSensor(): boolean;
        //  Get the contact filtering data. 
        GetFilterData(): b2Filter;
        //  Get the user data that was assigned in the fixture 
        //  definition. Use this to store your application specific data.
        GetUserData(): any;
        //  Set the user data. Use this to store your application 
        //  specific data. 
        SetUserData(data: any): void;
        //  Get the parent body of this fixture. This is NULL if the 
        //  fixture is not attached. 
        GetBody(): b2Body;
        //  Get the next fixture in the parent body's fixture list. 
        GetNext(): b2Fixture;
        //  Set the density of this fixture. This will _not_ 
        //  automatically adjust the mass of the body. You must call 
        //  box2d.b2Body::ResetMassData to update the body's mass. 
        SetDensity(density: number): void;
        //  Get the density of this fixture. 
        GetDensity(): number;
        //  Get the coefficient of friction. 
        GetFriction(): number;
        //  Set the coefficient of friction. This will _not_ change the 
        //  friction of existing contacts. 
        SetFriction(friction: number): void;
        //  Get the coefficient of restitution. 
        GetRestitution(): number;
        //  Set the coefficient of restitution. This will _not_ change 
        //  the restitution of existing contacts. 
        SetRestitution(restitution: number): void;
        //  Test a point for containment in this fixture. 
        TestPoint(p: b2Vec2): boolean;
        //  Cast a ray against this shape. 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, childIndex: number): boolean;
        //  Get the mass data for this fixture. The mass data is based on 
        //  the density and the shape. The rotational inertia is about 
        //  the shape's origin. This operation may be expensive. 
        GetMassData(massData?: b2MassData): b2MassData;
        //  Get the fixture's AABB. This AABB may be enlarge and/or 
        //  stale. If you need a more accurate AABB, compute it using the 
        //  shape and the body transform. 
        GetAABB(childIndex: number): b2AABB;
        //  We need separation create/destroy functions from the 
        //  constructor/destructor because the destructor cannot access 
        //  the allocator (no destructor arguments allowed by C++). 
        Create(body: b2Body, def: b2FixtureDef): void;
        Destroy(): void;
        //  These support body activation/deactivation. 
        CreateProxies(broadPhase: b2BroadPhase, xf: b2Transform): void;
        DestroyProxies(broadPhase: b2BroadPhase): void;
        Synchronize(broadPhase: b2BroadPhase, transform1: b2Transform, transform2: b2Transform): void;
        //  Set the contact filtering data. This will not update contacts 
        //  until the next time step when either parent body is active 
        //  and awake. 
        //  This automatically calls Refilter. 
        SetFilterData(filter: b2Filter): void;
        //  Call this if you want to establish collision that was 
        //  previously disabled by box2d.b2ContactFilter::ShouldCollide. 
        Refilter(): void;
        //  Set if this fixture is a sensor. 
        SetSensor(sensor: boolean): void;
        //  Dump this fixture to the log file. 
        Dump(bodyIndex: number): void;
    }


    class b2BodyDef {
        //  A body definition holds all the data needed to construct a 
        //  rigid body. 
        //  You can safely re-use body definitions. Shapes are added to a 
        //  body after construction. 
        constructor();
        //  The body type: static, kinematic, or dynamic. 
        //  Note: if a dynamic body would have zero mass, the mass is set 
        //  to one. 
        type: b2BodyType;
        //  The world position of the body. Avoid creating bodies at the 
        //  origin since this can lead to many overlapping shapes. 
        position: b2Vec2;
        //  The world angle of the body in radians. 
        angle: number;
        //  The linear velocity of the body's origin in world 
        //  co-ordinates. 
        linearVelocity: b2Vec2;
        //  The angular velocity of the body. 
        angularVelocity: number;
        //  Linear damping is use to reduce the linear velocity. The 
        //  damping parameter can be larger than 1.0f but the damping 
        //  effect becomes sensitive to the time step when the damping 
        //  parameter is large. 
        linearDamping: number;
        //  Angular damping is use to reduce the angular velocity. The 
        //  damping parameter can be larger than 1.0f but the damping 
        //  effect becomes sensitive to the time step when the damping 
        //  parameter is large. 
        angularDamping: number;
        //  Set this flag to false if this body should never fall asleep. 
        //  Note that this increases CPU usage. 
        allowSleep: boolean;
        //  Is this body initially awake or sleeping? 
        awake: boolean;
        //  Should this body be prevented from rotating? Useful for 
        //  characters. 
        fixedRotation: boolean;
        //  Is this a fast moving body that should be prevented from 
        //  tunneling through other moving bodies? Note that all bodies 
        //  are prevented from tunneling through kinematic and static 
        //  bodies. This setting is only considered on dynamic bodies. 
        //  warning You should use this flag sparingly since it increases 
        //  processing time. 
        bullet: boolean;
        //  Does this body start out active? 
        active: boolean;
        //  Use this to store application specific body data. 
        userData: any;
        //  Scale the gravity applied to this body. 
        gravityScale: number;
    }


    class b2Body {
        //  A rigid body. These are created via 
        //  box2d.b2World::CreateBody. 
        constructor(bd: b2BodyDef, world: b2World);
        m_flags: b2BodyFlag;
        m_islandIndex: number;
        m_world: b2World;
        m_xf: b2Transform;
        m_out_xf: b2Transform;
        m_sweep: b2Sweep;
        m_out_sweep: b2Sweep;
        m_jointList: b2JointEdge;
        m_contactList: b2ContactEdge;
        m_prev: b2Body;
        m_next: b2Body;
        m_linearVelocity: b2Vec2;
        m_out_linearVelocity: b2Vec2;
        m_angularVelocity: number;
        m_linearDamping: number;
        m_angularDamping: number;
        m_gravityScale: number;
        m_force: b2Vec2;
        m_torque: number;
        m_sleepTime: number;
        m_type: b2BodyType;
        m_mass: number;
        m_invMass: number;
        m_I: number;
        m_invI: number;
        m_userData: any;
        m_fixtureList: b2Fixture;
        m_fixtureCount: number;
        m_controllerList: b2ControllerEdge;
        m_controllerCount: number;
        //  Creates a fixture and attach it to this body. Use this 
        //  function if you need to set some fixture parameters, like 
        //  friction. Otherwise you can create the fixture directly from 
        //  a shape. 
        //  If the density is non-zero, this function automatically 
        //  updates the mass of the body. Contacts are not created until 
        //  the next time step. 
        //  warning This function is locked during callbacks.
        CreateFixture(def: b2FixtureDef): b2Fixture;
        //  Creates a fixture from a shape and attach it to this body. 
        //  This is a convenience function. Use b2FixtureDef if you need 
        //  to set parameters like friction, restitution, user data, or 
        //  filtering. 
        //  If the density is non-zero, this function automatically 
        //  updates the mass of the body. 
        //  warning This function is locked during callbacks.
        CreateFixture2(shape: b2Shape, density: number): b2Fixture;
        //  Destroy a fixture. This removes the fixture from the 
        //  broad-phase and destroys all contacts associated with this 
        //  fixture. This will automatically adjust the mass of the body 
        //  if the body is dynamic and the fixture has positive density. 
        //  All fixtures attached to a body are implicitly destroyed when 
        //  the body is destroyed. 
        //  warning This function is locked during callbacks.
        DestroyFixture(fixture: b2Fixture): void;
        //  Set the position of the body's origin and rotation. 
        //  Manipulating a body's transform may cause non-physical 
        //  behavior. 
        //  Note: contacts are updated on the next call to b2World::Step.
        SetTransformVecRadians(position: b2Vec2, angle: number): void;
        SetTransformXYRadians(x: number, y: number, angle: number): void;
        SetTransform(xf: b2Transform): void;
        //  Get the body transform for the body's origin. 
        GetTransform(out?: b2Transform): b2Transform;
        //  Get the world body origin position. 
        GetPosition(out?: b2Vec2): b2Vec2;
        SetPosition(position: b2Vec2): void;
        SetPositionXY(x: number, y: number): void;
        //  Get the angle in radians. 
        GetAngle(): number;
        SetAngle(angle: number): void;
        //  Get the world position of the center of mass. 
        GetWorldCenter(out?: b2Vec2): b2Vec2;
        //  Get the local position of the center of mass. 
        GetLocalCenter(out?: b2Vec2): b2Vec2;
        //  Set the linear velocity of the center of mass. 
        SetLinearVelocity(v: b2Vec2): void;
        //  Get the linear velocity of the center of mass. 
        GetLinearVelocity(out?: b2Vec2): b2Vec2;
        //  Set the angular velocity. 
        SetAngularVelocity(w: number): void;
        //  Get the angular velocity. 
        GetAngularVelocity(): number;
        GetDefinition(bd: b2BodyDef): b2BodyDef;
        //  Apply a force at a world point. If the force is not applied 
        //  at the center of mass, it will generate a torque and affect 
        //  the angular velocity. This wakes up the body. 
        ApplyForce(force: b2Vec2, point: b2Vec2, wake?: boolean): void;
        //  Apply a force to the center of mass. This wakes up the body. 
        ApplyForceToCenter(force: b2Vec2, wake?: boolean): void;
        //  Apply a torque. This affects the angular velocity without 
        //  affecting the linear velocity of the center of mass. This 
        //  wakes up the body. 
        ApplyTorque(torque: number, wake?: boolean): void;
        //  Apply an impulse at a point. This immediately modifies the 
        //  velocity. It also modifies the angular velocity if the point 
        //  of application is not at the center of mass. This wakes up 
        //  the body. 
        ApplyLinearImpulse(impulse: b2Vec2, point: b2Vec2, wake?: boolean): void;
        //  Apply an angular impulse. 
        ApplyAngularImpulse(impulse: number, wake?: boolean): void;
        //  Get the total mass of the body. 
        GetMass(): number;
        //  Get the rotational inertia of the body about the local 
        //  origin. 
        GetInertia(): number;
        //  Get the mass data of the body. 
        GetMassData(data: b2MassData): b2MassData;
        //  Set the mass properties to override the mass properties of 
        //  the fixtures. 
        //  Note that this changes the center of mass position. 
        //  Note that creating or destroying fixtures can also alter the 
        //  mass. 
        //  This function has no effect if the body isn't dynamic. 
        SetMassData(massData: b2MassData): void;
        //  This resets the mass properties to the sum of the mass 
        //  properties of the fixtures. This normally does not need to be 
        //  called unless you called SetMassData to override the mass and 
        //  you later want to reset the mass. 
        ResetMassData(): void;
        //  Get the world coordinates of a point given the local 
        //  coordinates. 
        GetWorldPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        //  Get the world coordinates of a vector given the local 
        //  coordinates. 
        GetWorldVector(localVector: b2Vec2, out: b2Vec2): b2Vec2;
        //  Gets a local point relative to the body's origin given a 
        //  world point. 
        GetLocalPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        //  Gets a local vector given a world vector. 
        GetLocalVector(worldVector: b2Vec2, out: b2Vec2): b2Vec2;
        //  Get the world linear velocity of a world point attached to 
        //  this body. 
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        //  Get the world velocity of a local point. 
        GetLinearVelocityFromLocalPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        //  Get the linear damping of the body. 
        GetLinearDamping(): number;
        //  Set the linear damping of the body. 
        SetLinearDamping(linearDamping: number): void;
        //  Get the angular damping of the body. 
        GetAngularDamping(): number;
        //  Set the angular damping of the body. 
        SetAngularDamping(angularDamping: number): void;
        //  Get the gravity scale of the body. 
        GetGravityScale(): number;
        //  Set the gravity scale of the body. 
        SetGravityScale(scale: number): void;
        //  Set the type of this body. This may alter the mass and 
        //  velocity. 
        SetType(type: b2BodyType): void;
        //  Get the type of this body. 
        GetType(): b2BodyType;
        //  Should this body be treated like a bullet for continuous 
        //  collision detection? 
        SetBullet(flag: boolean): void;
        //  Is this body treated like a bullet for continuous collision 
        //  detection? 
        IsBullet(): boolean;
        //  You can disable sleeping on this body. If you disable 
        //  sleeping, the body will be woken. 
        SetSleepingAllowed(flag: boolean): void;
        //  Is this body allowed to sleep 
        IsSleepingAllowed(): boolean;
        //  Set the sleep state of the body. A sleeping body has very low CPU cost. 
        //   	  put it to sleep.
        SetAwake(flag: boolean): void;
        //  Get the sleeping state of this body. 
        IsAwake(): boolean;
        //  Set the active state of the body. An inactive body is not
        //  simulated and cannot be collided with or woken up.
        //  If you pass a flag of true, all fixtures will be added to the
        //  broad-phase.
        //  If you pass a flag of false, all fixtures will be removed from
        //  the broad-phase and all contacts will be destroyed.
        //  Fixtures and joints are otherwise unaffected. You may continue
        //  to create/destroy fixtures and joints on inactive bodies.
        //  Fixtures on an inactive body are implicitly inactive and will
        //  not participate in collisions, ray-casts, or queries.
        //  Joints connected to an inactive body are implicitly inactive.
        //  An inactive body is still owned by a b2World object and remains
        //  in the body list.
        SetActive(flag: boolean): void;
        //  Get the active state of the body. 
        IsActive(): boolean;
        //  Set this body to have fixed rotation. This causes the mass to 
        //  be reset. 
        SetFixedRotation(flag: boolean): void;
        //  Does this body have fixed rotation? 
        IsFixedRotation(): boolean;
        //  Get the list of all fixtures attached to this body. 
        GetFixtureList(): b2Fixture;
        //  Get the list of all joints attached to this body. 
        GetJointList(): b2JointEdge;
        //  Get the list of all contacts attached to this body. 
        //  warning this list changes during the time step and you may 
        //  miss some collisions if you don't use b2ContactListener. 
        GetContactList(): b2ContactEdge;
        //  Get the next body in the world's body list. 
        GetNext(): b2Body;
        //  Get the user data pointer that was provided in the body 
        //  definition. 
        GetUserData(): any;
        //  Set the user data. Use this to store your application 
        //  specific data. 
        SetUserData(data: any): void;
        //  Get the parent world of this body. 
        GetWorld(): b2World;
        SynchronizeFixtures(): void;
        SynchronizeTransform(): void;
        //  This is used to prevent connected bodies from colliding. 
        //  It may lie, depending on the collideConnected flag.
        ShouldCollide(other: b2Body): boolean;
        Advance(alpha: number): void;
        //  Dump this body to a log file 
        Dump(): void;
        GetControllerList(): b2ControllerEdge;
        GetControllerCount(): number;
    }


    class b2World {
        //  Construct a world object. 
        constructor(gravity: b2Vec2);
        m_flags: b2WorldFlag;
        m_contactManager: b2ContactManager;
        m_bodyList: b2Body;
        m_jointList: b2Joint;
        m_bodyCount: number;
        m_jointCount: number;
        m_gravity: b2Vec2;
        m_out_gravity: b2Vec2;
        m_allowSleep: boolean;
        m_destructionListener: b2DestructionListener;
        m_debugDraw: b2Draw;
        //  This is used to compute the time step ratio to support a 
        //  variable time step. 
        m_inv_dt0: number;
        //  These are for debugging the solver. 
        m_warmStarting: boolean;
        m_continuousPhysics: boolean;
        m_subStepping: boolean;
        m_stepComplete: boolean;
        m_profile: b2Profile;
        m_island: b2Island;
        s_stack: Array<b2Body>;
        m_controllerList: b2Controller;
        m_controllerCount: number;
        //  Enable/disable sleep. 
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        //  Enable/disable warm starting. For testing. 
        SetWarmStarting(flag: boolean): void;
        GetWarmStarting(): boolean;
        //  Enable/disable continuous physics. For testing. 
        SetContinuousPhysics(flag: boolean): void;
        GetContinuousPhysics(): boolean;
        //  Enable/disable single stepped continuous physics. For 
        //  testing. 
        SetSubStepping(flag: boolean): void;
        GetSubStepping(): boolean;
        //  Get the world body list. With the returned body, use 
        //  b2Body::GetNext to get the next body in the world list. A 
        //  NULL body indicates the end of the list. 
        GetBodyList(): b2Body;
        //  Get the world joint list. With the returned joint, use 
        //  b2Joint::GetNext to get the next joint in the world list. A 
        //  NULL joint indicates the end of the list. 
        GetJointList(): b2Joint;
        //  Get the world contact list. With the returned contact, use 
        //  box2d.b2Contact::GetNext to get the next contact in the world 
        //  list. A NULL contact indicates the end of the list. 
        //  warning contacts are created and destroyed in the middle of a 
        //  time step. 
        //  Use box2d.b2ContactListener to avoid missing contacts.
        GetContactList(): b2Contact;
        //  Get the number of bodies. 
        GetBodyCount(): number;
        //  Get the number of joints. 
        GetJointCount(): number;
        //  Get the number of contacts (each may have 0 or more contact 
        //  points). 
        GetContactCount(): number;
        //  Change the global gravity vector. 
        SetGravity(gravity: b2Vec2, wake?: boolean): void;
        //  Get the global gravity vector. 
        GetGravity(out?: b2Vec2): b2Vec2;
        //  Is the world locked (in the middle of a time step). 
        IsLocked(): boolean;
        //  Set flag to control automatic clearing of forces after each 
        //  time step. 
        SetAutoClearForces(flag: boolean): void;
        //  Get the flag that controls automatic clearing of forces after 
        //  each time step. 
        GetAutoClearForces(): boolean;
        //  Get the contact manager for testing. 
        GetContactManager(): b2ContactManager;
        //  Get the current profile. 
        GetProfile(): b2Profile;
        //  Register a destruction listener. The listener is owned by you 
        //  and must remain in scope. 
        SetDestructionListener(listener: b2DestructionListener): void;
        //  Register a contact filter to provide specific control over 
        //  collision. Otherwise the default filter is used 
        //  (b2_defaultFilter). The listener is owned by you and must 
        //  remain in scope. 
        SetContactFilter(filter: b2ContactFilter): void;
        //  Register a contact event listener. The listener is owned by 
        //  you and must remain in scope. 
        SetContactListener(listener: b2ContactListener): void;
        //  Register a routine for debug drawing. The debug draw 
        //  functions are called inside with b2World::DrawDebugData 
        //  method. The debug draw object is owned by you and must remain 
        //  in scope. 
        SetDebugDraw(debugDraw: b2Draw): void;
        //  Create a rigid body given a definition. No reference to the 
        //  definition is retained. 
        //  warning This function is locked during callbacks.
        CreateBody(def: b2BodyDef): b2Body;
        //  Destroy a rigid body given a definition. No reference to the 
        //  definition is retained. This function is locked during 
        //  callbacks. 
        //  warning This automatically deletes all associated shapes and 
        //  joints. 
        //  warning This function is locked during callbacks. 
        DestroyBody(b: b2Body): void;
        //  Create a joint to constrain bodies together. No reference to 
        //  the definition is retained. This may cause the connected 
        //  bodies to cease colliding. 
        //  warning This function is locked during callbacks.
        CreateJoint(def: b2JointDef): b2Joint;
        //  Destroy a joint. This may cause the connected bodies to begin 
        //  colliding. 
        //  warning This function is locked during callbacks.
        DestroyJoint(j: b2Joint): void;
        //  Find islands, integrate and solve constraints, solve position 
        //  constraints 
        Solve(step: b2TimeStep): void;
        //  Find TOI contacts and solve them. 
        SolveTOI(step: b2TimeStep): void;
        //  Take a time step. This performs collision detection, 
        //  integration, and constraint solution. 
        Step(dt: number, velocityIterations: number, positionIterations: number): void;
        //  Manually clear the force buffer on all bodies. By default, 
        //  forces are cleared automatically after each call to Step. The 
        //  default behavior is modified by calling SetAutoClearForces. 
        //  The purpose of this function is to support sub-stepping. 
        //  Sub-stepping is often used to maintain a fixed sized time 
        //  step under a variable frame-rate. 
        //  When you perform sub-stepping you will disable auto clearing 
        //  of forces and instead call ClearForces after all sub-steps 
        //  are complete in one pass of your game loop. 
        ClearForces(): void;
        //  Query the world for all fixtures that potentially overlap the 
        //  provided AABB. 
        //   	  boolean} callback a user implemented callback class.
        QueryAABB(callback: (fixture: b2Fixture) => boolean | b2QueryCallback, aabb: b2AABB): void;
        //   	  boolean} callback
        QueryShape(callback: (fixture: b2Fixture) => boolean | b2QueryCallback, shape: b2Shape, transform: b2Transform): void;
        //   	  boolean} callback
        QueryPoint(callback: (fixture: b2Fixture) => boolean | b2QueryCallback, point: b2Vec2): void;
        //  Ray-cast the world for all fixtures in the path of the ray. 
        //  Your callback controls whether you get the closest point, any 
        //  point, or n-points. The ray-cast ignores shapes that contain 
        //  the starting point. 
        //   	  box2d.b2Vec2, box2d.b2Vec2, number)} callback a user
        //   	  implemented callback class.
        RayCast(callback: (fixture: b2Fixture, vec1: b2Vec2, vec2: b2Vec2, points: number) => void | b2RayCastCallback, point1: b2Vec2, point2: b2Vec2): void;
        RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture;
        RayCastAll(point1: b2Vec2, point2: b2Vec2, out: Array<b2Fixture>): Array<b2Fixture>;
        DrawShape(fixture: b2Fixture, color: b2Color): void;
        DrawJoint(joint: b2Joint): void;
        //  Call this to draw shapes and other debug draw data.
        DrawDebugData(): void;
        SetBroadPhase(broadPhase: b2BroadPhase): void;
        //  Get the number of broad-phase proxies. 
        GetProxyCount(): number;
        //  Get the height of the dynamic tree. 
        GetTreeHeight(): number;
        //  Get the balance of the dynamic tree. 
        GetTreeBalance(): number;
        //  Get the quality metric of the dynamic tree. The smaller the 
        //  better. The minimum is 1. 
        GetTreeQuality(): number;
        //  Shift the world origin. Useful for large worlds. 
        //  The body shift formula is: position -= newOrigin
        ShiftOrigin(newOrigin: b2Vec2): void;
        //  Dump the world into the log file. 
        //  warning this should be called outside of a time step.
        Dump(): void;
        AddController(controller: b2Controller): b2Controller;
        RemoveController(controller: b2Controller): void;
    }


    class b2AreaJointDef extends b2JointDef {
        //  Definition for a {@link box2d.b2AreaJoint}, which connects a 
        //  group a bodies together so they maintain a constant area 
        //  within them. 
        constructor();
        world: b2World;
        bodies: Array<b2Body>;
        //  The mass-spring-damper frequency in Hertz. A value of 0 
        //  disables softness. 
        frequencyHz: number;
        //  The damping ratio. 0 = no damping, 1 = critical damping. 
        dampingRatio: number;
        AddBody(body: b2Body): void;
    }


    class b2AreaJoint extends b2Joint {
        //  A distance joint constrains two points on two bodies to 
        //  remain at a fixed distance from each other. You can view this 
        //  as a massless, rigid rod. 
        constructor(def: b2AreaJointDef);
        m_bodies: Array<b2Body>;
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_impulse: number;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        //  Get the reaction force given the inverse time step. 
        //  Unit is N.
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        //  Get the reaction torque given the inverse time step. 
        //  Unit is N*m. This is always zero for a distance joint.
        GetReactionTorque(inv_dt: number): number;
        //  Set/get frequency in Hz. 
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        //  Set/get damping ratio. 
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        //  Dump joint to dmLog 
        Dump(): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }


    class b2BuoyancyController extends b2Controller {
        //  Calculates buoyancy forces for fluids in the form of a half 
        //  plane. 
        constructor();
        //  The outer surface normal 
        normal: b2Vec2;
        //  The height of the fluid surface along the normal 
        offset: number;
        //  The fluid density 
        density: number;
        //  Fluid velocity, for drag calculations 
        velocity: b2Vec2;
        //  Linear drag co-efficient 
        linearDrag: number;
        //  Linear drag co-efficient 
        angularDrag: number;
        //  If false, bodies are assumed to be uniformly dense, otherwise 
        //  use the shapes densities 
        useDensity: boolean;
        //  If true, gravity is taken from the world instead of the
        useWorldGravity: boolean;
        //  Gravity vector, if the world's gravity is not used 
        gravity: b2Vec2;
        Step(step: b2TimeStep): void;
        Draw(debugDraw: b2Draw): void;
    }


    class b2TensorDampingController extends b2Controller {
        //  Applies top down linear damping to the controlled bodies 
        //  The damping is calculated by multiplying velocity by a matrix 
        //  in local co-ordinates. 
        constructor();
        //  Tensor to use in damping model 
        T: b2Mat22;
        //  Set this to a positive number to clamp the maximum amount of 
        //  damping done. 
        maxTimestep: number;
        Step(step: b2TimeStep): void;
        //  Sets damping independantly along the x and y axes 
        SetAxisAligned(xDamping: number, yDamping: number): void;
    }


    class b2DistanceJointDef extends b2JointDef {
        //  Distance joint definition. This requires defining an anchor 
        //  point on both bodies and the non-zero length of the distance 
        //  joint. The definition uses local anchor points so that the 
        //  initial configuration can violate the constraint slightly. 
        //  This helps when saving and loading a game. 
        //  warning Do not use a zero or short length.
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The natural length between the anchor points. 
        length: number;
        //  The mass-spring-damper frequency in Hertz. A value of 0 
        //  disables softness. 
        frequencyHz: number;
        //  The damping ratio. 0 = no damping, 1 = critical damping. 
        dampingRatio: number;
        Initialize(b1: b2Body, b2: b2Body, anchor1: b2Vec2, anchor2: b2Vec2): void;
    }


    class b2DistanceJoint extends b2Joint {
        //  A distance joint constrains two points on two bodies to 
        //  remain at a fixed distance from each other. You can view this 
        //  as a massless, rigid rod. 
        constructor(def: b2DistanceJointDef);
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_gamma: number;
        m_impulse: number;
        m_length: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        //  Get the reaction force given the inverse time step. 
        //  Unit is N.
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        //  Get the reaction torque given the inverse time step. 
        //  Unit is N*m. This is always zero for a distance joint.
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        SetLength(length: number): void;
        GetLength(): number;
        //  Set/get frequency in Hz. 
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        //  Set/get damping ratio. 
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        //  Dump joint to dmLog 
        Dump(): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }


    class b2FrictionJointDef extends b2JointDef {
        //  Friction joint definition. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The maximum friction force in N. 
        maxForce: number;
        //  The maximum friction torque in N-m. 
        maxTorque: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }


    class b2FrictionJoint extends b2Joint {
        //  Friction joint. This is used for top-down friction. It 
        //  provides 2D translational friction and angular friction. 
        constructor(def: b2FrictionJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        //  Set the maximum friction force in N. 
        SetMaxForce(force: number): void;
        //  Get the maximum friction force in N. 
        GetMaxForce(): number;
        //  Set the maximum friction torque in N*m. 
        SetMaxTorque(torque: number): void;
        //  Get the maximum friction torque in N*m. 
        GetMaxTorque(): number;
        //  Dump joint to dmLog 
        Dump(): void;
    }


    class b2MouseJointDef extends b2JointDef {
        //  Mouse joint definition. This requires a world target point, 
        //  tuning parameters, and the time step. 
        constructor();
        //  The initial world target point. This is assumed to coincide 
        //  with the body anchor initially. 
        target: b2Vec2;
        //  The maximum constraint force that can be exerted to move the 
        //  candidate body. Usually you will express as some multiple of 
        //  the weight (multiplier * mass * gravity). 
        maxForce: number;
        //  The response speed. 
        frequencyHz: number;
        //  The damping ratio. 0 = no damping, 1 = critical damping. 
        dampingRatio: number;
    }


    class b2MouseJoint extends b2Joint {
        //  A mouse joint is used to make a point on a body track a 
        //  specified world point. This a soft constraint with a maximum 
        //  force. This allows the constraint to stretch and without 
        //  applying huge forces. 
        //  NOTE: this joint is not documented in the manual because it 
        //  was developed to be used in the testbed. If you want to learn 
        //  how to use the mouse joint, look at the testbed. 
        constructor(def: b2MouseJointDef);
        m_localAnchorB: b2Vec2;
        m_targetA: b2Vec2;
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_beta: number;
        m_impulse: b2Vec2;
        m_maxForce: number;
        m_gamma: number;
        m_indexA: number;
        m_indexB: number;
        m_rB: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassB: number;
        m_invIB: number;
        m_mass: b2Mat22;
        m_C: b2Vec2;
        m_qB: b2Rot;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        SetTarget(target: b2Vec2): void;
        GetTarget(out: b2Vec2): b2Vec2;
        SetMaxForce(maxForce: number): void;
        GetMaxForce(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The mouse joint does not support dumping. 
        Dump(): void;
        //  Implement b2Joint::ShiftOrigin 
        ShiftOrigin(newOrigin: b2Vec2): void;
    }


    class b2ConstantForceController extends b2Controller {
        //  Applies a force every frame 
        constructor();
        Step(step: b2TimeStep): void;
    }


    class b2PulleyJointDef extends b2JointDef {
        //  Pulley joint definition. This requires two ground anchors, 
        //  two dynamic body anchor points, and a pulley ratio. 
        constructor();
        //  The first ground anchor in world coordinates. This point 
        //  never moves. 
        groundAnchorA: b2Vec2;
        //  The second ground anchor in world coordinates. This point 
        //  never moves. 
        groundAnchorB: b2Vec2;
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The a reference length for the segment attached to bodyA. 
        lengthA: number;
        //  The a reference length for the segment attached to bodyB. 
        lengthB: number;
        //  The pulley ratio, used to simulate a block-and-tackle. 
        ratio: number;
        Initialize(bA: b2Body, bB: b2Body, groundA: b2Vec2, groundB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, r: number): void;
    }


    class b2PulleyJoint extends b2Joint {
        //  The pulley joint is connected to two bodies and two fixed ground points. 
        //  The pulley supports a ratio such that: 
        //  lengthA + ratio * lengthB <= constant 
        //  Yes, the force transmitted is scaled by the ratio. 
        //  Warning: the pulley joint can get a bit squirrelly by itself.
        //  They often work better when combined with prismatic joints. 
        //  You should also cover the the anchor points with static 
        //  shapes to prevent one side from going to zero length. 
        constructor(def: b2PulleyJointDef);
        m_groundAnchorA: b2Vec2;
        m_groundAnchorB: b2Vec2;
        m_lengthA: number;
        m_lengthB: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_uA: b2Vec2;
        m_uB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetGroundAnchorA(out: b2Vec2): b2Vec2;
        GetGroundAnchorB(out: b2Vec2): b2Vec2;
        //  Get the current length of the segment attached to bodyA. 
        GetLengthA(): number;
        //  Get the current length of the segment attached to bodyB. 
        GetLengthB(): number;
        //  Get the pulley ratio. 
        GetRatio(): number;
        //  Get the current length of the segment attached to bodyA. 
        GetCurrentLengthA(): number;
        //  Get the current length of the segment attached to bodyB. 
        GetCurrentLengthB(): number;
        //  Dump joint to dmLog 
        Dump(): void;
        //  Implement b2Joint::ShiftOrigin 
        ShiftOrigin(newOrigin: b2Vec2): void;
    }


    class b2CircleShape extends b2Shape {
        //  A circle shape. 
        constructor(radius?: number);
        m_p: b2Vec2;
        //  Implement box2d.b2Shape. 
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        //  Implement box2d.b2Shape. 
        GetChildCount(): number;
        //  Implement box2d.b2Shape. 
        TestPoint(transform: b2Transform, p: b2Vec2): boolean;
        //  Implement box2d.b2Shape. 
        //  Collision Detection in Interactive 3D Environments by Gino 
        //  van den Bergen From Section 3.1.2 
        //  x = s + a * r 
        //  norm(x) = radius 
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, transform: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        //  Dump this shape to the log file. 
        Dump(): void;
    }


    class b2RopeDef {
        constructor();
    }


    class b2Rope {
        constructor();
        GetVertexCount(): number;
        GetVertices(): Array<b2Vec2>;
        Initialize(def: b2RopeDef): void;
        Step(h: number, iterations: number): void;
        SolveC2(): void;
        SetAngleRadians(angle: number): void;
        SolveC3(): void;
        Draw(draw: b2Draw): void;
    }


    class b2WheelJointDef extends b2JointDef {
        //  Wheel joint definition. This requires defining a line of 
        //  motion using an axis and an anchor point. The definition uses 
        //  local anchor points and a local axis so that the initial 
        //  configuration can violate the constraint slightly. The joint 
        //  translation is zero when the local anchor points coincide in 
        //  world space. Using local anchors and a local axis helps when 
        //  saving and loading a game. 
        constructor();
        //  The local anchor point relative to bodyA's origin. 
        localAnchorA: b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        localAnchorB: b2Vec2;
        //  The local translation axis in bodyA. 
        localAxisA: b2Vec2;
        //  Enable/disable the joint motor. 
        enableMotor: boolean;
        //  The maximum motor torque, usually in N-m. 
        maxMotorTorque: number;
        //  The desired motor speed in radians per second. 
        motorSpeed: number;
        //  Suspension frequency, zero indicates no suspension 
        frequencyHz: number;
        //  Suspension damping ratio, one indicates critical damping 
        dampingRatio: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }


    class b2WheelJoint extends b2Joint {
        //  A wheel joint. This joint provides two degrees of freedom: 
        //  translation along an axis fixed in bodyA and rotation in the 
        //  plane. You can use a joint limit to restrict the range of 
        //  motion and a joint motor to drive the rotation or to model 
        //  rotational friction. 
        //  This joint is designed for vehicle suspensions.
        constructor(def: b2WheelJointDef);
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_impulse: number;
        m_motorImpulse: number;
        m_springImpulse: number;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableMotor: boolean;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_ax: b2Vec2;
        m_ay: b2Vec2;
        m_sAx: number;
        m_sBx: number;
        m_sAy: number;
        m_sBy: number;
        m_mass: number;
        m_motorMass: number;
        m_springMass: number;
        m_bias: number;
        m_gamma: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        //  Get the motor speed, usually in radians per second. 
        GetMotorSpeed(): number;
        GetMaxMotorTorque(): number;
        SetSpringFrequencyHz(hz: number): void;
        GetSpringFrequencyHz(): number;
        SetSpringDampingRatio(ratio: number): void;
        GetSpringDampingRatio(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetDefinition(def: b2WheelJointDef): b2WheelJointDef;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  The local anchor point relative to bodyA's origin. 
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        //  The local anchor point relative to bodyB's origin. 
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        //  The local joint axis relative to bodyA. 
        GetLocalAxisA(out: b2Vec2): b2Vec2;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        //  Set the motor speed, usually in radians per second. 
        SetMotorSpeed(speed: number): void;
        //  Set/Get the maximum motor force, usually in N-m. 
        SetMaxMotorTorque(force: number): void;
        //  Get the current motor torque given the inverse time step, 
        //  usually in N-m. 
        GetMotorTorque(inv_dt: number): number;
        //  Dump to b2Log 
        Dump(): void;
    }


    class b2MotorJointDef extends b2JointDef {
        //  Motor joint definition. 
        constructor();
        //  Position of bodyB minus the position of bodyA, in bodyA's 
        //  frame, in meters. 
        linearOffset: b2Vec2;
        //  The bodyB angle minus bodyA angle in radians. 
        angularOffset: number;
        //  The maximum motor force in N. 
        maxForce: number;
        //  The maximum motor torque in N-m. 
        maxTorque: number;
        //  Position correction factor in the range [0,1]. 
        correctionFactor: number;
        Initialize(bA: b2Body, bB: b2Body): void;
    }


    class b2MotorJoint extends b2Joint {
        //  A motor joint is used to control the relative motion between 
        //  two bodies. A typical usage is to control the movement of a 
        //  dynamic body with respect to the ground. 
        constructor(def: b2MotorJointDef);
        m_linearOffset: b2Vec2;
        m_angularOffset: number;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_correctionFactor: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_linearError: b2Vec2;
        m_angularError: number;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_K: b2Mat22;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        //  Set the position correction factor in the range [0,1]. 
        SetCorrectionFactor(factor: number): void;
        //  Get the position correction factor in the range [0,1]. 
        GetCorrectionFactor(): number;
        //  Set/get the target linear offset, in frame A, in meters. 
        SetLinearOffset(linearOffset: b2Vec2): void;
        GetLinearOffset(out: b2Vec2): b2Vec2;
        //  Set/get the target angular offset, in radians. 
        SetAngularOffset(angularOffset: number): void;
        GetAngularOffset(): number;
        //  Set the maximum friction force in N. 
        SetMaxForce(force: number): void;
        //  Get the maximum friction force in N. 
        GetMaxForce(): number;
        //  Set the maximum friction torque in N*m. 
        SetMaxTorque(torque: number): void;
        //  Get the maximum friction torque in N*m. 
        GetMaxTorque(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        //  Dump to b2Log 
        Dump(): void;
    }

    class b2ParticleSystem {

    }
}
