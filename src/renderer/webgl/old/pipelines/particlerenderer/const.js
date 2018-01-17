var CONST = {
    /*
    struct v
    {
        float position[2];
        float tex_coord[2];
        unsigned int color;
    };
    */
    VERTEX_SIZE: 20, /* sizeof(v) */
    INDEX_SIZE: 2,
    VERTEX_COUNT: 4,
    INDEX_COUNT: 6,
    COMPONENT32_COUNT: 5, /* sizeof(v) / 4 */
    MAX: 16000

};

module.exports = CONST;