module.exports = {
    vert: `
        precision mediump float;
        uniform mat4 u_view_matrix;

        attribute vec2 a_position;
        attribute vec2 a_tex_coord;
        attribute vec2 a_scale;
        attribute float a_rotation;
        attribute vec4 a_color;

        varying vec4 v_color;
        varying vec2 v_tex_coord;

        void main()
        {
            vec2 position = vec2(0.0, 0.0);
            float cos_rot = cos(a_rotation);
            float sin_rot = sin(a_rotation);

            position.x = a_position.x * cos_rot - a_position.y * sin_rot;
            position.y = a_position.x * sin_rot + a_position.y * cos_rot;
            position = position * a_scale;

            gl_Position = u_view_matrix * vec4(position, 1.0, 1.0);

            v_color = a_color;
            v_tex_coord = a_tex_coord;
        }
    `,
    frag: `
        precision mediump float;

        uniform sampler2D u_main_sampler;

        varying vec4 v_color;
        varying vec2 v_tex_coord;

        void main()
        {
            gl_FragColor = texture2D(u_main_sampler, v_tex_coord) * v_color;
        }

    `
};