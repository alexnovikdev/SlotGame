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

let settings = {
    defaultWidth: 640,
    defaultHeight: 1136
};

let config = {
    slotImageNumber: 13,
    reelWidth: 160,
    symbolSize: 150,
    colNumber: 5,
    rowNumber: 4,
};

let background = null;
let frame = null;
let btn = null;

let slotTextures = [];

let reelContainer = null;

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

    createReels();

    background = new PIXI.Sprite(
        PIXI.loader.resources["/img/winningFrameBackground.jpg"].texture
    );

    frame = new PIXI.Sprite(
        PIXI.loader.resources["/img/slotOverlay.png"].texture
    );

    btn = new PIXI.Sprite(
        PIXI.loader.resources["/img/btn_spin_normal.png"].texture
    );

    btn.interactive = true;

    btn.on("pointerdown", onDown);

    app.stage.addChild(reelContainer);
    
    app.stage.addChild(background);
    app.stage.addChild(frame);
    app.stage.addChild(btn);

    updateSettings();

    onSizeChange();

    app.ticker.add(delta => gameLoop(delta));
}

function onDown() {
    spin();
}

function spin() {
}

function createReels() {
    reelContainer = new PIXI.Container();

    for (let i = 0; i < config.colNumber; i ++) {

        let reelCol = new PIXI.Container();

        reelCol.x = i * config.reelWidth;

        reelContainer.addChild(reelCol);

        for (let j = 0; j < config.rowNumber; j++) {

            let symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);

            symbol.y = j * config.symbolSize;
            symbol.scale.x = symbol.scale.y = Math.min(config.symbolSize / symbol.width, config.symbolSize / symbol.height);
            symbol.x = Math.round((config.reelWidth - symbol.width) / 2);

            reelCol.addChild(symbol);
        }

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
    
}

function gameLoop(delta) {  
} 