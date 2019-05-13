var app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1
});
console.log(11111);
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
var btn = null;
PIXI.loader.add([
    "/images/btn.png"
]).on("progress", loadProgressHandler).load(setup);
function loadProgressHandler(loader, resource) {
}
function setup() {
    btn = new PIXI.Sprite(PIXI.loader.resources["/images/btn.png"].texture);
    btn.interactive = true;
    btn.on("pointerdown", onDown);
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
}
function gameLoop(delta) {
}
