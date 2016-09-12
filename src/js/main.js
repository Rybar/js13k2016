/*global GAME*/

var UNDEF = 'undefined';
var PROTO = 'prototype';
var CONSTRUCTOR = 'constructor'; //some crazy byte-saving trick I don't grok.

var score = 0;

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
console.log('firefox? : ' + isFirefox);

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

var states = {};

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

    GLITCH: { xch: 0, xamt: 10, ych: 0, yamt: 10}

};

var enemySpawnRate = 2;
var enemySpawnTimer = 0;
var gameOverCountdown = 15;

//canvas layers--------------------------
var canvas = document.querySelector('#game'); //final output canvas, user-facing
var finalctx = canvas.getContext('2d');
finalctx.imageSmoothingEnabled = false;
finalctx.mozImageSmoothingEnabled = false;

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

if(!isFirefox)var mosaic = makeMosaic();

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

            ctx.fillStyle = "#f8f8f8";
            ctx.fillRect(w*Const.SCALE + 2, h*Const.SCALE, 1, 1);

        }
    }
    return {canvas: c, context: ctx};


}



var map = {

    render: function(ctx) {

        var data = Assets.map;

        var tiles = ['', 'oO\nOo', 'oo\noo', 'oo\noo' ]
        for(var y = 0; y < data.length; y++){
            for(var x = 0; x < data[y].length; x++){

                if(data[y][x]){

                    ctx.fillStyle = "#75A";
                    Txt.text({
                        ctx: ctx,
                        x: x * Const.GRID,
                        y: y * Const.GRID,
                        text: tiles[data[y][x]],
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
            {name: 'play', from: ['menu', 'gameover'], to: 'game'},
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
                states.game.onexit(event, from, to)
            },
            onentergameover: function (event, from, to) {
                states.gameover.onenter(event, from, to)
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
    soundGen.createAudioBuffer(147, function(buffer) {
        sounds.loaded++;
        sounds.shoot = buffer;
    });
    soundGen = new sonantx.SoundGenerator(Assets.sounds.boom);
    soundGen.createAudioBuffer(147, function(buffer) {
        sounds.loaded++;
        sounds.boom = buffer;
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

    soundGen = new sonantx.MusicGenerator(Assets.gameover);
    soundGen.createAudioBuffer(function (buffer) {
        sounds.gameover = buffer;
        sounds.loaded++;
    });

    soundGen = new sonantx.MusicGenerator(Assets.glitchget);
    soundGen.createAudioBuffer(function (buffer) {
        sounds.glitchget = buffer;
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
    finalctx.save();
    finalctx.fillStyle = "black";
    finalctx.fillRect(0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE); //erase -if bg is 100% opaque, maybe able to nix this step in the future
    finalctx.drawImage(
        comp, 0, 0, Const.GAMEWIDTH, Const.GAMEHEIGHT, //source
        0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE //destination, scaled 3x
    );
    finalctx.restore();
    finalctx.save();
if(!isFirefox){
    finalctx.globalCompositeOperation = 'overlay';
    finalctx.drawImage(mosaic.canvas, 0,0);
}


    finalctx.restore();


    finalctx.globalCompositeOperation = 'source-over';


    stats.end();

    requestAnimationFrame(loop);

}

function clear(g){
    ctxcomp.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxbg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxfg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    ctxui.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
}













