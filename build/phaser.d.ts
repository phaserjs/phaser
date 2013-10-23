

declare module Phaser { 

  
  export interface Animation  { 
  
    
      game: any;
      name: any;
      delay: any;
      looped: any;
      killOnComplete: any;
      isFinished: any;
      isPlaying: any;
      isPaused: any;
      currentFrame: any;
      paused: any;
      frameTotal: any;
      frame: any;
  
      static play(frameRate: number, loop: boolean, killOnComplete: boolean): Phaser.Animation;
      static restart(): any;
      static stop(resetFrame: boolean): any;
      static update(): any;
      static destroy(): any;
      static onComplete(): any;
      static generateFrameNames(prefix: string, min: number, max: number, suffix: string, zeroPad: number): any;
  }

  export interface AnimationManager  { 
  
    
      sprite: any;
      game: any;
      currentFrame: any;
      updateIfVisible: any;
      isLoaded: any;
      frameData: any;
      frameTotal: any;
      paused: any;
      frame: any;
      frameName: any;
  
      add(name: string, frames: Array, frameRate: number, loop: boolean, useNumericIndex: boolean): Phaser.Animation;
      validateFrames(frames: Array, useNumericIndex: boolean): boolean;
      play(name: string, frameRate: number, loop: boolean, killOnComplete: boolean): Phaser.Animation;
      stop(name: string, resetFrame: boolean): any;
      update(): boolean;
      refreshFrame(): any;
      destroy(): any;
  }

  export interface AnimationParser  { 
  
  
      static spriteSheet(game: Phaser.Game, key: string, frameWidth: number, frameHeight: number, frameMax: number): Phaser.FrameData;
      static JSONData(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
      static JSONDataHash(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
      static XMLData(game: Phaser.Game, xml: Object, cacheKey: string): Phaser.FrameData;
  }

  export interface BitmapText  { 
  
    
      exists: any;
      alive: any;
      group: any;
      name: any;
      game: any;
      type: any;
      anchor: any;
      scale: any;
  
      update(): any;
      destroy(): any;
  }

  export interface Button  { 
  
    
      type: any;
      onInputOver: any;
      onInputOut: any;
      onInputDown: any;
      onInputUp: any;
  
      setFrames(overFrame: string|number, outFrame: string|number, downFrame: string|number): any;
      onInputOverHandler(pointer: Description): any;
      onInputOutHandler(pointer: Description): any;
      onInputDownHandler(pointer: Description): any;
      onInputUpHandler(pointer: Description): any;
  }

  export interface Cache  { 
  
    
      game: any;
      onSoundUnlock: any;
  
      addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): any;
      addRenderTexture(key: string, textue: Phaser.Texture): any;
      addSpriteSheet(key: string, url: string, data: object, frameWidth: number, frameHeight: number, frameMax: number): any;
      addTileset(key: string, url: string, data: object, tileWidth: number, tileHeight: number, tileMax: number, tileMargin: number, tileSpacing: number): any;
      addTilemap(key: string, url: string, mapData: object, format: number): any;
      addTextureAtlas(key: string, url: string, data: object, atlasData: object, format: number): any;
      addBitmapFont(key: string, url: string, data: object, xmlData): any;
      addDefaultImage(): any;
      addText(key: string, url: string, data: object): any;
      addImage(key: string, url: string, data: object): any;
      addSound(key: string, url: string, data: object, webAudio: boolean, audioTag: boolean): any;
      reloadSound(key: string): any;
      reloadSoundComplete(key: string): any;
      updateSound(key: string, property, value): any;
      decodedSound(key: string, data: object): any;
      getCanvas(key: string): object;
      checkImageKey(key: string): boolean;
      getImage(key: string): object;
      getTilesetImage(key: string): object;
      getTileset(key: string): Phaser.Tileset;
      getTilemapData(key: string): Object;
      getFrameData(key: string): Phaser.FrameData;
      getFrameByIndex(key: string, frame): Phaser.Frame;
      getFrameByName(key: string, frame): Phaser.Frame;
      getFrame(key: string): Phaser.Frame;
      getTextureFrame(key: string): Phaser.Frame;
      getTexture(key: string): Phaser.RenderTexture;
      getSound(key: string): Phaser.Sound;
      getSoundData(key: string): object;
      isSoundDecoded(key: string): boolean;
      isSoundReady(key: string): boolean;
      isSpriteSheet(key: string): boolean;
      getText(key: string): object;
      getKeys(array: Array): Array;
      getImageKeys(): Array;
      getSoundKeys(): Array;
      getTextKeys(): Array;
      removeCanvas(key: string): any;
      removeImage(key: string): any;
      removeSound(key: string): any;
      removeText(key: string): any;
      destroy(): any;
  }

  export interface Camera  { 
  
    
      game: any;
      world: any;
      id: any;
      view: any;
      screenView: any;
      bounds: any;
      deadzone: any;
      visible: any;
      atLimit: any;
      target: any;
      static FOLLOW_LOCKON: any;
      static FOLLOW_PLATFORMER: any;
      static FOLLOW_TOPDOWN: any;
      static FOLLOW_TOPDOWN_TIGHT: any;
      x: any;
      y: any;
      width: any;
      height: any;
  
      follow(target: Phaser.Sprite, style: number): any;
      focusOn(displayObject: any): any;
      focusOnXY(x: number, y: number): any;
      update(): any;
      checkBounds(): any;
      setPosition(x: number, y: number): any;
      setSize(width: number, height: number): any;
  }

  export interface Canvas  { 
  
  
      static create(width: number, height: number): HTMLCanvasElement;
      static getOffset(element: HTMLElement, point: Phaser.Point): Phaser.Point;
      static getAspectRatio(canvas: HTMLCanvasElement): number;
      static setBackgroundColor(canvas: HTMLCanvasElement, color: string): HTMLCanvasElement;
      static setTouchAction(canvas: HTMLCanvasElement, value: String): HTMLCanvasElement;
      static setUserSelect(canvas: HTMLCanvasElement, value: String): HTMLCanvasElement;
      static addToDOM(canvas: HTMLCanvasElement, parent: string, overflowHidden: boolean): HTMLCanvasElement;
      static setTransform(context: CanvasRenderingContext2D, translateX: number, translateY: number, scaleX: number, scaleY: number, skewX: number, skewY: number): CanvasRenderingContext2D;
      static setSmoothingEnabled(context: CanvasRenderingContext2D, value: boolean): CanvasRenderingContext2D;
      static setImageRenderingCrisp(canvas: HTMLCanvasElement): HTMLCanvasElement;
      static setImageRenderingBicubic(canvas: HTMLCanvasElement): HTMLCanvasElement;
  }

