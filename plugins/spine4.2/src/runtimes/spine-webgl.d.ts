declare module spine {
    class Animation {
        name: string;
        timelines: Array<Timeline>;
        timelineIds: Array<boolean>;
        duration: number;
        constructor(name: string, timelines: Array<Timeline>, duration: number);
        hasTimeline(id: number): boolean;
        apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
        static binarySearch(values: ArrayLike<number>, target: number, step?: number): number;
        static linearSearch(values: ArrayLike<number>, target: number, step: number): number;
    }
    interface Timeline {
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
        getPropertyId(): number;
    }
    enum MixBlend {
        setup = 0,
        first = 1,
        replace = 2,
        add = 3
    }
    enum MixDirection {
        mixIn = 0,
        mixOut = 1
    }
    enum TimelineType {
        rotate = 0,
        translate = 1,
        scale = 2,
        shear = 3,
        attachment = 4,
        color = 5,
        deform = 6,
        event = 7,
        drawOrder = 8,
        ikConstraint = 9,
        transformConstraint = 10,
        pathConstraintPosition = 11,
        pathConstraintSpacing = 12,
        pathConstraintMix = 13,
        twoColor = 14
    }
    abstract class CurveTimeline implements Timeline {
        static LINEAR: number;
        static STEPPED: number;
        static BEZIER: number;
        static BEZIER_SIZE: number;
        private curves;
        abstract getPropertyId(): number;
        constructor(frameCount: number);
        getFrameCount(): number;
        setLinear(frameIndex: number): void;
        setStepped(frameIndex: number): void;
        getCurveType(frameIndex: number): number;
        setCurve(frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
        getCurvePercent(frameIndex: number, percent: number): number;
        abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class RotateTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATION: number;
        static ROTATION: number;
        boneIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, degrees: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class TranslateTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_X: number;
        static PREV_Y: number;
        static X: number;
        static Y: number;
        boneIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, x: number, y: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class ScaleTimeline extends TranslateTimeline {
        constructor(frameCount: number);
        getPropertyId(): number;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class ShearTimeline extends TranslateTimeline {
        constructor(frameCount: number);
        getPropertyId(): number;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class ColorTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_R: number;
        static PREV_G: number;
        static PREV_B: number;
        static PREV_A: number;
        static R: number;
        static G: number;
        static B: number;
        static A: number;
        slotIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class TwoColorTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_R: number;
        static PREV_G: number;
        static PREV_B: number;
        static PREV_A: number;
        static PREV_R2: number;
        static PREV_G2: number;
        static PREV_B2: number;
        static R: number;
        static G: number;
        static B: number;
        static A: number;
        static R2: number;
        static G2: number;
        static B2: number;
        slotIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class AttachmentTimeline implements Timeline {
        slotIndex: number;
        frames: ArrayLike<number>;
        attachmentNames: Array<string>;
        constructor(frameCount: number);
        getPropertyId(): number;
        getFrameCount(): number;
        setFrame(frameIndex: number, time: number, attachmentName: string): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
        setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string): void;
    }
    class DeformTimeline extends CurveTimeline {
        slotIndex: number;
        attachment: VertexAttachment;
        frames: ArrayLike<number>;
        frameVertices: Array<ArrayLike<number>>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, vertices: ArrayLike<number>): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class EventTimeline implements Timeline {
        frames: ArrayLike<number>;
        events: Array<Event>;
        constructor(frameCount: number);
        getPropertyId(): number;
        getFrameCount(): number;
        setFrame(frameIndex: number, event: Event): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class DrawOrderTimeline implements Timeline {
        frames: ArrayLike<number>;
        drawOrders: Array<Array<number>>;
        constructor(frameCount: number);
        getPropertyId(): number;
        getFrameCount(): number;
        setFrame(frameIndex: number, time: number, drawOrder: Array<number>): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class IkConstraintTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_MIX: number;
        static PREV_SOFTNESS: number;
        static PREV_BEND_DIRECTION: number;
        static PREV_COMPRESS: number;
        static PREV_STRETCH: number;
        static MIX: number;
        static SOFTNESS: number;
        static BEND_DIRECTION: number;
        static COMPRESS: number;
        static STRETCH: number;
        ikConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, mix: number, softness: number, bendDirection: number, compress: boolean, stretch: boolean): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class TransformConstraintTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATE: number;
        static PREV_TRANSLATE: number;
        static PREV_SCALE: number;
        static PREV_SHEAR: number;
        static ROTATE: number;
        static TRANSLATE: number;
        static SCALE: number;
        static SHEAR: number;
        transformConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number, scaleMix: number, shearMix: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class PathConstraintPositionTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_VALUE: number;
        static VALUE: number;
        pathConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, value: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class PathConstraintSpacingTimeline extends PathConstraintPositionTimeline {
        constructor(frameCount: number);
        getPropertyId(): number;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
    class PathConstraintMixTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATE: number;
        static PREV_TRANSLATE: number;
        static ROTATE: number;
        static TRANSLATE: number;
        pathConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        getPropertyId(): number;
        setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
    }
}
declare module spine {
    class AnimationState {
        static emptyAnimation: Animation;
        static SUBSEQUENT: number;
        static FIRST: number;
        static HOLD_SUBSEQUENT: number;
        static HOLD_FIRST: number;
        static HOLD_MIX: number;
        static SETUP: number;
        static CURRENT: number;
        data: AnimationStateData;
        tracks: TrackEntry[];
        timeScale: number;
        unkeyedState: number;
        events: Event[];
        listeners: AnimationStateListener[];
        queue: EventQueue;
        propertyIDs: IntSet;
        animationsChanged: boolean;
        trackEntryPool: Pool<TrackEntry>;
        constructor(data: AnimationStateData);
        update(delta: number): void;
        updateMixingFrom(to: TrackEntry, delta: number): boolean;
        apply(skeleton: Skeleton): boolean;
        applyMixingFrom(to: TrackEntry, skeleton: Skeleton, blend: MixBlend): number;
        applyAttachmentTimeline(timeline: AttachmentTimeline, skeleton: Skeleton, time: number, blend: MixBlend, attachments: boolean): void;
        setAttachment(skeleton: Skeleton, slot: Slot, attachmentName: string, attachments: boolean): void;
        applyRotateTimeline(timeline: Timeline, skeleton: Skeleton, time: number, alpha: number, blend: MixBlend, timelinesRotation: Array<number>, i: number, firstFrame: boolean): void;
        queueEvents(entry: TrackEntry, animationTime: number): void;
        clearTracks(): void;
        clearTrack(trackIndex: number): void;
        setCurrent(index: number, current: TrackEntry, interrupt: boolean): void;
        setAnimation(trackIndex: number, animationName: string, loop: boolean): TrackEntry;
        setAnimationWith(trackIndex: number, animation: Animation, loop: boolean): TrackEntry;
        addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): TrackEntry;
        addAnimationWith(trackIndex: number, animation: Animation, loop: boolean, delay: number): TrackEntry;
        setEmptyAnimation(trackIndex: number, mixDuration: number): TrackEntry;
        addEmptyAnimation(trackIndex: number, mixDuration: number, delay: number): TrackEntry;
        setEmptyAnimations(mixDuration: number): void;
        expandToIndex(index: number): TrackEntry;
        trackEntry(trackIndex: number, animation: Animation, loop: boolean, last: TrackEntry): TrackEntry;
        disposeNext(entry: TrackEntry): void;
        _animationsChanged(): void;
        computeHold(entry: TrackEntry): void;
        getCurrent(trackIndex: number): TrackEntry;
        addListener(listener: AnimationStateListener): void;
        removeListener(listener: AnimationStateListener): void;
        clearListeners(): void;
        clearListenerNotifications(): void;
    }
    class TrackEntry {
        animation: Animation;
        next: TrackEntry;
        mixingFrom: TrackEntry;
        mixingTo: TrackEntry;
        listener: AnimationStateListener;
        trackIndex: number;
        loop: boolean;
        holdPrevious: boolean;
        eventThreshold: number;
        attachmentThreshold: number;
        drawOrderThreshold: number;
        animationStart: number;
        animationEnd: number;
        animationLast: number;
        nextAnimationLast: number;
        delay: number;
        trackTime: number;
        trackLast: number;
        nextTrackLast: number;
        trackEnd: number;
        timeScale: number;
        alpha: number;
        mixTime: number;
        mixDuration: number;
        interruptAlpha: number;
        totalAlpha: number;
        mixBlend: MixBlend;
        timelineMode: number[];
        timelineHoldMix: TrackEntry[];
        timelinesRotation: number[];
        reset(): void;
        getAnimationTime(): number;
        setAnimationLast(animationLast: number): void;
        isComplete(): boolean;
        resetRotationDirections(): void;
    }
    class EventQueue {
        objects: Array<any>;
        drainDisabled: boolean;
        animState: AnimationState;
        constructor(animState: AnimationState);
        start(entry: TrackEntry): void;
        interrupt(entry: TrackEntry): void;
        end(entry: TrackEntry): void;
        dispose(entry: TrackEntry): void;
        complete(entry: TrackEntry): void;
        event(entry: TrackEntry, event: Event): void;
        drain(): void;
        clear(): void;
    }
    enum EventType {
        start = 0,
        interrupt = 1,
        end = 2,
        dispose = 3,
        complete = 4,
        event = 5
    }
    interface AnimationStateListener {
        start(entry: TrackEntry): void;
        interrupt(entry: TrackEntry): void;
        end(entry: TrackEntry): void;
        dispose(entry: TrackEntry): void;
        complete(entry: TrackEntry): void;
        event(entry: TrackEntry, event: Event): void;
    }
    abstract class AnimationStateAdapter implements AnimationStateListener {
        start(entry: TrackEntry): void;
        interrupt(entry: TrackEntry): void;
        end(entry: TrackEntry): void;
        dispose(entry: TrackEntry): void;
        complete(entry: TrackEntry): void;
        event(entry: TrackEntry, event: Event): void;
    }
}
declare module spine {
    class AnimationStateData {
        skeletonData: SkeletonData;
        animationToMixTime: Map<number>;
        defaultMix: number;
        constructor(skeletonData: SkeletonData);
        setMix(fromName: string, toName: string, duration: number): void;
        setMixWith(from: Animation, to: Animation, duration: number): void;
        getMix(from: Animation, to: Animation): number;
    }
}
declare module spine {
    class AssetManager implements Disposable {
        private pathPrefix;
        private textureLoader;
        private assets;
        private errors;
        private toLoad;
        private loaded;
        private rawDataUris;
        constructor(textureLoader: (image: HTMLImageElement) => any, pathPrefix?: string);
        private downloadText;
        private downloadBinary;
        setRawDataURI(path: string, data: string): void;
        loadBinary(path: string, success?: (path: string, binary: Uint8Array) => void, error?: (path: string, error: string) => void): void;
        loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, error: string) => void): void;
        loadTexture(path: string, success?: (path: string, image: HTMLImageElement) => void, error?: (path: string, error: string) => void): void;
        loadTextureAtlas(path: string, success?: (path: string, atlas: TextureAtlas) => void, error?: (path: string, error: string) => void): void;
        get(path: string): any;
        remove(path: string): void;
        removeAll(): void;
        isLoadingComplete(): boolean;
        getToLoad(): number;
        getLoaded(): number;
        dispose(): void;
        hasErrors(): boolean;
        getErrors(): Map<string>;
    }
}
declare module spine {
    class AtlasAttachmentLoader implements AttachmentLoader {
        atlas: TextureAtlas;
        constructor(atlas: TextureAtlas);
        newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
        newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
        newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
        newPathAttachment(skin: Skin, name: string): PathAttachment;
        newPointAttachment(skin: Skin, name: string): PointAttachment;
        newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
    }
}
declare module spine {
    enum BlendMode {
        Normal = 0,
        Additive = 1,
        Multiply = 2,
        Screen = 3
    }
}
declare module spine {
    class Bone implements Updatable {
        data: BoneData;
        skeleton: Skeleton;
        parent: Bone;
        children: Bone[];
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        ax: number;
        ay: number;
        arotation: number;
        ascaleX: number;
        ascaleY: number;
        ashearX: number;
        ashearY: number;
        appliedValid: boolean;
        a: number;
        b: number;
        c: number;
        d: number;
        worldY: number;
        worldX: number;
        sorted: boolean;
        active: boolean;
        constructor(data: BoneData, skeleton: Skeleton, parent: Bone);
        isActive(): boolean;
        update(): void;
        updateWorldTransform(): void;
        updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number): void;
        setToSetupPose(): void;
        getWorldRotationX(): number;
        getWorldRotationY(): number;
        getWorldScaleX(): number;
        getWorldScaleY(): number;
        updateAppliedTransform(): void;
        worldToLocal(world: Vector2): Vector2;
        localToWorld(local: Vector2): Vector2;
        worldToLocalRotation(worldRotation: number): number;
        localToWorldRotation(localRotation: number): number;
        rotateWorld(degrees: number): void;
    }
}
declare module spine {
    class BoneData {
        index: number;
        name: string;
        parent: BoneData;
        length: number;
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        transformMode: TransformMode;
        skinRequired: boolean;
        color: Color;
        constructor(index: number, name: string, parent: BoneData);
    }
    enum TransformMode {
        Normal = 0,
        OnlyTranslation = 1,
        NoRotationOrReflection = 2,
        NoScale = 3,
        NoScaleOrReflection = 4
    }
}
declare module spine {
    abstract class ConstraintData {
        name: string;
        order: number;
        skinRequired: boolean;
        constructor(name: string, order: number, skinRequired: boolean);
    }
}
declare module spine {
    class Event {
        data: EventData;
        intValue: number;
        floatValue: number;
        stringValue: string;
        time: number;
        volume: number;
        balance: number;
        constructor(time: number, data: EventData);
    }
}
declare module spine {
    class EventData {
        name: string;
        intValue: number;
        floatValue: number;
        stringValue: string;
        audioPath: string;
        volume: number;
        balance: number;
        constructor(name: string);
    }
}
declare module spine {
    class IkConstraint implements Updatable {
        data: IkConstraintData;
        bones: Array<Bone>;
        target: Bone;
        bendDirection: number;
        compress: boolean;
        stretch: boolean;
        mix: number;
        softness: number;
        active: boolean;
        constructor(data: IkConstraintData, skeleton: Skeleton);
        isActive(): boolean;
        apply(): void;
        update(): void;
        apply1(bone: Bone, targetX: number, targetY: number, compress: boolean, stretch: boolean, uniform: boolean, alpha: number): void;
        apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, stretch: boolean, softness: number, alpha: number): void;
    }
}
declare module spine {
    class IkConstraintData extends ConstraintData {
        bones: BoneData[];
        target: BoneData;
        bendDirection: number;
        compress: boolean;
        stretch: boolean;
        uniform: boolean;
        mix: number;
        softness: number;
        constructor(name: string);
    }
}
declare module spine {
    class PathConstraint implements Updatable {
        static NONE: number;
        static BEFORE: number;
        static AFTER: number;
        static epsilon: number;
        data: PathConstraintData;
        bones: Array<Bone>;
        target: Slot;
        position: number;
        spacing: number;
        rotateMix: number;
        translateMix: number;
        spaces: number[];
        positions: number[];
        world: number[];
        curves: number[];
        lengths: number[];
        segments: number[];
        active: boolean;
        constructor(data: PathConstraintData, skeleton: Skeleton);
        isActive(): boolean;
        apply(): void;
        update(): void;
        computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): number[];
        addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
        addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
        addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
    }
}
declare module spine {
    class PathConstraintData extends ConstraintData {
        bones: BoneData[];
        target: SlotData;
        positionMode: PositionMode;
        spacingMode: SpacingMode;
        rotateMode: RotateMode;
        offsetRotation: number;
        position: number;
        spacing: number;
        rotateMix: number;
        translateMix: number;
        constructor(name: string);
    }
    enum PositionMode {
        Fixed = 0,
        Percent = 1
    }
    enum SpacingMode {
        Length = 0,
        Fixed = 1,
        Percent = 2
    }
    enum RotateMode {
        Tangent = 0,
        Chain = 1,
        ChainScale = 2
    }
}
declare module spine {
    class SharedAssetManager implements Disposable {
        private pathPrefix;
        private clientAssets;
        private queuedAssets;
        private rawAssets;
        private errors;
        constructor(pathPrefix?: string);
        private queueAsset;
        loadText(clientId: string, path: string): void;
        loadJson(clientId: string, path: string): void;
        loadTexture(clientId: string, textureLoader: (image: HTMLImageElement | ImageBitmap) => any, path: string): void;
        get(clientId: string, path: string): any;
        private updateClientAssets;
        isLoadingComplete(clientId: string): boolean;
        dispose(): void;
        hasErrors(): boolean;
        getErrors(): Map<string>;
    }
}
declare module spine {
    class Skeleton {
        data: SkeletonData;
        bones: Array<Bone>;
        slots: Array<Slot>;
        drawOrder: Array<Slot>;
        ikConstraints: Array<IkConstraint>;
        transformConstraints: Array<TransformConstraint>;
        pathConstraints: Array<PathConstraint>;
        _updateCache: Updatable[];
        updateCacheReset: Updatable[];
        skin: Skin;
        color: Color;
        time: number;
        scaleX: number;
        scaleY: number;
        x: number;
        y: number;
        constructor(data: SkeletonData);
        updateCache(): void;
        sortIkConstraint(constraint: IkConstraint): void;
        sortPathConstraint(constraint: PathConstraint): void;
        sortTransformConstraint(constraint: TransformConstraint): void;
        sortPathConstraintAttachment(skin: Skin, slotIndex: number, slotBone: Bone): void;
        sortPathConstraintAttachmentWith(attachment: Attachment, slotBone: Bone): void;
        sortBone(bone: Bone): void;
        sortReset(bones: Array<Bone>): void;
        updateWorldTransform(): void;
        setToSetupPose(): void;
        setBonesToSetupPose(): void;
        setSlotsToSetupPose(): void;
        getRootBone(): Bone;
        findBone(boneName: string): Bone;
        findBoneIndex(boneName: string): number;
        findSlot(slotName: string): Slot;
        findSlotIndex(slotName: string): number;
        setSkinByName(skinName: string): void;
        setSkin(newSkin: Skin): void;
        getAttachmentByName(slotName: string, attachmentName: string): Attachment;
        getAttachment(slotIndex: number, attachmentName: string): Attachment;
        setAttachment(slotName: string, attachmentName: string): void;
        findIkConstraint(constraintName: string): IkConstraint;
        findTransformConstraint(constraintName: string): TransformConstraint;
        findPathConstraint(constraintName: string): PathConstraint;
        getBounds(offset: Vector2, size: Vector2, temp?: Array<number>): void;
        update(delta: number): void;
    }
}
declare module spine {
    class SkeletonBinary {
        static AttachmentTypeValues: number[];
        static TransformModeValues: TransformMode[];
        static PositionModeValues: PositionMode[];
        static SpacingModeValues: SpacingMode[];
        static RotateModeValues: RotateMode[];
        static BlendModeValues: BlendMode[];
        static BONE_ROTATE: number;
        static BONE_TRANSLATE: number;
        static BONE_SCALE: number;
        static BONE_SHEAR: number;
        static SLOT_ATTACHMENT: number;
        static SLOT_COLOR: number;
        static SLOT_TWO_COLOR: number;
        static PATH_POSITION: number;
        static PATH_SPACING: number;
        static PATH_MIX: number;
        static CURVE_LINEAR: number;
        static CURVE_STEPPED: number;
        static CURVE_BEZIER: number;
        scale: number;
        attachmentLoader: AttachmentLoader;
        private linkedMeshes;
        constructor(attachmentLoader: AttachmentLoader);
        readSkeletonData(binary: Uint8Array): SkeletonData;
        private readSkin;
        private readAttachment;
        private readVertices;
        private readFloatArray;
        private readShortArray;
        private readAnimation;
        private readCurve;
        setCurve(timeline: CurveTimeline, frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
    }
}
declare module spine {
    class SkeletonBounds {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        boundingBoxes: BoundingBoxAttachment[];
        polygons: ArrayLike<number>[];
        private polygonPool;
        update(skeleton: Skeleton, updateAabb: boolean): void;
        aabbCompute(): void;
        aabbContainsPoint(x: number, y: number): boolean;
        aabbIntersectsSegment(x1: number, y1: number, x2: number, y2: number): boolean;
        aabbIntersectsSkeleton(bounds: SkeletonBounds): boolean;
        containsPoint(x: number, y: number): BoundingBoxAttachment;
        containsPointPolygon(polygon: ArrayLike<number>, x: number, y: number): boolean;
        intersectsSegment(x1: number, y1: number, x2: number, y2: number): BoundingBoxAttachment;
        intersectsSegmentPolygon(polygon: ArrayLike<number>, x1: number, y1: number, x2: number, y2: number): boolean;
        getPolygon(boundingBox: BoundingBoxAttachment): ArrayLike<number>;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module spine {
    class SkeletonClipping {
        private triangulator;
        private clippingPolygon;
        private clipOutput;
        clippedVertices: number[];
        clippedTriangles: number[];
        private scratch;
        private clipAttachment;
        private clippingPolygons;
        clipStart(slot: Slot, clip: ClippingAttachment): number;
        clipEndWithSlot(slot: Slot): void;
        clipEnd(): void;
        isClipping(): boolean;
        clipTriangles(vertices: ArrayLike<number>, verticesLength: number, triangles: ArrayLike<number>, trianglesLength: number, uvs: ArrayLike<number>, light: Color, dark: Color, twoColor: boolean): void;
        clip(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, clippingArea: Array<number>, output: Array<number>): boolean;
        static makeClockwise(polygon: ArrayLike<number>): void;
    }
}
declare module spine {
    class SkeletonData {
        name: string;
        bones: BoneData[];
        slots: SlotData[];
        skins: Skin[];
        defaultSkin: Skin;
        events: EventData[];
        animations: Animation[];
        ikConstraints: IkConstraintData[];
        transformConstraints: TransformConstraintData[];
        pathConstraints: PathConstraintData[];
        x: number;
        y: number;
        width: number;
        height: number;
        version: string;
        hash: string;
        fps: number;
        imagesPath: string;
        audioPath: string;
        findBone(boneName: string): BoneData;
        findBoneIndex(boneName: string): number;
        findSlot(slotName: string): SlotData;
        findSlotIndex(slotName: string): number;
        findSkin(skinName: string): Skin;
        findEvent(eventDataName: string): EventData;
        findAnimation(animationName: string): Animation;
        findIkConstraint(constraintName: string): IkConstraintData;
        findTransformConstraint(constraintName: string): TransformConstraintData;
        findPathConstraint(constraintName: string): PathConstraintData;
        findPathConstraintIndex(pathConstraintName: string): number;
    }
}
declare module spine {
    class SkeletonJson {
        attachmentLoader: AttachmentLoader;
        scale: number;
        private linkedMeshes;
        constructor(attachmentLoader: AttachmentLoader);
        readSkeletonData(json: string | any): SkeletonData;
        readAttachment(map: any, skin: Skin, slotIndex: number, name: string, skeletonData: SkeletonData): Attachment;
        readVertices(map: any, attachment: VertexAttachment, verticesLength: number): void;
        readAnimation(map: any, name: string, skeletonData: SkeletonData): void;
        readCurve(map: any, timeline: CurveTimeline, frameIndex: number): void;
        getValue(map: any, prop: string, defaultValue: any): any;
        static blendModeFromString(str: string): BlendMode;
        static positionModeFromString(str: string): PositionMode;
        static spacingModeFromString(str: string): SpacingMode;
        static rotateModeFromString(str: string): RotateMode;
        static transformModeFromString(str: string): TransformMode;
    }
}
declare module spine {
    class SkinEntry {
        slotIndex: number;
        name: string;
        attachment: Attachment;
        constructor(slotIndex: number, name: string, attachment: Attachment);
    }
    class Skin {
        name: string;
        attachments: Map<Attachment>[];
        bones: BoneData[];
        constraints: ConstraintData[];
        constructor(name: string);
        setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
        addSkin(skin: Skin): void;
        copySkin(skin: Skin): void;
        getAttachment(slotIndex: number, name: string): Attachment;
        removeAttachment(slotIndex: number, name: string): void;
        getAttachments(): Array<SkinEntry>;
        getAttachmentsForSlot(slotIndex: number, attachments: Array<SkinEntry>): void;
        clear(): void;
        attachAll(skeleton: Skeleton, oldSkin: Skin): void;
    }
}
declare module spine {
    class Slot {
        data: SlotData;
        bone: Bone;
        color: Color;
        darkColor: Color;
        attachment: Attachment;
        private attachmentTime;
        attachmentState: number;
        deform: number[];
        constructor(data: SlotData, bone: Bone);
        getSkeleton(): Skeleton;
        getAttachment(): Attachment;
        setAttachment(attachment: Attachment): void;
        setAttachmentTime(time: number): void;
        getAttachmentTime(): number;
        setToSetupPose(): void;
    }
}
declare module spine {
    class SlotData {
        index: number;
        name: string;
        boneData: BoneData;
        color: Color;
        darkColor: Color;
        attachmentName: string;
        blendMode: BlendMode;
        constructor(index: number, name: string, boneData: BoneData);
    }
}
declare module spine {
    abstract class Texture {
        protected _image: HTMLImageElement | ImageBitmap;
        constructor(image: HTMLImageElement | ImageBitmap);
        getImage(): HTMLImageElement | ImageBitmap;
        abstract setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        abstract setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        abstract dispose(): void;
        static filterFromString(text: string): TextureFilter;
        static wrapFromString(text: string): TextureWrap;
    }
    enum TextureFilter {
        Nearest = 9728,
        Linear = 9729,
        MipMap = 9987,
        MipMapNearestNearest = 9984,
        MipMapLinearNearest = 9985,
        MipMapNearestLinear = 9986,
        MipMapLinearLinear = 9987
    }
    enum TextureWrap {
        MirroredRepeat = 33648,
        ClampToEdge = 33071,
        Repeat = 10497
    }
    class TextureRegion {
        renderObject: any;
        u: number;
        v: number;
        u2: number;
        v2: number;
        width: number;
        height: number;
        rotate: boolean;
        offsetX: number;
        offsetY: number;
        originalWidth: number;
        originalHeight: number;
    }
    class FakeTexture extends Texture {
        setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        dispose(): void;
    }
}
declare module spine {
    class TextureAtlas implements Disposable {
        pages: TextureAtlasPage[];
        regions: TextureAtlasRegion[];
        constructor(atlasText: string, textureLoader: (path: string) => any);
        private load;
        findRegion(name: string): TextureAtlasRegion;
        dispose(): void;
    }
    class TextureAtlasPage {
        name: string;
        minFilter: TextureFilter;
        magFilter: TextureFilter;
        uWrap: TextureWrap;
        vWrap: TextureWrap;
        texture: Texture;
        width: number;
        height: number;
    }
    class TextureAtlasRegion extends TextureRegion {
        page: TextureAtlasPage;
        name: string;
        x: number;
        y: number;
        index: number;
        rotate: boolean;
        degrees: number;
        texture: Texture;
    }
}
declare module spine {
    class TransformConstraint implements Updatable {
        data: TransformConstraintData;
        bones: Array<Bone>;
        target: Bone;
        rotateMix: number;
        translateMix: number;
        scaleMix: number;
        shearMix: number;
        temp: Vector2;
        active: boolean;
        constructor(data: TransformConstraintData, skeleton: Skeleton);
        isActive(): boolean;
        apply(): void;
        update(): void;
        applyAbsoluteWorld(): void;
        applyRelativeWorld(): void;
        applyAbsoluteLocal(): void;
        applyRelativeLocal(): void;
    }
}
declare module spine {
    class TransformConstraintData extends ConstraintData {
        bones: BoneData[];
        target: BoneData;
        rotateMix: number;
        translateMix: number;
        scaleMix: number;
        shearMix: number;
        offsetRotation: number;
        offsetX: number;
        offsetY: number;
        offsetScaleX: number;
        offsetScaleY: number;
        offsetShearY: number;
        relative: boolean;
        local: boolean;
        constructor(name: string);
    }
}
declare module spine {
    class Triangulator {
        private convexPolygons;
        private convexPolygonsIndices;
        private indicesArray;
        private isConcaveArray;
        private triangles;
        private polygonPool;
        private polygonIndicesPool;
        triangulate(verticesArray: ArrayLike<number>): Array<number>;
        decompose(verticesArray: Array<number>, triangles: Array<number>): Array<Array<number>>;
        private static isConcave;
        private static positiveArea;
        private static winding;
    }
}
declare module spine {
    interface Updatable {
        update(): void;
        isActive(): boolean;
    }
}
declare module spine {
    interface Map<T> {
        [key: string]: T;
    }
    class IntSet {
        array: number[];
        add(value: number): boolean;
        contains(value: number): boolean;
        remove(value: number): void;
        clear(): void;
    }
    interface Disposable {
        dispose(): void;
    }
    interface Restorable {
        restore(): void;
    }
    class Color {
        r: number;
        g: number;
        b: number;
        a: number;
        static WHITE: Color;
        static RED: Color;
        static GREEN: Color;
        static BLUE: Color;
        static MAGENTA: Color;
        constructor(r?: number, g?: number, b?: number, a?: number);
        set(r: number, g: number, b: number, a: number): this;
        setFromColor(c: Color): this;
        setFromString(hex: string): this;
        add(r: number, g: number, b: number, a: number): this;
        clamp(): this;
        static rgba8888ToColor(color: Color, value: number): void;
        static rgb888ToColor(color: Color, value: number): void;
    }
    class MathUtils {
        static PI: number;
        static PI2: number;
        static radiansToDegrees: number;
        static radDeg: number;
        static degreesToRadians: number;
        static degRad: number;
        static clamp(value: number, min: number, max: number): number;
        static cosDeg(degrees: number): number;
        static sinDeg(degrees: number): number;
        static signum(value: number): number;
        static toInt(x: number): number;
        static cbrt(x: number): number;
        static randomTriangular(min: number, max: number): number;
        static randomTriangularWith(min: number, max: number, mode: number): number;
    }
    abstract class Interpolation {
        protected abstract applyInternal(a: number): number;
        apply(start: number, end: number, a: number): number;
    }
    class Pow extends Interpolation {
        protected power: number;
        constructor(power: number);
        applyInternal(a: number): number;
    }
    class PowOut extends Pow {
        constructor(power: number);
        applyInternal(a: number): number;
    }
    class Utils {
        static SUPPORTS_TYPED_ARRAYS: boolean;
        static arrayCopy<T>(source: ArrayLike<T>, sourceStart: number, dest: ArrayLike<T>, destStart: number, numElements: number): void;
        static setArraySize<T>(array: Array<T>, size: number, value?: any): Array<T>;
        static ensureArrayCapacity<T>(array: Array<T>, size: number, value?: any): Array<T>;
        static newArray<T>(size: number, defaultValue: T): Array<T>;
        static newFloatArray(size: number): ArrayLike<number>;
        static newShortArray(size: number): ArrayLike<number>;
        static toFloatArray(array: Array<number>): number[] | Float32Array;
        static toSinglePrecision(value: number): number;
        static webkit602BugfixHelper(alpha: number, blend: MixBlend): void;
        static contains<T>(array: Array<T>, element: T, identity?: boolean): boolean;
    }
    class DebugUtils {
        static logBones(skeleton: Skeleton): void;
    }
    class Pool<T> {
        private items;
        private instantiator;
        constructor(instantiator: () => T);
        obtain(): T;
        free(item: T): void;
        freeAll(items: ArrayLike<T>): void;
        clear(): void;
    }
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        set(x: number, y: number): Vector2;
        length(): number;
        normalize(): this;
    }
    class TimeKeeper {
        maxDelta: number;
        framesPerSecond: number;
        delta: number;
        totalTime: number;
        private lastTime;
        private frameCount;
        private frameTime;
        update(): void;
    }
    interface ArrayLike<T> {
        length: number;
        [n: number]: T;
    }
    class WindowedMean {
        values: Array<number>;
        addedValues: number;
        lastValue: number;
        mean: number;
        dirty: boolean;
        constructor(windowSize?: number);
        hasEnoughData(): boolean;
        addValue(value: number): void;
        getMean(): number;
    }
}
declare module spine {
    interface VertexEffect {
        begin(skeleton: Skeleton): void;
        transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
        end(): void;
    }
}
interface Math {
    fround(n: number): number;
}
declare module spine {
    abstract class Attachment {
        name: string;
        constructor(name: string);
        abstract copy(): Attachment;
    }
    abstract class VertexAttachment extends Attachment {
        private static nextID;
        id: number;
        bones: Array<number>;
        vertices: ArrayLike<number>;
        worldVerticesLength: number;
        deformAttachment: VertexAttachment;
        constructor(name: string);
        computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: ArrayLike<number>, offset: number, stride: number): void;
        copyTo(attachment: VertexAttachment): void;
    }
}
declare module spine {
    interface AttachmentLoader {
        newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
        newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
        newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
        newPathAttachment(skin: Skin, name: string): PathAttachment;
        newPointAttachment(skin: Skin, name: string): PointAttachment;
        newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
    }
}
declare module spine {
    enum AttachmentType {
        Region = 0,
        BoundingBox = 1,
        Mesh = 2,
        LinkedMesh = 3,
        Path = 4,
        Point = 5,
        Clipping = 6
    }
}
declare module spine {
    class BoundingBoxAttachment extends VertexAttachment {
        color: Color;
        constructor(name: string);
        copy(): Attachment;
    }
}
declare module spine {
    class ClippingAttachment extends VertexAttachment {
        endSlot: SlotData;
        color: Color;
        constructor(name: string);
        copy(): Attachment;
    }
}
declare module spine {
    class MeshAttachment extends VertexAttachment {
        region: TextureRegion;
        path: string;
        regionUVs: ArrayLike<number>;
        uvs: ArrayLike<number>;
        triangles: Array<number>;
        color: Color;
        width: number;
        height: number;
        hullLength: number;
        edges: Array<number>;
        private parentMesh;
        tempColor: Color;
        constructor(name: string);
        updateUVs(): void;
        getParentMesh(): MeshAttachment;
        setParentMesh(parentMesh: MeshAttachment): void;
        copy(): Attachment;
        newLinkedMesh(): MeshAttachment;
    }
}
declare module spine {
    class PathAttachment extends VertexAttachment {
        lengths: Array<number>;
        closed: boolean;
        constantSpeed: boolean;
        color: Color;
        constructor(name: string);
        copy(): Attachment;
    }
}
declare module spine {
    class PointAttachment extends VertexAttachment {
        x: number;
        y: number;
        rotation: number;
        color: Color;
        constructor(name: string);
        computeWorldPosition(bone: Bone, point: Vector2): Vector2;
        computeWorldRotation(bone: Bone): number;
        copy(): Attachment;
    }
}
declare module spine {
    class RegionAttachment extends Attachment {
        static OX1: number;
        static OY1: number;
        static OX2: number;
        static OY2: number;
        static OX3: number;
        static OY3: number;
        static OX4: number;
        static OY4: number;
        static X1: number;
        static Y1: number;
        static C1R: number;
        static C1G: number;
        static C1B: number;
        static C1A: number;
        static U1: number;
        static V1: number;
        static X2: number;
        static Y2: number;
        static C2R: number;
        static C2G: number;
        static C2B: number;
        static C2A: number;
        static U2: number;
        static V2: number;
        static X3: number;
        static Y3: number;
        static C3R: number;
        static C3G: number;
        static C3B: number;
        static C3A: number;
        static U3: number;
        static V3: number;
        static X4: number;
        static Y4: number;
        static C4R: number;
        static C4G: number;
        static C4B: number;
        static C4A: number;
        static U4: number;
        static V4: number;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        width: number;
        height: number;
        color: Color;
        path: string;
        rendererObject: any;
        region: TextureRegion;
        offset: ArrayLike<number>;
        uvs: ArrayLike<number>;
        tempColor: Color;
        constructor(name: string);
        updateOffset(): void;
        setRegion(region: TextureRegion): void;
        computeWorldVertices(bone: Bone, worldVertices: ArrayLike<number>, offset: number, stride: number): void;
        copy(): Attachment;
    }
}
declare module spine {
    class JitterEffect implements VertexEffect {
        jitterX: number;
        jitterY: number;
        constructor(jitterX: number, jitterY: number);
        begin(skeleton: Skeleton): void;
        transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
        end(): void;
    }
}
declare module spine {
    class SwirlEffect implements VertexEffect {
        static interpolation: PowOut;
        centerX: number;
        centerY: number;
        radius: number;
        angle: number;
        private worldX;
        private worldY;
        constructor(radius: number);
        begin(skeleton: Skeleton): void;
        transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
        end(): void;
    }
}
declare module spine.webgl {
    class AssetManager extends spine.AssetManager {
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, pathPrefix?: string);
    }
}
declare module spine.webgl {
    class OrthoCamera {
        position: Vector3;
        direction: Vector3;
        up: Vector3;
        near: number;
        far: number;
        zoom: number;
        viewportWidth: number;
        viewportHeight: number;
        projectionView: Matrix4;
        inverseProjectionView: Matrix4;
        projection: Matrix4;
        view: Matrix4;
        private tmp;
        constructor(viewportWidth: number, viewportHeight: number);
        update(): void;
        screenToWorld(screenCoords: Vector3, screenWidth: number, screenHeight: number): Vector3;
        setViewport(viewportWidth: number, viewportHeight: number): void;
    }
}
declare module spine.webgl {
    class GLTexture extends Texture implements Disposable, Restorable {
        private context;
        private texture;
        private boundUnit;
        private useMipMaps;
        static DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL: boolean;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, image: HTMLImageElement | ImageBitmap, useMipMaps?: boolean);
        setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        static validateMagFilter(magFilter: TextureFilter): TextureFilter.Nearest | TextureFilter.Linear | TextureFilter.Linear;
        setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        update(useMipMaps: boolean): void;
        restore(): void;
        bind(unit?: number): void;
        unbind(): void;
        dispose(): void;
    }
}
declare module spine.webgl {
    const M00 = 0;
    const M01 = 4;
    const M02 = 8;
    const M03 = 12;
    const M10 = 1;
    const M11 = 5;
    const M12 = 9;
    const M13 = 13;
    const M20 = 2;
    const M21 = 6;
    const M22 = 10;
    const M23 = 14;
    const M30 = 3;
    const M31 = 7;
    const M32 = 11;
    const M33 = 15;
    class Matrix4 {
        temp: Float32Array;
        values: Float32Array;
        private static xAxis;
        private static yAxis;
        private static zAxis;
        private static tmpMatrix;
        constructor();
        set(values: ArrayLike<number>): Matrix4;
        transpose(): Matrix4;
        identity(): Matrix4;
        invert(): Matrix4;
        determinant(): number;
        translate(x: number, y: number, z: number): Matrix4;
        copy(): Matrix4;
        projection(near: number, far: number, fovy: number, aspectRatio: number): Matrix4;
        ortho2d(x: number, y: number, width: number, height: number): Matrix4;
        ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
        multiply(matrix: Matrix4): Matrix4;
        multiplyLeft(matrix: Matrix4): Matrix4;
        lookAt(position: Vector3, direction: Vector3, up: Vector3): this;
        static initTemps(): void;
    }
}
declare module spine.webgl {
    class Mesh implements Disposable, Restorable {
        private attributes;
        private context;
        private vertices;
        private verticesBuffer;
        private verticesLength;
        private dirtyVertices;
        private indices;
        private indicesBuffer;
        private indicesLength;
        private dirtyIndices;
        private elementsPerVertex;
        getAttributes(): VertexAttribute[];
        maxVertices(): number;
        numVertices(): number;
        setVerticesLength(length: number): void;
        getVertices(): Float32Array;
        maxIndices(): number;
        numIndices(): number;
        setIndicesLength(length: number): void;
        getIndices(): Uint16Array;
        getVertexSizeInFloats(): number;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, attributes: VertexAttribute[], maxVertices: number, maxIndices: number);
        setVertices(vertices: Array<number>): void;
        setIndices(indices: Array<number>): void;
        draw(shader: Shader, primitiveType: number): void;
        drawWithOffset(shader: Shader, primitiveType: number, offset: number, count: number): void;
        bind(shader: Shader): void;
        unbind(shader: Shader): void;
        private update;
        restore(): void;
        dispose(): void;
    }
    class VertexAttribute {
        name: string;
        type: VertexAttributeType;
        numElements: number;
        constructor(name: string, type: VertexAttributeType, numElements: number);
    }
    class Position2Attribute extends VertexAttribute {
        constructor();
    }
    class Position3Attribute extends VertexAttribute {
        constructor();
    }
    class TexCoordAttribute extends VertexAttribute {
        constructor(unit?: number);
    }
    class ColorAttribute extends VertexAttribute {
        constructor();
    }
    class Color2Attribute extends VertexAttribute {
        constructor();
    }
    enum VertexAttributeType {
        Float = 0
    }
}
declare module spine.webgl {
    class PolygonBatcher implements Disposable {
        private context;
        private drawCalls;
        private isDrawing;
        private mesh;
        private shader;
        private lastTexture;
        private verticesLength;
        private indicesLength;
        private srcBlend;
        private dstBlend;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, twoColorTint?: boolean, maxVertices?: number);
        begin(shader: Shader): void;
        setBlendMode(srcBlend: number, dstBlend: number): void;
        draw(texture: GLTexture, vertices: ArrayLike<number>, indices: Array<number>): void;
        private flush;
        end(): void;
        getDrawCalls(): number;
        dispose(): void;
    }
}
declare module spine.webgl {
    class SceneRenderer implements Disposable {
        context: ManagedWebGLRenderingContext;
        canvas: HTMLCanvasElement;
        camera: OrthoCamera;
        batcher: PolygonBatcher;
        private twoColorTint;
        private batcherShader;
        private shapes;
        private shapesShader;
        private activeRenderer;
        skeletonRenderer: SkeletonRenderer;
        skeletonDebugRenderer: SkeletonDebugRenderer;
        private QUAD;
        private QUAD_TRIANGLES;
        private WHITE;
        constructor(canvas: HTMLCanvasElement, context: ManagedWebGLRenderingContext | WebGLRenderingContext, twoColorTint?: boolean);
        begin(): void;
        drawSkeleton(skeleton: Skeleton, premultipliedAlpha?: boolean, slotRangeStart?: number, slotRangeEnd?: number): void;
        drawSkeletonDebug(skeleton: Skeleton, premultipliedAlpha?: boolean, ignoredBones?: Array<string>): void;
        drawTexture(texture: GLTexture, x: number, y: number, width: number, height: number, color?: Color): void;
        drawTextureUV(texture: GLTexture, x: number, y: number, width: number, height: number, u: number, v: number, u2: number, v2: number, color?: Color): void;
        drawTextureRotated(texture: GLTexture, x: number, y: number, width: number, height: number, pivotX: number, pivotY: number, angle: number, color?: Color, premultipliedAlpha?: boolean): void;
        drawRegion(region: TextureAtlasRegion, x: number, y: number, width: number, height: number, color?: Color, premultipliedAlpha?: boolean): void;
        line(x: number, y: number, x2: number, y2: number, color?: Color, color2?: Color): void;
        triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
        quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
        rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
        rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
        polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
        circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
        curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
        end(): void;
        resize(resizeMode: ResizeMode): void;
        private enableRenderer;
        dispose(): void;
    }
    enum ResizeMode {
        Stretch = 0,
        Expand = 1,
        Fit = 2
    }
}
declare module spine.webgl {
    class Shader implements Disposable, Restorable {
        private vertexShader;
        private fragmentShader;
        static MVP_MATRIX: string;
        static POSITION: string;
        static COLOR: string;
        static COLOR2: string;
        static TEXCOORDS: string;
        static SAMPLER: string;
        private context;
        private vs;
        private vsSource;
        private fs;
        private fsSource;
        private program;
        private tmp2x2;
        private tmp3x3;
        private tmp4x4;
        getProgram(): WebGLProgram;
        getVertexShader(): string;
        getFragmentShader(): string;
        getVertexShaderSource(): string;
        getFragmentSource(): string;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, vertexShader: string, fragmentShader: string);
        private compile;
        private compileShader;
        private compileProgram;
        restore(): void;
        bind(): void;
        unbind(): void;
        setUniformi(uniform: string, value: number): void;
        setUniformf(uniform: string, value: number): void;
        setUniform2f(uniform: string, value: number, value2: number): void;
        setUniform3f(uniform: string, value: number, value2: number, value3: number): void;
        setUniform4f(uniform: string, value: number, value2: number, value3: number, value4: number): void;
        setUniform2x2f(uniform: string, value: ArrayLike<number>): void;
        setUniform3x3f(uniform: string, value: ArrayLike<number>): void;
        setUniform4x4f(uniform: string, value: ArrayLike<number>): void;
        getUniformLocation(uniform: string): WebGLUniformLocation;
        getAttributeLocation(attribute: string): number;
        dispose(): void;
        static newColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
        static newTwoColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
        static newColored(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
    }
}
declare module spine.webgl {
    class ShapeRenderer implements Disposable {
        private context;
        private isDrawing;
        private mesh;
        private shapeType;
        private color;
        private shader;
        private vertexIndex;
        private tmp;
        private srcBlend;
        private dstBlend;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, maxVertices?: number);
        begin(shader: Shader): void;
        setBlendMode(srcBlend: number, dstBlend: number): void;
        setColor(color: Color): void;
        setColorWith(r: number, g: number, b: number, a: number): void;
        point(x: number, y: number, color?: Color): void;
        line(x: number, y: number, x2: number, y2: number, color?: Color): void;
        triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
        quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
        rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
        rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
        x(x: number, y: number, size: number): void;
        polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
        circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
        curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
        private vertex;
        end(): void;
        private flush;
        private check;
        dispose(): void;
    }
    enum ShapeType {
        Point = 0,
        Line = 1,
        Filled = 4
    }
}
declare module spine.webgl {
    class SkeletonDebugRenderer implements Disposable {
        boneLineColor: Color;
        boneOriginColor: Color;
        attachmentLineColor: Color;
        triangleLineColor: Color;
        pathColor: Color;
        clipColor: Color;
        aabbColor: Color;
        drawBones: boolean;
        drawRegionAttachments: boolean;
        drawBoundingBoxes: boolean;
        drawMeshHull: boolean;
        drawMeshTriangles: boolean;
        drawPaths: boolean;
        drawSkeletonXY: boolean;
        drawClipping: boolean;
        premultipliedAlpha: boolean;
        scale: number;
        boneWidth: number;
        private context;
        private bounds;
        private temp;
        private vertices;
        private static LIGHT_GRAY;
        private static GREEN;
        constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext);
        draw(shapes: ShapeRenderer, skeleton: Skeleton, ignoredBones?: Array<string>): void;
        dispose(): void;
    }
}
declare module spine.webgl {
    class SkeletonRenderer {
        static QUAD_TRIANGLES: number[];
        premultipliedAlpha: boolean;
        vertexEffect: VertexEffect;
        private tempColor;
        private tempColor2;
        private vertices;
        private vertexSize;
        private twoColorTint;
        private renderable;
        private clipper;
        private temp;
        private temp2;
        private temp3;
        private temp4;
        constructor(context: ManagedWebGLRenderingContext, twoColorTint?: boolean);
        draw(batcher: PolygonBatcher, skeleton: Skeleton, slotRangeStart?: number, slotRangeEnd?: number): void;
    }
}
declare module spine.webgl {
    class Vector3 {
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        setFrom(v: Vector3): Vector3;
        set(x: number, y: number, z: number): Vector3;
        add(v: Vector3): Vector3;
        sub(v: Vector3): Vector3;
        scale(s: number): Vector3;
        normalize(): Vector3;
        cross(v: Vector3): Vector3;
        multiply(matrix: Matrix4): Vector3;
        project(matrix: Matrix4): Vector3;
        dot(v: Vector3): number;
        length(): number;
        distance(v: Vector3): number;
    }
}
declare module spine.webgl {
    class ManagedWebGLRenderingContext {
        canvas: HTMLCanvasElement | OffscreenCanvas;
        gl: WebGLRenderingContext;
        private restorables;
        constructor(canvasOrContext: HTMLCanvasElement | WebGLRenderingContext | EventTarget | WebGL2RenderingContext, contextConfig?: any);
        private setupCanvas;
        addRestorable(restorable: Restorable): void;
        removeRestorable(restorable: Restorable): void;
    }
    class WebGLBlendModeConverter {
        static ZERO: number;
        static ONE: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_COLOR: number;
        static SRC_ALPHA: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static DST_ALPHA: number;
        static ONE_MINUS_DST_ALPHA: number;
        static DST_COLOR: number;
        static getDestGLBlendMode(blendMode: BlendMode): number;
        static getSourceGLBlendMode(blendMode: BlendMode, premultipliedAlpha?: boolean): number;
    }
}
