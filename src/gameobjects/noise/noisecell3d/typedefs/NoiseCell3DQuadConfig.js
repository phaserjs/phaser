/**
 * @typedef {object} Phaser.Types.GameObjects.NoiseCell3D.NoiseCell3DQuadConfig
 * @since 4.0.0
 *
 * @property {number[]} [noiseCells=[ 32, 32, 32 ]] - The number of cells in each dimension.
 * @property {number[]} [noiseWrap] - How many cells in each dimension before the pattern repeats. `noiseCells` must be integers for this to work properly. By default, this is the same as `noiseCells`.
 * @property {number[]} [noiseOffset=[ 0, 0, 0 ]] - The offset of the noise texture.
 * @property {number[]} [noiseVariation=[ 1, 1, 1 ]] - The variation of the cells away from a perfect grid.
 * @property {number} [noiseIterations=1] - How many octaves of noise to render, creating a more detailed output.
 * @property {number} [noiseMode=0] - Which mode to render. 0 is sharp edged cells. 1 is flat colored cells. 2 is soft edged cells.
 * @property {number} [noiseSmoothing=1] - How smooth to render in mode 2.
 * @property {boolean} [noiseNormalMap=false] - Whether to convert the noise to a normal map.
 * @property {number} [noiseNormalScale=1] - How much curvature to include in the normal map, if `noiseNormalMap` is enabled.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorStart=0x000000] - The color at the middle of the cells.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorEnd=0xffffff] - The color at the edge of the cells.
 * @property {number[]} [noiseSeed=[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]] - The seed which determines the cell pattern. A different seed creates an entirely different pattern.
 */
