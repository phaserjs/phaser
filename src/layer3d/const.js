var LAYER3D_CONST = {

    OBJECT_TYPE: {
        MESH: 'mesh',
        SKINNED_MESH: 'skinned_mesh',
        LIGHT: 'light',
        CAMERA: 'camera',
        SCENE: 'scene',
        GROUP: 'group',
        CANVAS2D: 'canvas2d'
    },

    LIGHT_TYPE: {
        AMBIENT: 'ambient',
        DIRECT: 'direct',
        POINT: 'point',
        SPOT: 'spot'
    },

    MATERIAL_TYPE: {
        BASIC: 'basic',
        LAMBERT: 'lambert',
        PHONG: 'phong',
        PBR: 'pbr',
        PBR2: 'pbr2',
        MATCAP: 'matcap',
        POINT: 'point',
        LINE: 'line',
        CANVAS2D: 'canvas2d',
        SHADER: 'shader',
        DEPTH: 'depth',
        DISTANCE: 'distance'
    },

    FOG_TYPE: {
        NORMAL: 'normal',
        EXP2: 'exp2'
    },

    BLEND_TYPE: {
        NONE: 'none',
        NORMAL: 'normal',
        ADD: 'add',
        CUSTOM: 'custom'
    },

    BLEND_EQUATION: {
        ADD: 0x8006,
        SUBTRACT: 0x800A,
        REVERSE_SUBTRACT: 0x800B
    },

    BLEND_FACTOR: {
        ZERO: 0,
        ONE: 1,
        SRC_COLOR: 0x0300,
        ONE_MINUS_SRC_COLOR: 0x0301,
        SRC_ALPHA: 0x0302,
        ONE_MINUS_SRC_ALPHA: 0x0303,
        DST_ALPHA: 0x0304,
        ONE_MINUS_DST_ALPHA: 0x0305,
        DST_COLOR: 0x0306,
        ONE_MINUS_DST_COLOR: 0x0307
    },

    CULL_FACE_TYPE: {
        NONE: 'none',
        FRONT: 'front',
        BACK: 'back',
        FRONT_AND_BACK: 'front_and_back'
    },

    DRAW_SIDE: {
        FRONT: 'front',
        BACK: 'back',
        DOUBLE: 'double'
    },

    DRAW_MODE: {
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6
    },

    SHADING_TYPE: {
        SMOOTH_SHADING: 'smooth_shading',
        FLAT_SHADING: 'flat_shading'
    },

    VERTEX_COLOR: {
        NONE: 0,
        RGB: 1,
        RGBA: 2
    },

    ENVMAP_COMBINE_TYPE: {
        MULTIPLY: 'ENVMAP_BLENDING_MULTIPLY',
        MIX: 'ENVMAP_BLENDING_MIX',
        ADD: 'ENVMAP_BLENDING_ADD'
    },

    WEBGL_COMPARE_FUNC: {
        LEQUAL: 0x0203,
        GEQUAL: 0x0206,
        LESS: 0x0201,
        GREATER: 0x0204,
        EQUAL: 0x0202,
        NOTEQUAL: 0x0205,
        ALWAYS: 0x0207,
        NEVER: 0x0200
    },

    WEBGL_OP: {
        KEEP: 0x1E00,
        REPLACE: 0x1E01,
        INCR: 0x1E02,
        DECR: 0x1E03,
        INVERT: 0x150A,
        INCR_WRAP: 0x8507,
        DECR_WRAP: 0x8508
    }

};

module.exports = LAYER3D_CONST;
