/*global GAME*/

var UNDEF = 'undefined';
var PROTO = 'prototype';
var CONSTRUCTOR = 'constructor'; //some crazy byte-saving trick I don't grok.

var score = 0;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
var ALL = [],
    fps = 60,
    step = 1 / fps,
    dt = 0,
    now = timestamp(),
    last = timestamp(),
    sounds = {},
    that = this,
    fsm = {};

window.all = ALL;

var particlePool = new Pool(2000, Particle);

var enemyPool = new Pool(25, Enemy);

var bulletPool = new Pool(100, Particle);

//console.log(last);
var loadProgress = 0;

var Const = {
    GAMEWIDTH: 270,
    GAMEHEIGHT: 200,

    SCALE: 3,

    GRID: 10,
    WIDTH: 27,
    HEIGHT: 20,

    P_SPEED: 1,
    P_JUMP: 1,

    E_SPEED:.5,
    E_JUMP: .25,

    GLITCH: { xch: 0, xamt: 5, ych: 0, yamt: 10}

};

var enemySpawnRate = 2.25;
var enemySpawnTimer = 0;

//canvas layers--------------------------
var canvas = document.querySelector('#game'); //final output canvas, user-facing
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

var bg = document.createElement('canvas'); //background
bg.width = Const.GAMEWIDTH;
bg.height = Const.GAMEHEIGHT;
var ctxbg = bg.getContext('2d');
//ctxbg.imageSmoothingEnabled = false;
//ctxbg.mozImageSmoothingEnabled = false;

var fg = document.createElement('canvas'); //most moving parts here, game foreground
fg.width = Const.GAMEWIDTH;
fg.height = Const.GAMEHEIGHT;
var ctxfg = fg.getContext('2d');
//ctxfg.imageSmoothingEnabled = false;
//ctxfg.mozImageSmoothingEnabled = false;

var ui = document.createElement('canvas'); //ui elements
ui.width = Const.GAMEWIDTH;
ui.height = Const.GAMEHEIGHT;
var ctxui = ui.getContext('2d');
//ctxui.imageSmoothingEnabled = false;
//ctxui.mozImageSmoothingEnabled = false;

var comp = document.createElement('canvas'); //our composite canvas before scaling
comp.width = Const.GAMEWIDTH;
comp.height = Const.GAMEHEIGHT;
var ctxcomp = comp.getContext('2d');
//ctxcomp.imageSmoothingEnabled = false;
//ctxcomp.mozImageSmoothingEnabled = false;

var mosaic = makeMosaic();

function makeMosaic(){ //totally stealing from deepnight here.
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    c.width = Const.GAMEWIDTH * Const.SCALE;
    c.height = Const.GAMEHEIGHT * Const.SCALE;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0,0, c.width, c.height);
    for(var w = 0; w <= Const.GAMEWIDTH; w++){

        for(var h = 0; h <= Const.GAMEHEIGHT; h++){

            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(w*Const.SCALE, h*Const.SCALE, 2, 2);

            ctx.fillStyle = "#707070";
            ctx.fillRect(w*Const.SCALE, h*Const.SCALE + 2, 1, 1);

        }
    }
    return {canvas: c, context: ctx};


}



var map = {

    render: function(ctx) {

        var data = Assets.map;
        for(var y = 0; y < data.length; y++){
            for(var x = 0; x < data[y].length; x++){
                ctx.fillStyle = "#779";
                if(data[y][x]){
                    //ctx.fillRect( x * Const.GRID, y * Const.GRID, Const.GRID, Const.GRID );
                    Txt.text({
                        ctx: ctx,
                        x: x * Const.GRID,
                        y: y * Const.GRID,
                        text: "oO\nOo",
                        hspacing: 0,
                        vspacing: 0,
                        halign: 'top',
                        valign: 'left',
                        scale: 1,
                        snap: 1,
                        render: 1,
                        glitch: Const.GLITCH
                    });
                }

            }
        }
    }
};

function rnd(min, max){
    return Math.random() * (max - min + 1) + min;
}

function rndTxt(string, amt) {
    var text = '';
    var i = amt;
    while(i--) text += string.charAt(Math.floor(Math.random() * string.length));
    return text;
}

function norm(value, min, max){
    return (value - min) / (max - min);
}

