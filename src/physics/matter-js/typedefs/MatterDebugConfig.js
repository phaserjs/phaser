/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterDebugConfig
 * @since 3.22.0
 *              
 * @property {boolean} [showBody=true] - Render the dynamic bodies in the world to the Graphics object?
 * @property {boolean} [showStaticBody=true] - Render the static bodies in the world to the Graphics object?
 * @property {boolean} [showSleeping=false] - Render any sleeping bodies (dynamic or static) in the world to the Graphics object?
 * @property {boolean} [showJoint=true] - Render all world constraints to the Graphics object?
 * @property {boolean} [showInternalEdges=false] - When rendering bodies, render the internal edges as well?
 * @property {boolean} [showConvexHulls=false] - When rendering polygon bodies, render the convex hull as well?
 * @property {boolean} [renderFill=true] - Render the bodies using a fill color.
 * @property {boolean} [renderStroke=true] - Render the bodies using a line stroke.
 * @property {number} [lineThickness=1] - If rendering with a stroke, the thickness of the line.
 * @property {number} [fillColor=0x106909] - The color value of the fill when rendering dynamic bodies.
 * @property {number} [strokeColor=0x28de19] - The color value of the line stroke when rendering dynamic bodies.
 * @property {number} [staticFillColor=0x0d177b] - The color value of the fill when rendering static bodies.
 * @property {number} [staticStrokeColor=0x1327e4] - The color value of the line stroke when rendering static bodies.
 * @property {number} [staticBodySleepOpacity=0.7] - The amount to multiply the opacity of sleeping static bodies by.
 * @property {number} [sleepFillColor=0x464646] - The color value of the fill when rendering sleeping dynamic bodies.
 * @property {number} [sleepStrokeColor=0x999a99] - The color value of the line stroke when rendering sleeping dynamic bodies.
 * @property {number} [hullColor=0xd703d0] - The color value of hulls when `showConvexHulls` is set.
 * @property {number} [jointColor=0xe0e042] - The color value of joints when `showJoint` is set.
 * @property {number} [jointLineThickness=2] - The line thickness when rendering joints.
 * @property {number} [pinSize=4] - The size of the circles drawn when rendering pin constraints.
 * @property {number} [pinColor=0x42e0e0] - The color value of the circles drawn when rendering pin constraints.
 * @property {number} [springColor=0xe042e0] - The color value of spring constraints.
 * @property {number} [anchorColor=0xefefef] - The color value of constraint anchors.
 * @property {number} [anchorSize=6] - The size of the circles drawn as the constraint anchors.
 */
