var app = new PIXI.Application({
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
window.addEventListener("resize", function (event) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateSettings();
    onSizeChange();
});
var settings = {
    defaultWidth: 640,
    defaultHeight: 1136
};
var config = {
    slotImageNumber: 13,
    reelWidth: 160,
    symbolSize: 150,
    colNumber: 5,
    rowNumber: 4
};
var background = null;
var frame = null;
var btn = null;
var slotTextures = [];
var reelContainer = null;
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
}
function setup() {
    for (var i = 1; i <= config.slotImageNumber; i++) {
        var target = "";
        if (i < 10) {
            target = "/img/0" + i + ".png";
        }
        else {
            target = "/img/" + i + ".png";
        }
        slotTextures.push(PIXI.loader.resources[target].texture);
    }
    createReels();
    background = new PIXI.Sprite(PIXI.loader.resources["/img/winningFrameBackground.jpg"].texture);
    frame = new PIXI.Sprite(PIXI.loader.resources["/img/slotOverlay.png"].texture);
    btn = new PIXI.Sprite(PIXI.loader.resources["/img/btn_spin_normal.png"].texture);
    btn.interactive = true;
    btn.on("pointerdown", onDown);
    app.stage.addChild(background);
    app.stage.addChild(reelContainer);
    app.stage.addChild(frame);
    app.stage.addChild(btn);
    updateSettings();
    onSizeChange();
    app.ticker.add(function (delta) { return gameLoop(delta); });
}
function onDown() {
    spin();
}
function spin() {
}
function createReels() {
    reelContainer = new PIXI.Container();
    for (var i = 0; i < config.colNumber; i++) {
        var reelCol = new PIXI.Container();
        reelCol.x = i * config.reelWidth;
        reelContainer.addChild(reelCol);
        for (var j = 0; j < config.rowNumber; j++) {
            var symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
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
    var scaleX = 0;
    var scaleY = 0;
    if (settings.isLandscape) {
        scaleX = settings.gameWidth / settings.defaultHeight;
        scaleY = settings.gameHeight / settings.defaultWidth;
    }
    else {
        scaleX = settings.gameWidth / settings.defaultWidth;
        scaleY = settings.gameHeight / settings.defaultHeight;
    }
    settings.scale = Math.min(scaleX, scaleY);
}
function onSizeChange() {
    if (reelContainer !== undefined && reelContainer !== null) {
        reelContainer.x = (settings.gameWidth - reelContainer.width) / 2;
        reelContainer.y = reelContainer.height / 7;
        if (btn !== undefined && btn !== null) {
            btn.x = reelContainer.x + reelContainer.width - btn.width;
            btn.y = reelContainer.y + reelContainer.height + btn.height * .3;
        }
        if (frame !== undefined && frame !== null) {
            frame.anchor.set(0.5, 0.5);
            frame.x = reelContainer.x + reelContainer.width * .51;
            frame.y = reelContainer.y + reelContainer.height * .48;
            frame.width = reelContainer.width * 1.19;
            frame.height = reelContainer.height * 1.2;
        }
        if (background !== undefined && background !== null) {
            background.anchor.set(0.5, 0.5);
            background.x = reelContainer.x + reelContainer.width * .5;
            background.y = reelContainer.y + reelContainer.height * .5;
            background.width = reelContainer.width * 1.1;
            background.height = reelContainer.height * 1.1;
        }
    }
}
function gameLoop(delta) {
}