  export interface Circle  { 
  
    
      x: any;
      y: any;
      diameter: any;
      radius: any;
      left: any;
      right: any;
      top: any;
      bottom: any;
      area: any;
      empty: any;
  
      circumference(): number;
      setTo(x: number, y: number, diameter: number): Circle;
      copyFrom(source: any): Circle;
      copyTo(dest: any): Object;
      distance(dest: object, round: boolean): number;
      clone(out: Phaser.Circle): Phaser.Circle;
      contains(x: number, y: number): boolean;
      circumferencePoint(angle: number, asDegrees: boolean, out: Phaser.Point): Phaser.Point;
      offset(dx: number, dy: number): Circle;
      offsetPoint(point: Point): Circle;
      toString(): string;
      static contains(a: Phaser.Circle, x: number, y: number): boolean;
      static equals(a: Phaser.Circle, b: Phaser.Circle): boolean;
      static intersects(a: Phaser.Circle, b: Phaser.Circle): boolean;
      static circumferencePoint(a: Phaser.Circle, angle: number, asDegrees: boolean, out: Phaser.Point): Phaser.Point;
      static intersectsRectangle(c: Phaser.Circle, r: Phaser.Rectangle): boolean;
  }

  export interface Color  { 
  
  
      static getColor32(alpha: number, red: number, green: number, blue: number): number;
      static getColor(red: number, green: number, blue: number): number;
      static hexToRGB(h: string): object;
      static getColorInfo(color: number): string;
      static RGBtoHexstring(color: number): string;
      static RGBtoWebstring(color: number): string;
      static colorToHexstring(color: number): string;
      static interpolateColor(color1: number, color2: number, steps: number, currentStep: number, alpha: number): number;
      static interpolateColorWithRGB(color: number, r: number, g: number, b: number, steps: number, currentStep: number): number;
      static interpolateRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number;
      static getRandomColor(min: number, max: number, alpha: number): number;
      static getRGB(color: number): object;
      static getWebRGB(color: number): string;
      static getAlpha(color: number): number;
      static getAlphaFloat(color: number): number;
      static getRed(color: number): number;
      static getGreen(color: number): number;
      static getBlue(color: number): number;
  }

  export interface Device  { 
  
    
      patchAndroidClearRectBug: any;
      desktop: any;
      iOS: any;
      android: any;
      chromeOS: any;
      linux: any;
      macOS: any;
      windows: any;
      canvas: any;
      file: any;
      fileSystem: any;
      localStorage: any;
      webGL: any;
      worker: any;
      touch: any;
      mspointer: any;
      css3D: any;
      pointerLock: any;
      arora: any;
      chrome: any;
      epiphany: any;
      firefox: any;
      ie: any;
      ieVersion: any;
      mobileSafari: any;
      midori: any;
      opera: any;
      safari: any;
      audioData: any;
      webAudio: any;
      ogg: any;
      opus: any;
      mp3: any;
      wav: any;
      m4a: any;
      webm: any;
      iPhone: any;
      iPhone4: any;
      iPad: any;
      pixelRatio: any;
  
      canPlayAudio(type: string): boolean;
      isConsoleOpen(): boolean;
  }

  export interface Easing  { 
  
  }

  export interface Events  { 
  
  }

  export interface Frame  { 
  
    
      index: any;
      x: any;
      y: any;
      width: any;
      height: any;
      name: any;
      uuid: any;
      centerX: any;
      centerY: any;
      distance: any;
      rotated: any;
      rotationDirection: any;
      trimmed: any;
      sourceSizeW: any;
      sourceSizeH: any;
      spriteSourceSizeX: any;
      spriteSourceSizeY: any;
      spriteSourceSizeW: any;
      spriteSourceSizeH: any;
  
      setTrim(trimmed: boolean, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): any;
  }

  export interface FrameData  { 
  
    
      total: any;
  
      addFrame(frame: Phaser.Frame): Phaser.Frame;
      getFrame(index: number): Phaser.Frame;
      getFrameByName(name: string): Phaser.Frame;
      checkFrameName(name: string): boolean;
      getFrameRange(start: number, end: number, output: Array): Array;
      getFrames(frames: Array, useNumericIndex: boolean, output: Array): Array;
      getFrameIndexes(frames: Array, useNumericIndex: boolean, output: Array): Array;
  }

  export interface Game  { 
  
    
      id: any;
      parent: any;
      width: any;
      height: any;
      transparent: any;
      antialias: any;
      renderer: any;
      state: any;
      renderType: any;
      isBooted: any;
      isRunning: any;
      raf: any;
      add: any;
      cache: any;
      input: any;
      load: any;
      math: any;
      net: any;
      sound: any;
      stage: any;
      time: any;
      tweens: any;
      world: any;
      physics: any;
      rnd: any;
      device: any;
      camera: any;
      canvas: any;
      context: any;
      debug: any;
      particles: any;
      paused: any;
  
      boot(): any;
      setUpRenderer(): any;
      loadComplete(): any;
      update(time: number): any;
      destroy(): any;
  }

  export interface GameObjectFactory  { 
  
    
      game: any;
      world: any;
  
      existing(-: object): boolean;
      sprite(x: number, y: number, key: string|RenderTexture, frame: string|number): Description;
      child(group: Phaser.Group, x: number, y: number, key: string|RenderTexture, frame: string|number): Description;
      tween(obj: object): Description;
      group(parent: Description, name: Description): Description;
      audio(key: Description, volume: Description, loop: Description): Description;
      tileSprite(x: Description, y: Description, width: Description, height: Description, key: Description, frame: Description): Description;
      text(x: Description, y: Description, text: Description, style: Description): any;
      button(x: Description, y: Description, callback: Description, callbackContext: Description, overFrame: Description, outFrame: Description, downFrame: Description, downFrame): Description;
      graphics(x: Description, y: Description): Description;
      emitter(x: Description, y: Description, maxParticles: Description): Description;
      bitmapText(x: Description, y: Description, text: Description, style: Description): Description;
      tilemap(key: Description): Description;
      tileset(key: Description): Description;
      tilemapLayer(x: Description, y: Description, width: Description, height: Description, key: Description, frame: Description, layer): Description;
      renderTexture(key: Description, width: Description, height: Description): Description;
  }

