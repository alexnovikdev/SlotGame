let app = new PIXI.Application({
    width: 256, 
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x000000;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", (event) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateSettings();
    onSizeChange();
});


let adaptiveSize = 0;

(function getAdaptiveSize() {

    if (window.innerWidth > window.innerHeight) {
        adaptiveSize =  window.innerHeight / 5.5;
    } else {
        adaptiveSize = window.innerWidth / 5;
    }

}());

let settings = {
    defaultWidth: 640,
    defaultHeight: 1136
};

let config = {
    slotImageNumber: 13,
    reelWidth: adaptiveSize,
    symbolSize: adaptiveSize - 20,
    colNumber: 5,
    rowNumber: 5,
};

let background = null;
let frame = null;
let btn = null;

let buttonFrames = [];
let buttonAnimation = null;

let slotTextures = [];

let reelContainer = null;

let running = false;

let reels = [];

let topCover = null;
let bottomCover = null;

PIXI.loader.add([
    "/img/01.png",
    "/img/02.png",
    "/img/03.png",
    "/img/04.png",
    "/img/05.png",
    "/img/06.png",
    "/img/07.png",
    "/img/08.png",
    "/img/09.png",
    "/img/10.png",
    "/img/11.png",
    "/img/12.png",
    "/img/13.png",
    "/img/btn_spin_disable.png",
    "/img/btn_spin_hover.png",
    "/img/btn_spin_normal.png",
    "/img/btn_spin_pressed.png",
    "/img/slotOverlay.png",
    "/img/winningFrameBackground.jpg",
]).on("progress", loadProgressHandler).load(setup);

function loadProgressHandler(loader, resource) {
    //console.log(resource.url);
    //console.log(loader.progress);
}

function setup() {

    for (let i = 1; i <= config.slotImageNumber; i++) {

        let target = "";

        if (i < 10) {
            target = "/img/0" + i + ".png";
        } else {
            target = "/img/" + i + ".png";
        }

        slotTextures.push(PIXI.loader.resources[target].texture);
    }


    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_hover.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_normal.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_pressed.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_disable.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_disable.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_pressed.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_normal.png"].texture);
    buttonFrames.push(PIXI.loader.resources["/img/btn_spin_hover.png"].texture);

    buttonAnimation = new PIXI.extras.AnimatedSprite(buttonFrames);
    buttonAnimation.animationSpeed = 0.4;
    buttonAnimation.loop = false;


    background = new PIXI.Sprite(
        PIXI.loader.resources["/img/winningFrameBackground.jpg"].texture
    );

    frame = new PIXI.Sprite(
        PIXI.loader.resources["/img/slotOverlay.png"].texture
    );

    btn = new PIXI.Sprite(
        PIXI.loader.resources["/img/btn_spin_hover.png"].texture
    );

    btn.interactive = true;
    btn.on("pointerdown", onDown);


    updateSettings();
    createReels();
    createCovers();

    
    app.stage.addChild(background);
    app.stage.addChild(reelContainer);
    app.stage.addChild(frame);
    app.stage.addChild(topCover);
    app.stage.addChild(bottomCover);
    bottomCover.addChild(buttonAnimation);
    bottomCover.addChild(btn);

    updateSettings();

    onSizeChange();

    app.ticker.add(delta => gameLoop(delta));
}

function onDown() {
    btn.interactive = false;

    buttonAnimation.gotoAndPlay(0);

    buttonAnimation.onComplete = () => {
        btn.interactive = true;
    };

    spin();
}

function spin() {

    if (running) {
        return;
    }

    running = true;

    for (let i = 0; i < reels.length; i++) {

        let reel = reels[i];

        let extra = Math.floor(Math.random() * 3);
        let target = reel.position + 10 + i * 5 + extra;
        let time = 2500 + i * 600 + extra * 600;
        
        tweenTo(reel, "position", target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);

    }

}

function reelsComplete() {
    running = false;
}

