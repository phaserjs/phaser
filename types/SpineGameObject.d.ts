/// <reference path="./spine.d.ts" />
/// <reference path="./SpinePlugin.d.ts" />

declare class SpineGameObject extends Phaser.GameObjects.GameObject implements Omit<Phaser.GameObjects.Components.ComputedSize, 'setSize'>, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Flip, Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible {
    constructor(scene: Phaser.Scene, pluginManager: SpinePlugin, x: number, y: number, key?: string, animationName?: string, loop?: boolean);

    alpha: number;
    angle: integer;

    readonly blendMode: number;

    blue: number;
    bounds: any;
    displayOriginX: number;
    displayOriginY: number;
    drawDebug: boolean;
    depth: number;
    displayWidth: number;
    displayHeight: number;
    flipX: boolean;
    flipY: boolean;
    green: number;
    height: number;
    plugin: SpinePlugin;
    preMultipliedAlpha: boolean;
    red: number;
    root: spine.Bone;
    rotation: number;
    scale: number;
    scaleX: number
    scaleY: number
    scrollFactorX: number;
    scrollFactorY: number;
    skeleton: spine.Skeleton;
    skeletonData: spine.SkeletonData;
    // @ts-ignore - spine.AnimationState significantly different than GameObject.state
    state: spine.AnimationState;
    stateData: spine.AnimationStateData;
    timeScale: number;
    visible: boolean;
    x: number;
    y: number;
    z: number;
    w: number;
    width: number;

    addAnimation(trackIndex: integer, animationName: string, loop?: boolean, delay?: integer): spine.TrackEntry;
    angleBoneToXY(bone: spine.Bone, worldX: number, worldY: number, offset?: number, minAngle?: number, maxAngle?: number): SpineGameObject;
    clearTrack(trackIndex: integer): SpineGameObject;
    clearTracks(): SpineGameObject;
    findAnimation(animationName: string): spine.Animation;
    findBone(boneName: string): spine.Bone;
    findBoneIndex(boneName: string): number;
    findEvent(eventDataName: string): spine.EventData;
    findIkConstraint(constraintName: string): spine.IkConstraintData;
    findPathConstraint(constraintName: string): spine.PathConstraintData;
    findPathConstraintIndex(constraintName: string): number;
    findSkin(skinName: string): spine.Skin;
    findSlot(slotName: string): spine.Slot;
    findSlotIndex(slotName: string): number;
    findTransformConstraint(constraintName: string): spine.TransformConstraintData;
    getAnimationList(): string[];
    getAttachment(slotIndex: integer, attachmentName: string): spine.Attachment;
    getAttachmentByName(slotName: string, attachmentName: string): spine.Attachment;
    getBoneList(): string[];
    getBounds(): any;
    getCurrentAnimation(trackIndex?: integer): spine.Animation;
    getLocalTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;
    getParentRotation(): number;
    getRootBone(): spine.Bone;
    getSkinList(): string[];
    getSlotList(): string[];
    getWorldTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix, parentMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;
    play(animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): SpineGameObject;

    protected preUpdate(time: number, delta: number): void;
    protected preDestroy(): void;

    refresh(): SpineGameObject;
    resetFlip(): this;
    setAlpha(value?: number): SpineGameObject;
    setAngle(degrees?: number): this;
    setAnimation(trackIndex: integer, animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): spine.TrackEntry;
    setAttachment(slotName: string, attachmentName: string): SpineGameObject;
    setBonesToSetupPose(): SpineGameObject;
    setColor(color?: integer, slotName?: string): SpineGameObject;
    setDepth(value: integer): this;
    setDisplaySize(width: number, height: number): this;
    setEmptyAnimation(trackIndex: integer, mixDuration?: integer): spine.TrackEntry;
    setFlipX(value: boolean): this;
    setFlipY(value: boolean): this;
    setFlip(x: boolean, y: boolean): this;
    setMix(fromName: string, toName: string, duration?: number): SpineGameObject;
    setOffset(offsetX?: number, offsetY?: number): SpineGameObject;
    setPosition(x?: number, y?: number, z?: number, w?: number): this;
    setRandomPosition(x?: number, y?: number, width?: number, height?: number): this;
    setRotation(radians?: number): this;
    setScale(x: number, y?: number): this;
    setScrollFactor(x: number, y?: number): this;
    setSize(width?: number, height?: number, offsetX?: number, offsetY?: number): SpineGameObject;
    setSkeleton(atlasDataKey: string, skeletonJSON: object, animationName?: string, loop?: boolean): SpineGameObject;
    setSkeletonFromJSON(atlasDataKey: string, skeletonJSON: object, animationName?: string, loop?: boolean): SpineGameObject;
    setSkin(newSkin: spine.Skin): SpineGameObject;
    setSkinByName(skinName: string): SpineGameObject;
    setSlotsToSetupPose(): SpineGameObject;
    setToSetupPose(): SpineGameObject;
    setVisible(value: boolean): this;
    setX(value?: number): this;
    setY(value?: number): this;
    setZ(value?: number): this;
    setW(value?: number): this;
    toggleFlipX(): this;
    toggleFlipY(): this;
    updateSize(): SpineGameObject;
    willRender(): boolean;
}

declare interface SpineGameObjectConfig extends Phaser.Types.GameObjects.GameObjectConfig {
    key?: string;
    animationName?: string;
    loop?: boolean;
    skinName?: string;
    slotName?: string;
    attachmentName?: string;
}
