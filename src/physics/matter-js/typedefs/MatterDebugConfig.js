/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterDebugConfig
 * @since 3.22.0
 *              
 * @property {boolean} [showAxes=false] - Render all of the body axes?
 * @property {boolean} [showAngleIndicator=false] - Render just a single body axis?
 * @property {boolean} [angleColor=0xe81153] - The color of the body angle / axes lines.
 * @property {boolean} [showBroadphase=false] - Render the broadphase grid?
 * @property {boolean} [broadphaseColor=0xffb400] - The color of the broadphase grid.
 * @property {boolean} [showBounds=false] - Render the bounds of the bodies in the world?
 * @property {boolean} [boundsColor=0xffffff] - The color of the body bounds.
 * @property {boolean} [showVelocity=false] - Render the velocity of the bodies in the world?
 * @property {boolean} [velocityColor=0x00aeef] - The color of the body velocity line.
 * @property {boolean} [showCollisions=false] - Render the collision points and normals for colliding pairs.
 * @property {boolean} [collisionColor=0xf5950c] - The color of the collision points.
 * @property {boolean} [showSeparation=false] - Render lines showing the separation between bodies.
 * @property {boolean} [separationColor=0xffa500] - The color of the body separation line.
 * @property {boolean} [showBody=true] - Render the dynamic bodies in the world to the Graphics object?
 * @property {boolean} [showStaticBody=true] - Render the static bodies in the world to the Graphics object?
 * @property {boolean} [showInternalEdges=false] - When rendering bodies, render the internal edges as well?
 * @property {boolean} [renderFill=false] - Render the bodies using a fill color.
 * @property {boolean} [renderLine=true] - Render the bodies using a line stroke.
 * @property {number} [fillColor=0x106909] - The color value of the fill when rendering dynamic bodies.
 * @property {number} [fillOpacity=1] - The opacity of the fill when rendering dynamic bodies, a value between 0 and 1.
 * @property {number} [lineColor=0x28de19] - The color value of the line stroke when rendering dynamic bodies.
 * @property {number} [lineOpacity=1] - The opacity of the line when rendering dynamic bodies, a value between 0 and 1.
 * @property {number} [lineThickness=1] - If rendering lines, the thickness of the line.
 * @property {number} [staticFillColor=0x0d177b] - The color value of the fill when rendering static bodies.
 * @property {number} [staticLineColor=0x1327e4] - The color value of the line stroke when rendering static bodies.
 * @property {boolean} [showSleeping=false] - Render any sleeping bodies (dynamic or static) in the world to the Graphics object?
 * @property {number} [staticBodySleepOpacity=0.7] - The amount to multiply the opacity of sleeping static bodies by.
 * @property {number} [sleepFillColor=0x464646] - The color value of the fill when rendering sleeping dynamic bodies.
 * @property {number} [sleepLineColor=0x999a99] - The color value of the line stroke when rendering sleeping dynamic bodies.
 * @property {boolean} [showSensors=true] - Render bodies or body parts that are flagged as being a sensor?
 * @property {number} [sensorFillColor=0x0d177b] - The fill color when rendering body sensors.
 * @property {number} [sensorLineColor=0x1327e4] - The line color when rendering body sensors.
 * @property {boolean} [showPositions=true] - Render the position of non-static bodies?
 * @property {number} [positionSize=4] - The size of the rectangle drawn when rendering the body position.
 * @property {number} [positionColor=0xe042da] - The color value of the rectangle drawn when rendering the body position.
 * @property {boolean} [showJoint=true] - Render all world constraints to the Graphics object?
 * @property {number} [jointColor=0xe0e042] - The color value of joints when `showJoint` is set.
 * @property {number} [jointLineOpacity=1] - The line opacity when rendering joints, a value between 0 and 1.
 * @property {number} [jointLineThickness=2] - The line thickness when rendering joints.
 * @property {number} [pinSize=4] - The size of the circles drawn when rendering pin constraints.
 * @property {number} [pinColor=0x42e0e0] - The color value of the circles drawn when rendering pin constraints.
 * @property {number} [springColor=0xe042e0] - The color value of spring constraints.
 * @property {number} [anchorColor=0xefefef] - The color value of constraint anchors.
 * @property {number} [anchorSize=4] - The size of the circles drawn as the constraint anchors.
 * @property {boolean} [showConvexHulls=false] - When rendering polygon bodies, render the convex hull as well?
 * @property {number} [hullColor=0xd703d0] - The color value of hulls when `showConvexHulls` is set.
 */