  export interface Graphics  { 
  
    
      type: any;
  
      destroy(): any;
  }

  export interface Group  { 
  
    
      game: any;
      name: any;
      type: any;
      exists: any;
      scale: any;
      total: any;
      length: any;
      x: any;
      y: any;
      angle: any;
      rotation: any;
      visible: any;
      alpha: any;
  
      add(child: *): *;
      addAt(child: *, index: number): *;
      static getAt(index: number): *;
      create(x: number, y: number, key: string, frame: number|string, exists: boolean): Phaser.Sprite;
      createMultiple(quantity: number, key: string, frame: number|string, exists: boolean): any;
      swap(child1: *, child2: *): boolean;
      bringToTop(child: *): *;
      getIndex(child: *): number;
      replace(oldChild: *, newChild: *): any;
      setProperty(child: *, key: array, value: *, operation: number): any;
      setAll(key: string, value: *, checkAlive: boolean, checkVisible: boolean, operation: number): any;
      addAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): any;
      subAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): any;
      multiplyAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): any;
      divideAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): any;
      callAllExists(callback: function, existsValue: boolean, parameter: ...*): any;
      callAll(callback: function, parameter: ...*): any;
      forEach(callback: function, callbackContext: Object, checkExists: boolean): any;
      forEachAlive(callback: function, callbackContext: Object): any;
      forEachDead(callback: function, callbackContext: Object): any;
      getFirstExists(state: boolean): Any;
      getFirstAlive(): Any;
      getFirstDead(): Any;
      countLiving(): number;
      countDead(): number;
      getRandom(startIndex: number, length: number): Any;
      remove(child: Any): any;
      removeAll(): any;
      removeBetween(startIndex: number, endIndex: number): any;
      destroy(): any;
      dump(full: boolean): any;
  }

  export interface Input  { 
  
    
      game: any;
      hitCanvas: any;
      hitContext: any;
      static MOUSE_OVERRIDES_TOUCH: any;
      static TOUCH_OVERRIDES_MOUSE: any;
      static MOUSE_TOUCH_COMBINE: any;
      pollRate: any;
      disabled: any;
      multiInputOverride: any;
      position: any;
      speed: any;
      circle: any;
      scale: any;
      maxPointers: any;
      currentPointers: any;
      tapRate: any;
      doubleTapRate: any;
      holdRate: any;
      justPressedRate: any;
      justReleasedRate: any;
      recordPointerHistory: any;
      recordRate: any;
      recordLimit: any;
      pointer1: any;
      pointer2: any;
      pointer3: any;
      pointer4: any;
      pointer5: any;
      pointer6: any;
      pointer7: any;
      pointer8: any;
      pointer9: any;
      pointer10: any;
      activePointer: any;
      mousePointer: any;
      mouse: any;
      keyboard: any;
      touch: any;
      mspointer: any;
      onDown: any;
      onUp: any;
      onTap: any;
      onHold: any;
      interactiveItems: any;
      x: any;
      y: any;
      pollLocked: any;
      totalInactivePointers: any;
      totalActivePointers: any;
      worldX: any;
      worldY: any;
  
      boot(): any;
      addPointer(): Phaser.Pointer;
      update(): any;
      reset(hard: boolean): any;
      resetSpeed(x: number, y: number): any;
      startPointer(event: Any): Phaser.Pointer;
      updatePointer(event: Any): Phaser.Pointer;
      stopPointer(event: Any): Phaser.Pointer;
      getPointer(state: boolean): Phaser.Pointer;
      getPointerFromIdentifier(identifier: number): Phaser.Pointer;
      getDistance(pointer1: Pointer, pointer2: Pointer): Description;
      getAngle(pointer1: Pointer, pointer2: Pointer): Description;
  }

  export interface InputHandler  { 
  
    
      sprite: any;
      game: any;
      enabled: any;
      parent: any;
      next: any;
      prev: any;
      last: any;
      first: any;
      priorityID: any;
      useHandCursor: any;
      isDragged: any;
      allowHorizontalDrag: any;
      allowVerticalDrag: any;
      bringToTop: any;
      snapOffset: any;
      snapOnDrag: any;
      snapOnRelease: any;
      snapX: any;
      snapY: any;
      pixelPerfect: any;
      pixelPerfectAlpha: any;
      draggable: any;
      boundsRect: any;
      boundsSprite: any;
      consumePointerEvent: any;
  
      start(priority: number, useHandCursor: boolean): Phaser.Sprite;
      reset(): any;
      stop(): any;
      destroy(): any;
      pointerX(pointer: Pointer): number;
      pointerY(pointer: Pointer): number;
      pointerDown(pointer: Pointer): boolean;
      pointerUp(pointer: Pointer): boolean;
      pointerTimeDown(pointer: Pointer): number;
      pointerTimeUp(pointer: Pointer): number;
      pointerOver(pointer: Pointer): {bool;
      pointerOut(pointer: Pointer): boolean;
      pointerTimeOver(pointer: Pointer): number;
      pointerTimeOut(pointer: Pointer): number;
      pointerDragged(pointer: Pointer): number;
      checkPointerOver(pointer: Pointer): boolean;
      checkPixel(x: Description, y: Description): boolean;
      update(pointer: Pointer): any;
      updateDrag(pointer: Pointer): boolean;
      justOver(pointer: Pointer, delay: number): boolean;
      justOut(pointer: Pointer, delay: number): boolean;
      justPressed(pointer: Pointer, delay: number): boolean;
      justReleased(pointer: Pointer, delay: number): boolean;
      overDuration(pointer: Pointer): number;
      downDuration(pointer: Pointer): number;
      enableDrag(lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite): any;
      disableDrag(): any;
      startDrag(pointer): any;
      stopDrag(pointer): any;
      setDragLock(allowHorizontal, allowVertical): any;
      enableSnap(snapX, snapY, onDrag, onRelease): any;
      disableSnap(): any;
      checkBoundsRect(): any;
      checkBoundsSprite(): any;
  }

  export interface Key  { 
  
    
      game: any;
      isDown: any;
      isUp: any;
      altKey: any;
      ctrlKey: any;
      shiftKey: any;
      timeDown: any;
      duration: any;
      timeUp: any;
      repeats: any;
      keyCode: any;
      onDown: any;
      onUp: any;
  
      processKeyDown(event.: KeyboardEvent): any;
      processKeyUp(event.: KeyboardEvent): any;
      justPressed(duration: number): boolean;
      justReleased(duration: number): boolean;
  }

  export interface Keyboard  { 
  
    
      game: any;
      disabled: any;
      callbackContext: any;
      onDownCallback: any;
      onUpCallback: any;
  
      addCallbacks(context: Object, onDown: function, onUp: function): any;
      addKey(keycode: number): Phaser.Key;
      removeKey(keycode: number): any;
      createCursorKeys(): object;
      start(): any;
      stop(): any;
      addKeyCapture(keycode: Any): any;
      removeKeyCapture(keycode: number): any;
      clearCaptures(): any;
      processKeyDown(event: KeyboardEvent): any;
      processKeyUp(event: KeyboardEvent): any;
      reset(): any;
      justPressed(keycode: number, duration: number): boolean;
      justReleased(keycode: number, duration: number): boolean;
      isDown(keycode: number): boolean;
  }

  export interface LinkedList  { 
  
    
      next: any;
      prev: any;
      first: any;
      last: any;
      total: any;
  
      add(child: object): object;
      remove(child: object): any;
      callAll(callback: function): any;
  }

  export interface Loader  { 
  
    
      game: any;
      queueSize: any;
      isLoading: any;
      hasLoaded: any;
      progress: any;
      preloadSprite: any;
      crossOrigin: any;
      baseURL: any;
      onFileComplete: any;
      onFileError: any;
      onLoadStart: any;
      onLoadComplete: any;
      static TEXTURE_ATLAS_JSON_ARRAY: any;
      static TEXTURE_ATLAS_JSON_HASH: any;
      static TEXTURE_ATLAS_XML_STARLING: any;
  
      setPreloadSprite(sprite: Phaser.Sprite, direction: number): any;
      checkKeyExists(key: string): boolean;
      reset(): any;
      addToFileList(type: Description, key: string, url: string, properties: Description): any;
      image(key: string, url: string, overwrite: boolean): any;
      text(key: string, url: string, overwrite: boolean): any;
      spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax: number): any;
      tileset(key: string, url: string, tileWidth: number, tileHeight: number, tileMax: number, tileMargin: number, tileSpacing: number): any;
      audio(key: string, urls: Array, autoDecode: boolean): any;
      tilemap(key: string, tilesetURL: string, mapDataURL: string, mapData: object, format: string): any;
      bitmapFont(key: string, textureURL: string, xmlURL: string, xmlData: object): any;
      atlasJSONArray(key: string, atlasURL: Description, atlasData: Description, atlasData): any;
      atlasJSONHash(key: string, atlasURL: Description, atlasData: Description, atlasData): any;
      atlasXML(key: string, atlasURL: Description, atlasData: Description, atlasData): any;
      atlas(key: string, textureURL: string, atlasURL: string, atlasData: object, format: number): any;
      removeFile(key): any;
      removeAll(): any;
      start(): any;
      fileError(key: string): any;
      fileComplete(key: string): any;
      jsonLoadComplete(key: string): any;
      csvLoadComplete(key: string): any;
      dataLoadError(key: string): any;
      xmlLoadComplete(key: string): any;
  }

  export interface LoaderParser  { 
  
  
      static bitmapFont(xml: object, xml, cacheKey): FrameData;
  }

  export interface Math  { 
  
    
      static PI2: any;
      static degToRad: function;
      static radToDeg: function;
  
      static fuzzyEqual(a: number, b: number, epsilon: number): boolean;
      static fuzzyLessThan(a: number, b: number, epsilon: number): boolean;
      static fuzzyGreaterThan(a: number, b: number, epsilon: number): boolean;
      static fuzzyCeil(val: number, epsilon: number): boolean;
      static fuzzyFloor(val: number, epsilon: number): boolean;
      static average(): number;
      static truncate(n: number): number;
      static shear(n: number): number;
      static snapTo(input: number, gap: number, start: number): number;
      static snapToFloor(input: number, gap: number, start: number): number;
      static snapToCeil(input: number, gap: number, start: number): number;
      static snapToInArray(input: number, arr: array, sort: boolean): number;
      static roundTo(value: number, place: number, base: number): number;
      static floorTo(value: number, place: number, base: number): number;
      static ceilTo(value: number, place: number, base: number): number;
      static interpolateFloat(a: number, b: number, weight: number): number;
      static angleBetween(x1: number, y1: number, x2: number, y2: number): number;
      static normalizeAngle(angle: number, radians: boolean): number;
      static nearestAngleBetween(a1: number, a2: number, radians: boolean): number;
      static interpolateAngles(a1: number, a2: number, weight: number, radians: boolean, ease: Description): number;
      static chanceRoll(chance: number): boolean;
      static numberArray(min: number, max: number): array;
      static maxAdd(value: number, amount: number, max-: number): number;
      static minSub(value: number, amount: number, min: number): number;
      static wrap(value, min, max): number;
      static wrapValue(value: number, amount: number, max: number): number;
      static randomSign(): number;
      static isOdd(n: number): boolean;
      static isEven(n: number): boolean;
      static max(): number;
      static min(): number;
      static wrapAngle(angle: number): number;
      static angleLimit(angle: number, min: number, max: number): number;
      static linearInterpolation(v: number, k: number): number;
      static bezierInterpolation(v: number, k: number): number;
      static catmullRomInterpolation(v: number, k: number): number;
      static linear(p0: number, p1: number, t: number): number;
      static bernstein(n: number, i: number): number;
      static catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number;
      static difference(a: number, b: number): number;
      static getRandom(objects: array, startIndex: number, length: number): object;
      static floor(Value: number): number;
      static ceil(value: number): number;
      static sinCosGenerator(length: number, sinAmplitude: number, cosAmplitude: number, frequency: number): Array;
      static shift(stack: array): any;
      static shuffleArray(array: array): array;
      static distance(x1: number, y1: number, x2: number, y2: number): number;
      static distanceRounded(x1: number, y1: number, x2: number, y2: number): number;
      static clamp(x: number, a: number, b: number): number;
      static clampBottom(x: number, a: number): number;
      static within(a: number, b: number, tolerance: number): boolean;
      static mapLinear(x: number, a1: number, a1: number, a2: number, b1: number, b2: number): number;
      static smoothstep(x: number, min: number, max: number): number;
      static smootherstep(x: number, min: number, max: number): number;
      static sign(x: number): number;
  }

  export interface Mouse  { 
  
    
      game: any;
      callbackContext: any;
      mouseDownCallback: any;
      mouseMoveCallback: any;
      mouseUpCallback: any;
      disabled: any;
      locked: any;
      static LEFT_BUTTON: any;
      static MIDDLE_BUTTON: any;
      static RIGHT_BUTTON: any;
  
      start(): any;
      onMouseDown(event: MouseEvent): any;
      onMouseMove(event: MouseEvent): any;
      onMouseUp(event: MouseEvent): any;
      requestPointerLock(): any;
      pointerLockChange(event: MouseEvent): any;
      releasePointerLock(): any;
      stop(): any;
  }

  export interface MSPointer  { 
  
    
      game: any;
      callbackContext: any;
      mouseDownCallback: any;
      mouseMoveCallback: any;
      mouseUpCallback: any;
      disabled: any;
  
      start(): any;
      onPointerDown(event: Any): any;
      onPointerMove(event: Any): any;
      onPointerUp(event: Any): any;
      stop(): any;
  }

  export interface Net  { 
  
  
      getHostName(): string;
      checkDomainName(domain: string): boolean;
      updateQueryString(key: string, value: string, redirect: boolean, url: string): string;
      getQueryString(parameter: string): string|object;
      decodeURI(value: string): string;
  }

  export interface Particles  { 
  
    
      emitters: any;
      ID: any;
  
      add(emitter: Phaser.Emitter): Phaser.Emitter;
      remove(emitter: Phaser.Emitter): any;
      update(): any;
  }

  export interface Plugin  { 
  
    
      game: any;
      parent: any;
      active: any;
      visible: any;
      hasPreUpdate: any;
      hasUpdate: any;
      hasRender: any;
      hasPostRender: any;
  
      preUpdate(): any;
      update(): any;
      render(): any;
      postRender(): any;
      destroy(): any;
  }

  export interface PluginManager  { 
  
    
      game: any;
      plugins: any;
  
      add(plugin: Phaser.Plugin): Phaser.Plugin;
      remove(plugin: Phaser.Plugin): any;
      preUpdate(): any;
      update(): any;
      render(): any;
      postRender(): any;
      destroy(): any;
  }

  export interface Point  { 
  
    
      x: any;
      y: any;
  
      copyFrom(source: any): Point;
      invert(): Point;
      setTo(x: number, y: number): Point;
      add(x: number, y: number): Phaser.Point;
      subtract(x: number, y: number): Phaser.Point;
      multiply(x: number, y: number): Phaser.Point;
      divide(x: number, y: number): Phaser.Point;
      clampX(min: number, max: number): Phaser.Point;
      clampY(min: number, max: number): Phaser.Point;
      clamp(min: number, max: number): Phaser.Point;
      clone(output: Phaser.Point): Phaser.Point;
      copyTo(dest: any): Object;
      distance(dest: object, round: boolean): number;
      equals(a: Phaser.Point): boolean;
      rotate(x: number, y: number, angle: number, asDegrees: boolean, distance: number): Phaser.Point;
      toString(): string;
      static add(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point): Phaser.Point;
      static subtract(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point): Phaser.Point;
      static multiply(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point): Phaser.Point;
      static divide(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point): Phaser.Point;
      static equals(a: Phaser.Point, b: Phaser.Point): boolean;
      static distance(a: object, b: object, round: boolean): number;
      static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: boolean, distance: number): Phaser.Point;
  }

  export interface Pointer  { 
  
    
      game: any;
      id: any;
      positionDown: any;
      position: any;
      circle: any;
      withinGame: any;
      clientX: any;
      clientY: any;
      pageX: any;
      pageY: any;
      screenX: any;
      screenY: any;
      x: any;
      y: any;
      isMouse: any;
      isDown: any;
      isUp: any;
      timeDown: any;
      timeUp: any;
      previousTapTime: any;
      totalTouches: any;
      msSinceLastClick: any;
      targetObject: any;
      active: any;
      duration: any;
      worldX: any;
      worldY: any;
  
      start(event: Any): any;
      update(): any;
      move(event: Any): any;
      leave(event: Any): any;
      stop(event: Any): any;
      justPressed(duration: number): boolean;
      justReleased(duration: number): boolean;
      reset(): any;
      toString(): string;
  }

  export interface QuadTree  { 
  
  }

  export interface RandomDataGenerator  { 
  
  
      sow(seeds: array): any;
      integer(): number;
      frac(): number;
      real(): number;
      integerInRange(min: number, max: number): number;
      realInRange(min: number, max: number): number;
      normal(): number;
      uuid(): string;
      pick(ary: Any): number;
      weightedPick(ary: Any): number;
      timestamp(min: number, max: number): number;
      angle(): number;
  }

  export interface Rectangle  { 
  
    
      x: any;
      y: any;
      width: any;
      height: any;
      halfWidth: any;
      halfHeight: any;
      bottom: any;
      left: any;
      right: any;
      volume: any;
      perimeter: any;
      centerX: any;
      centerY: any;
      top: any;
      topLeft: any;
      empty: any;
  
      offset(dx: number, dy: number): Rectangle;
      offsetPoint(point: Point): Rectangle;
      setTo(x: number, y: number, width: number, height: number): Rectangle;
      floor(): any;
      copyFrom(source: any): Rectangle;
      copyTo(source: any): object;
      inflate(dx: number, dy: number): Phaser.Rectangle;
      size(output: Phaser.Point): Phaser.Point;
      clone(output: Phaser.Rectangle): Phaser.Rectangle;
      contains(x: number, y: number): boolean;
      containsRect(b: Phaser.Rectangle): boolean;
      equals(b: Phaser.Rectangle): boolean;
      intersection(b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
      intersects(b: Phaser.Rectangle, tolerance: number): boolean;
      intersectsRaw(left: number, right: number, top: number, bottomt: number, tolerance: number): boolean;
      union(b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
      toString(): string;
      static inflate(a: Phaser.Rectangle, dx: number, dy: number): Phaser.Rectangle;
      static inflatePoint(a: Phaser.Rectangle, point: Phaser.Point): Phaser.Rectangle;
      static size(a: Phaser.Rectangle, output: Phaser.Point): Phaser.Point;
      static clone(a: Phaser.Rectangle, output: Phaser.Rectangle): Phaser.Rectangle;
      static contains(a: Phaser.Rectangle, x: number, y: number): boolean;
      static containsPoint(a: Phaser.Rectangle, point: Phaser.Point): boolean;
      static containsRect(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
      static equals(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
      static intersection(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
      static intersects(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
      static intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number, tolerance): boolean;
      static union(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
  }

  export interface RenderTexture  { 
  
    
      game: any;
      name: any;
      width: any;
      height: any;
      indetityMatrix: any;
      frame: any;
      type: any;
  }

  export interface RequestAnimationFrame  { 
  
    
      game: any;
      isRunning: any;
  
      start(): any;
      updateRAF(time: number): any;
      updateSetTimeout(): any;
      stop(): any;
      isSetTimeOut(): boolean;
      isRAF(): boolean;
  }

  export interface Signal  { 
  
    
      memorize: any;
      active: any;
  
      dispatch(): any;
      has(listener: Function, context: Object): boolean;
      add(listener: function, listenerContext: object, priority: number): Phaser.SignalBinding;
      addOnce(listener: function, listenerContext: object, priority: number): Phaser.SignalBinding;
      remove(listener: function, context: object): function;
      removeAll(): any;
      getNumListeners(): number;
      halt(): any;
      forget(): any;
      dispose(): any;
      toString(): string;
  }

  export interface Sound  { 
  
    
      game: any;
      name: any;
      key: any;
      loop: any;
      markers: any;
      context: any;
      totalDuration: any;
      startTime: any;
      currentTime: any;
      duration: any;
      stopTime: any;
      paused: any;
      isPlaying: any;
      currentMarker: any;
      pendingPlayback: any;
      override: any;
      usingWebAudio: any;
      usingAudioTag: any;
      onDecoded: any;
      onPlay: any;
      onPause: any;
      onResume: any;
      onLoop: any;
      onStop: any;
      onMute: any;
      onMarkerComplete: any;
      isDecoding: any;
      isDecoded: any;
      mute: any;
      volume: any;
  
      soundHasUnlocked(key: string): any;
      addMarker(name: string, start: number, duration: number, volume: number, loop: boolean): any;
      removeMarker(name: string): any;
      update(): any;
      play(marker: string, position: number, volume: number, loop: boolean, forceRestart: boolean): Sound;
      restart(marker: string, position: number, volume: number, loop: boolean): any;
      pause(): any;
      resume(): any;
      stop(): any;
  }

  export interface SoundManager  { 
  
    
      game: any;
      onSoundDecode: any;
      context: any;
      usingWebAudio: any;
      usingAudioTag: any;
      noAudio: any;
      touchLocked: any;
      channels: any;
      mute: any;
      volume: any;
  
      boot(): any;
      unlock(): any;
      stopAll(): any;
      pauseAll(): any;
      resumeAll(): any;
      decode(key: string, sound: Phaser.Sound): any;
      update(): any;
      add(key: string, volume: number, loop: boolean): any;
  }

  export interface Sprite  { 
  
    
      game: any;
      exists: any;
      alive: any;
      group: any;
      name: any;
      type: any;
      renderOrderID: any;
      lifespan: any;
      events: any;
      animations: any;
      input: any;
      key: any;
      anchor: any;
      x: any;
      y: any;
      autoCull: any;
      scale: any;
      offset: any;
      center: any;
      topLeft: any;
      topRight: any;
      bottomRight: any;
      bottomLeft: any;
      bounds: any;
      body: any;
      health: any;
      inWorld: any;
      inWorldThreshold: any;
      outOfBoundsKill: any;
      fixedToCamera: any;
      angle: any;
  
      preUpdate(): any;
      centerOn(x: number, y: number): any;
      revive(health): any;
      kill(): any;
      destroy(): any;
      damage(amount): any;
      reset(x, y, health): any;
      updateBounds(): any;
      getLocalPosition(p: Description, x: number, y: number): Description;
      getLocalUnmodifiedPosition(p: Description, x: number, y: number): Description;
      bringToTop(): any;
      play(name: String, frameRate: number, loop: boolean, killOnComplete: boolean): Phaser.Animation;
  }

  export interface Stage  { 
  
    
      game: any;
      offset: any;
      canvas: any;
      scaleMode: any;
      scale: any;
      aspectRatio: any;
      backgroundColor: any;
  
      visibilityChange(event: Event): any;
  }

  export interface StageScaleMode  { 
  
    
      forceLandscape: any;
      forcePortrait: any;
      incorrectOrientation: any;
      pageAlignHorizontally: any;
      pageAlignVertically: any;
      minWidth: any;
      maxWidth: any;
      minHeight: any;
      maxHeight: any;
      width: any;
      height: any;
      maxIterations: any;
      game: any;
      enterLandscape: any;
      enterPortrait: any;
      scaleFactor: any;
      aspectRatio: any;
      static EXACT_FIT: any;
      static NO_SCALE: any;
      static SHOW_ALL: any;
      isFullScreen: any;
      isPortrait: any;
      isLandscape: any;
  
      startFullScreen(): any;
      stopFullScreen(): any;
      checkOrientationState(): any;
      checkOrientation(event: Event): any;
      checkResize(event: Event): any;
      refresh(): any;
      setScreenSize(force: Description): any;
      setSize(): any;
      setMaximum(): any;
      setShowAll(): any;
      setExactFit(): any;
  }

  export interface State  { 
  
    
      game: any;
      add: any;
      camera: any;
      cache: any;
      input: any;
      load: any;
      math: any;
      sound: any;
      stage: any;
      time: any;
      tweens: any;
      world: any;
      particles: any;
      physics: any;
  
      preload(): any;
      loadUpdate(): any;
      loadRender(): any;
      create(): any;
      update(): any;
      render(): any;
      paused(): any;
      destroy(): any;
  }

  export interface StateManager  { 
  
    
      game: any;
      states: any;
      current: any;
      onInitCallback: any;
      onPreloadCallback: any;
      onCreateCallback: any;
      onUpdateCallback: any;
      onRenderCallback: any;
      onPreRenderCallback: any;
      onLoadUpdateCallback: any;
      onLoadRenderCallback: any;
      onPausedCallback: any;
      onShutDownCallback: any;
  
      add(key, state, autoStart): any;
      remove(key: string): any;
      start(key: string, clearWorld: boolean, clearCache: boolean): any;
      checkState(key: string): boolean;
      link(key: string): any;
      setCurrentState(key: string): any;
      loadComplete(): any;
      update(): any;
      preRender(): any;
      render(): any;
      destroy(): any;
  }

  export interface Text  { 
  
    
      exists: any;
      alive: any;
      group: any;
      name: any;
      game: any;
      type: any;
      anchor: any;
      scale: any;
      renderable: any;
  
      update(): any;
      destroy(): any;
  }

  export interface Tile  { 
  
    
      tileset: any;
      index: any;
      width: any;
      height: any;
      x: any;
      y: any;
      mass: any;
      collideNone: any;
      collideLeft: any;
      collideRight: any;
      collideUp: any;
      collideDown: any;
      separateX: any;
      separateY: any;
      collisionCallback: any;
      collisionCallbackContext: any;
  
      setCollisionCallback(callback: Function, context: object): any;
      destroy(): any;
      setCollision(left: boolean, right: boolean, up: boolean, down: boolean, reset: boolean, separateX: boolean, separateY: boolean): any;
      resetCollision(): any;
  }

  export interface TileSprite  { 
  
    
      texture: any;
      type: any;
      tileScale: any;
      tilePosition: any;
  }

  export interface Time  { 
  
    
      game: any;
      physicsElapsed: any;
      time: any;
      pausedTime: any;
      now: any;
      elapsed: any;
      fps: any;
      fpsMin: any;
      fpsMax: any;
      msMin: any;
      msMax: any;
      frames: any;
      pauseDuration: any;
      timeToCall: any;
      lastTime: any;
  
      totalElapsedSeconds(): number;
      update(time: number): any;
      elapsedSince(since: number): number;
      elapsedSecondsSince(since: number): number;
      reset(): any;
  }

  export interface Touch  { 
  
    
      game: any;
      disabled: boolean;
      callbackContext: any;
      touchStartCallback: any;
      touchMoveCallback: any;
      touchEndCallback: any;
      touchEnterCallback: any;
      touchLeaveCallback: any;
      touchCancelCallback: any;
      preventDefault: any;
  
      start(): any;
      consumeDocumentTouches(): any;
      onTouchStart(event: Any): any;
      onTouchCancel(event: Any): any;
      onTouchEnter(event: Any): any;
      onTouchLeave(event: Any): any;
      onTouchMove(event: Any): any;
      onTouchEnd(event: Any): any;
      stop(): any;
  }

  export interface Tween  { 
  
    
      game: any;
      pendingDelete: any;
      onStart: any;
      onComplete: any;
      isRunning: any;
  
      to(properties: object, duration: number, ease: function, autoStart: boolean, delay: number, repeat: boolean, yoyo: Phaser.Tween): Phaser.Tween;
      start(time: number): Phaser.Tween;
      stop(): Phaser.Tween;
      delay(amount: number): Phaser.Tween;
      repeat(times: number): Phaser.Tween;
      yoyo(yoyo: boolean): Phaser.Tween;
      easing(easing: function): Phaser.Tween;
      interpolation(interpolation: function): Phaser.Tween;
      chain(): Phaser.Tween;
      loop(): Phaser.Tween;
      onStartCallback(callback: function): Phaser.Tween;
      onUpdateCallback(callback: function): Phaser.Tween;
      onCompleteCallback(callback: function): Phaser.Tween;
      pause(): any;
      resume(): any;
      update(time: number): boolean;
  }

  export interface TweenManager  { 
  
    
      game: any;
      REVISION: any;
  
      getAll(): Phaser.Tween[];
      removeAll(): any;
      add(tween: Phaser.Tween): Phaser.Tween;
      create(object: Object): Phaser.Tween;
      remove(tween: Phaser.Tween): any;
      update(): boolean;
      pauseAll(): any;
      resumeAll(): any;
  }

  export interface Utils  { 
  
  
      static pad(str: string, len: number, pad: number, dir: number): string;
      static isPlainObject(obj: object): boolean;
      static extend(deep: boolean, target: object): object;
  }

  export interface World  { 
  
    
      scale: any;
      bounds: any;
      camera: any;
      currentRenderOrderID: any;
      width: any;
      height: any;
      centerX: any;
      centerY: any;
      randomX: any;
      randomY: any;
  
      boot(): any;
      update(): any;
      postUpdate(): any;
      setBounds(x: number, y: number, width: number, height: number): any;
      destroy(): any;
  }

  
    }
  


declare module Phaser.Easing { 

  
  export interface Back  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Bounce  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Circular  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Cubic  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Elastic  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Exponential  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Linear  { 
  
  
      static None(k: number): number;
  }

  export interface Quadratic  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Quartic  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Quintic  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  export interface Sinusoidal  { 
  
  
      static In(k: number): number;
      static Out(k: number): number;
      static InOut(k: number): number;
  }

  
    }
  


declare module Phaser.Particles.Arcade { 

  
  export interface Emitter extends Phaser.Group  { 
  
    
      maxParticles: any;
      name: any;
      type: any;
      x: any;
      y: any;
      width: any;
      height: any;
      minParticleSpeed: any;
      maxParticleSpeed: any;
      minParticleScale: any;
      maxParticleScale: any;
      minRotation: any;
      maxRotation: any;
      gravity: any;
      particleClass: any;
      particleDrag: any;
      angularDrag: any;
      frequency: any;
      lifespan: any;
      bounce: any;
      on: any;
      exists: any;
      emitX: any;
      emitY: any;
      alpha: any;
      visible: any;
      left: any;
      right: any;
      top: any;
      bottom: any;
  
      update(): any;
      makeParticles(keys: Description, frames: number, quantity: number, collide: number, collideWorldBounds: boolean): This Emitter instance (nice for chaining stuff together, if you're into that).;
      kill(): any;
      revive(): any;
      start(explode: boolean, lifespan: number, frequency: number, quantity: number): any;
      emitParticle(): any;
      setSize(width: number, height: number): any;
      setXSpeed(min: number, max: number): any;
      setYSpeed(min: number, max: number): any;
      setRotation(min: number, max: number): any;
      at(object: object): any;
  }

  
    }
  


declare module Phaser.Utils { 

  
  export interface Debug  { 
  
    
      game: any;
      context: any;
      font: any;
      lineHeight: any;
      renderShadow: any;
      currentX: any;
      currentY: any;
      currentAlpha: any;
  
      start(x: number, y: number, color: string): any;
      stop(): any;
      line(text: string, x: number, y: number): any;
      renderQuadTree(quadtree: Phaser.QuadTree, color: string): any;
      renderSpriteCorners(sprite: Phaser.Sprite, showText: boolean, showBounds: boolean, color: string): any;
      renderSoundInfo(sound: Phaser.Sound, x: number, y: number, color: string): any;
      renderCameraInfo(camera: Phaser.Camera, x: number, y: number, color: string): any;
      renderPointer(pointer: Phaser.Pointer, hideIfUp: boolean, downColor: string, upColor: string, color: string): any;
      renderSpriteInputInfo(sprite: Phaser.Sprite, x: number, y: number, color: string): any;
      renderSpriteCollision(sprite: Phaser.Sprite, x: number, y: number, color: string): any;
      renderInputInfo(x: number, y: number, color: string): any;
      renderSpriteInfo(sprite: Phaser.Sprite, x: number, y: number, color: string): any;
      renderWorldTransformInfo(sprite: Phaser.Sprite, x: number, y: number, color: string): any;
      renderLocalTransformInfo(sprite: Phaser.Sprite, x: number, y: number, color: string): any;
      renderPointInfo(sprite: Phaser.Point, x: number, y: number, color: string): any;
      renderSpriteBody(sprite: Phaser.Sprite, color: string): any;
      renderSpriteBounds(sprite: Phaser.Sprite, color: string, fill: boolean): any;
      renderPixel(x: number, y: number, color: string): any;
      renderPoint(point: Phaser.Point, color: string): any;
      renderRectangle(rect: Phaser.Rectangle, color: string): any;
      renderCircle(circle: Phaser.Circle, color: string): any;
      renderText(text: string, x: number, y: number, color: string, font: string): any;
      dumpLinkedList(list: Phaser.LinkedList): any;
  }

  
    }
  


declare module PIXI { 

  
  export interface BaseTexture  { 
  
    
      width: Number;
      height: Number;
      hasLoaded: Boolean;
      source: Image;
  
      destroy(): any;
      static fromImage(imageUrl, crossorigin): BaseTexture;
  }

  export interface BitmapText  { 
  
  
      setText(text): any;
      setStyle(style, style.font, style.align): any;
  }

  export interface CanvasGraphics  { 
  
  }

  export interface CanvasRenderer  { 
  
    
      width: Number;
      height: Number;
      view: Canvas;
      context: Canvas 2d Context;
  
      render(stage): any;
      resize(width, height): any;
      renderDisplayObject(displayObject): any;
  }

  export interface CustomRenderable  { 
  
  
      renderCanvas(renderer): any;
      initWebGL(renderer): any;
      renderWebGL(renderer, projectionMatrix): any;
  }

  export interface DisplayObject  { 
  
    
      position: Point;
      scale: Point;
      pivot: Point;
      rotation: Number;
      alpha: Number;
      visible: Boolean;
      hitArea: Rectangle|Circle|Ellipse|Polygon;
      buttonMode: Boolean;
      renderable: Boolean;
      parent: DisplayObjectContainer;
      stage: Stage;
      worldAlpha: Number;
      constructor: any;
  
      setInteractive(interactive): any;
  }

  export interface DisplayObjectContainer  { 
  
    
      children: Array<DisplayObject>;
  
      addChild(child): any;
      addChildAt(child, index): any;
      getChildAt(index): any;
      removeChild(child): any;
  }

  export interface EventTarget  { 
  
  }

  export interface Graphics  { 
  
    
      fillAlpha: Number;
      lineWidth: Number;
      lineColor: String;
  
      lineStyle(lineWidth, color, alpha): any;
      moveTo(x, y): any;
      lineTo(x, y): any;
      beginFill(color, alpha): any;
      endFill(): any;
      drawRect(x, y, width, height): any;
      drawCircle(x, y, radius): any;
      drawElipse(x, y, width, height): any;
      clear(): any;
  }

  export interface Point  { 
  
    
      x: Number;
      y: Number;
  
      clone(): Point;
  }

  export interface Rectangle  { 
  
    
      x: Number;
      y: Number;
      width: Number;
      height: Number;
  
      clone(): Rectangle;
      contains(x, y): Boolean;
  }

  export interface RenderTexture  { 
  
  }

  export interface Sprite  { 
  
    
      anchor: Point;
      texture: Texture;
      blendMode: Number;
  
      setTexture(texture): any;
      static fromFrame(frameId): Sprite;
      static fromImage(imageId): Sprite;
      setText(text: String): any;
  }

  export interface Stage  { 
  
    
      interactive: Boolean;
      interactionManager: InteractionManager;
  
      setBackgroundColor(backgroundColor): any;
      getMousePosition(): Point;
  }

  export interface Text  { 
  
  
      setStyle(style, style.font, style.fill, style.align, style.stroke, style.strokeThickness, style.wordWrap, style.wordWrapWidth): any;
      destroy(destroyTexture): any;
  }

  export interface Texture  { 
  
    
      baseTexture: BaseTexture;
      frame: Rectangle;
      trim: Point;
  
      destroy(destroyBase): any;
      setFrame(frame): any;
      static fromImage(imageUrl, crossorigin): Texture;
      static fromFrame(frameId): Texture;
      static fromCanvas(canvas): Texture;
      static addTextureToCache(texture, id): any;
      static removeTextureFromCache(id): Texture;
  }

  export interface TilingSprite  { 
  
    
      texture: Texture;
      width: Number;
      height: Number;
      tileScale: Point;
      tilePosition: Point;
  
      setTexture(texture): any;
  }

  export interface WebGLBatch  { 
  
  
      clean(): any;
      restoreLostContext(gl): any;
      init(sprite): any;
      insertBefore(sprite, nextSprite): any;
      insertAfter(sprite, previousSprite): any;
      remove(sprite): any;
      split(sprite): WebGLBatch;
      merge(batch): any;
      growBatch(): any;
      refresh(): any;
      update(): any;
      render(start, end): any;
  }

  export interface WebGLGraphics  { 
  
  }

  export interface WebGLRenderer  { 
  
  
      render(stage): any;
      resize(width, height): any;
  }

  export interface WebGLRenderGroup  { 
  
  
      render(projection): any;
  }

  
    }
  


declare module PIXI.PolyK { 

  
  export interface Triangulate  { 
  
  }

  
    }
  
