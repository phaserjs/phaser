/**
 * @typedef {object} Phaser.Types.Textures.SpriteSheetConfig
 * @since 3.0.0
 * 
 * @property {number} frameWidth - The fixed width of each frame.
 * @property {number} [frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
 * @property {number} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
 * @property {number} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
 * @property {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @property {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 */