function init() {

    particlePool.init();
    bulletPool.init();
    enemyPool.init();

    //---------------------------------------


    fsm = StateMachine.create({
        initial: "init",

        events: [
            {name: 'load', from: 'init', to: 'boot'},
            {name: 'ready', from: 'boot', to: 'menu'},
            {name: 'play', from: 'menu', to: 'game'},
            {name: 'lose', from: 'game', to: 'gameover'},
            {name: 'reset', from: ['init', 'boot', 'menu', 'gameover', 'game'], to: 'boot'},
        ],

        callbacks: {
            onenterboot: function (event, from, to) {
                states.boot.onenter(event, from, to)
            },
            onentermenu: function (event, from, to) {
                states.menu.onenter(event, from, to)
            },
            onleavemenu: function (event, from, to) {
                states.menu.onexit(event, from, to)
            },
            onentergame: function (event, from, to) {
                states.game.onenter(event, from, to)
            },
            onleavegame: function (event, from, to) {
                states.onexit(event, from, to)
            }
        }
    });


    //initialize keypress event listeners
    window.addEventListener('keyup', function (event) {
        Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function (event) {
        Key.onKeydown(event);
        // console.log('key pressed');
    }, false);

    //Fire up the state machine
    fsm.load();

    //START it up!
    loop();
}
function timestamp() {
    return new Date().getTime();
}

//sound rendering
initAudio = function() {

    sounds.loaded = 0;
    sounds.total = 7;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext;

    soundGen = new sonantx.SoundGenerator(Assets.sounds.jump);
    soundGen.createAudioBuffer(147+24, function(buffer) {
        sounds.loaded++;
        sounds.jump = buffer;
    });
    soundGen = new sonantx.SoundGenerator(Assets.sounds.shoot);
    soundGen.createAudioBuffer(147+24, function(buffer) {
        sounds.loaded++;
        sounds.shoot = buffer;
    });
    soundGen = new sonantx.SoundGenerator(Assets.sounds.boom);
    soundGen.createAudioBuffer(147, function(buffer) {
        sounds.loaded++;
        sounds.boom = buffer;
    });
    soundGen = new sonantx.SoundGenerator(Assets.sounds.engineSound4);
    soundGen.createAudioBuffer(147+24, function(buffer) {
        sounds.loaded++;
        sounds.es4 = buffer;
    });
    soundGen = new sonantx.SoundGenerator(Assets.sounds.engineSound5);
    soundGen.createAudioBuffer(147+24, function(buffer) {
        sounds.loaded++;
        sounds.es5 = buffer;
    });
    //console.log('rendering music');
    soundGen = new sonantx.MusicGenerator(Assets.song);
    soundGen.createAudioBuffer(function (buffer) {
        sounds.song = buffer;
        sounds.loaded++;
    });

    soundGen = new sonantx.MusicGenerator(Assets.titlesong);
    soundGen.createAudioBuffer(function (buffer) {
        sounds.titlesong = buffer;
        sounds.loaded++;
    });

};

function playSound(buffer, playbackRate, pan, loop) {

    var source = audioCtx.createBufferSource();
    var gainNode = audioCtx.createGain();
    var panNode = audioCtx.createStereoPanner();

    source.buffer = buffer;
    source.connect(panNode);
    panNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    //gainNode.connect(audioCtx.destination);
    source.playbackRate.value = playbackRate;
    source.loop = loop;
    gainNode.gain.value = 1;
    panNode.pan.value = pan;
    source.start();
    return {volume: gainNode, sound: source};
}

function loop() {

    stats.begin();

    now = timestamp();

    dt += Math.min(1, (now - last) / 1000);

    states[fsm.current].render(ctxfg);

    while (dt > step) {
        dt -= step;
        states[fsm.current].update(step);
    }
    last = now;


    ctxcomp.drawImage(bg, 0,0); //composite our canvas layers together
    ctxcomp.drawImage(fg, 0,0);
    ctxcomp.drawImage(ui, 0,0);
    ctx.save();
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE); //erase -if bg is 100% opaque, maybe able to nix this step in the future
    ctx.drawImage(
        comp, 0, 0, Const.GAMEWIDTH, Const.GAMEHEIGHT, //source
        0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE //destination, scaled 3x
    );
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(mosaic.canvas, 0,0);
    ctx.restore();

    stats.end();

    requestAnimationFrame(loop);

}

function clear(g){
    ctxcomp.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxbg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxfg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxui.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
}