function createReels() {
    reelContainer = new PIXI.Container();

    for (let i = 0; i < config.colNumber; i ++) {

        let reelCol = new PIXI.Container();

        reelCol.x = i * config.reelWidth;

        reelContainer.addChild(reelCol);

        let reel = {
            container: reelCol,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter()
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        reelCol.filters = [reel.blur];


        for (let j = 0; j < config.rowNumber; j++) {

            let symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);

            symbol.y = j * config.symbolSize;
            symbol.scale.x = symbol.scale.y = Math.min(config.symbolSize / symbol.width, config.symbolSize / symbol.height);
            symbol.x = Math.round((config.symbolSize - symbol.width) / 2);

            reel.symbols.push(symbol);

            reelCol.addChild(symbol);
        }

        reels.push(reel);

    }
}

function createCovers() {
    if (reelContainer !== undefined && reelContainer !== null) {

        if (topCover !== null) {
            topCover.destroy();
        }

        if (bottomCover !== null) {
            bottomCover.destroy();
        }

        topCover = new PIXI.Graphics();
        bottomCover = new PIXI.Graphics();

        topCover.beginFill(0x000000, 1);
        bottomCover.beginFill(0x000000, 1);

        topCover.drawRect(0, 0, settings.gameWidth, reelContainer.y * 0.95);
        bottomCover.drawRect(0, (reelContainer.y + reelContainer.height - config.symbolSize) * 1.007, settings.gameWidth, settings.gameHeight - reelContainer.y - reelContainer.height + config.symbolSize);

        app.stage.addChild(topCover);
        app.stage.addChild(bottomCover);
        bottomCover.addChild(buttonAnimation);
        bottomCover.addChild(btn);
    }   
}

function updateSettings() {
    settings.gameWidth = app.renderer.view.width;
    settings.gameHeight = app.renderer.view.height;
    settings.isLandscape = settings.gameWidth > settings.gameHeight;

    let scaleX = 0;
    let scaleY = 0;

    if (settings.isLandscape) {
        scaleX = settings.gameWidth / settings.defaultHeight;
        scaleY = settings.gameHeight / settings.defaultWidth;
    } else {
        scaleX = settings.gameWidth / settings.defaultWidth;
        scaleY = settings.gameHeight / settings.defaultHeight;
    }

    settings.scale = Math.min(scaleX, scaleY);
}

function onSizeChange() {
    if (reelContainer !== undefined && reelContainer !== null) {
        reelContainer.x = (settings.gameWidth - reelContainer.width) / 2;
        reelContainer.y = reelContainer.height / 7;

        createCovers();

        if (btn !== undefined && btn !== null) {
            btn.alpha = 0;

            btn.scale.set(settings.scale * .8);

            btn.x = reelContainer.x + reelContainer.width - btn.width;
            btn.y = reelContainer.y + reelContainer.height - config.symbolSize + btn.height * .1;

            if (buttonAnimation !== undefined && buttonAnimation !== null) {
                buttonAnimation.x = btn.x;
                buttonAnimation.y = btn.y;

                buttonAnimation.scale.set(settings.scale * .8);
            }
        }

        if (frame !== undefined && frame !== null) {
            frame.x = reelContainer.x - reelContainer.width * 0.03;
            frame.y = reelContainer.y - reelContainer.height * 0.05;

            frame.width = reelContainer.width * 1.075;
            frame.height = reelContainer.height * 1.075 - config.symbolSize;
        }

        if (background !== undefined && background !== null) {
            background.x = reelContainer.x;
            background.y = reelContainer.y;

            background.width = reelContainer.width;
            background.height = reelContainer.height - config.symbolSize;
        }
    }

}

function gameLoop(delta) { 
    for (let i = 0; i < reels.length; i++) {

        let currentReel = reels[i];

        currentReel.blur.blurY = (currentReel.position - currentReel.previousPosition) * 8;
        currentReel.previousPosition = currentReel.position;

        for (let j = 0; j < currentReel.symbols.length; j++) {

            let currentSymbol = currentReel.symbols[j];

            let prevY = currentSymbol.y;

            currentSymbol.y = ((currentReel.position + j) % currentReel.symbols.length) * config.symbolSize - config.symbolSize;

            if (currentSymbol.y < 0 && prevY > config.symbolSize) {
                currentSymbol.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
            
                currentSymbol.scale.x = currentSymbol.scale.y = Math.min(config.symbolSize / currentSymbol.texture.width, config.symbolSize / currentSymbol.texture.height);

                currentSymbol.x = Math.round((config.symbolSize - currentSymbol.width) / 2);
            }
        }

    }
} 


//tweens util

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return t => (--t * t * ((amount + 1) * t + amount) + 1);
}