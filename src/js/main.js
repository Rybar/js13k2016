/*global GAME*/
//todo: find some button render-logic code to steal. //keyboard only game
//todo: bullets!
//todo: particles!
//todo: pubsub for enemy-player interactions

/*var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);*/
var ALL = [],
    fps = 60,
    step = 1 / fps,
    dt = 0,
    now = timestamp(),
    last = timestamp(),
    sounds = {},
    that = this,
    fsm = {},
//console.log(last);
    loadProgress = 0;

//canvas layers--------------------------
var canvas = document.querySelector('#game'); //final output canvas, user-facing
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "#0F0";

var bg = document.createElement('canvas'); //background
bg.width = 200;
bg.height = 200;
var ctxbg = bg.getContext('2d');
ctxbg.imageSmoothingEnabled = false;
ctxbg.mozImageSmoothingEnabled = false;

var fg = document.createElement('canvas'); //most moving parts here, game foreground
fg.width = 200;
fg.height = 200;
var ctxfg = fg.getContext('2d');
ctxfg.imageSmoothingEnabled = false;
ctxfg.mozImageSmoothingEnabled = false;

var ui = document.createElement('canvas'); //ui elements
ui.width = 200;
ui.height = 200;
var ctxui = ui.getContext('2d');
ctxui.imageSmoothingEnabled = false;
ctxui.mozImageSmoothingEnabled = false;

var comp = document.createElement('canvas'); //our composite canvas before scaling
comp.width = 200;
comp.height = 200;
var ctxcomp = comp.getContext('2d');
ctxcomp.imageSmoothingEnabled = false;
ctxcomp.mozImageSmoothingEnabled = false;


var Const = {
        GAMEWIDTH: 200,
        GAMEHEIGHT: 200,

        SCALE: 3,

        GRID: 10,
        WIDTH: 20,
        HEIGHT: 20,

        P_SPEED: 1,
        P_JUMP: 0.5,

        E_SPEED:.2,
        E_JUMP: .25,

        GLITCH: 0,
        GLITCHFACTOR: 0

    };



    var events =  {
        P_BUMP: 0
    };

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
                            text: "ox\nxo",
                            hspacing: 0,
                            vspacing: 0,
                            halign: 'top',
                            valign: 'left',
                            scale: 1,
                            snap: 1,
                            render: 1,
                            glitchChance: Const.GLITCH,
                            glitchFactor: Const.GLITCHFACTOR
                        });
                    }

                }
            }
        }
    };

    function init() {


        //temp append to figure out render
/*        var debug = document.getElementById('debug')
        debug.appendChild(bg);
        debug.appendChild(fg);
        debug.appendChild(ui);
        bg.style="display:block";
        fg.style="display:block";
        ui.style="display:block";*/



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
        soundGen = new sonantx.SoundGenerator(Assets.sounds.engineSound2);
        soundGen.createAudioBuffer(147+24, function(buffer) {
            sounds.loaded++;
            sounds.es2 = buffer;
        });
        soundGen = new sonantx.SoundGenerator(Assets.sounds.engineSound3);
        soundGen.createAudioBuffer(147+24, function(buffer) {
            sounds.loaded++;
            sounds.es3 = buffer;
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

    function playSound(buffer, loop) {

        var source = audioCtx.createBufferSource();
        var gainNode = audioCtx.createGain();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.loop = loop;
        gainNode.gain.value = 1;
        source.start();
        return {volume: gainNode, sound: source};
    }

    function loop() {
        //stats.begin();

        //onsole.log('loop running');


        now = timestamp();

        dt = dt + Math.min(1, (now - last) / 1000);
        //console.log(dt + ' '+ step);

        while (dt > step) {
            dt = dt - step;
            states[fsm.current].update(step);
        }

        states[fsm.current].render(ctxfg);
        last = now;

        //----temp map render
        ctxcomp.drawImage(bg, 0,0); //composite our canvas layers together
        ctxcomp.drawImage(fg, 0,0);


        //ctxcomp.save();
        //ctx.globalAlpha = 0.9;
        //ctxcomp.drawImage(fg, 2,2, 198, 198, 0, 0, 202, 202); //fun faux-3d effect, revisit this later
        //ctxcomp.drawImage(fg, 4,4, 196, 196, 0, 0, 204, 204);
        //ctxcomp.drawImage(fg, 6,6, 194, 194, 0, 0, 206, 206);
        //ctxcomp.restore();
        //ctxcomp.drawImage(fg, 8,8, 192, 192, 0, 0, 208, 208);

        ctxcomp.drawImage(ui, 0,0);

        ctx.clearRect(0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE); //erase -if bg is 100% opaque, maybe able to nix this step in the future
        ctx.drawImage(
            comp, 0, 0, Const.GAMEWIDTH, Const.GAMEHEIGHT, //source
            0, 0, Const.GAMEWIDTH * Const.SCALE, Const.GAMEHEIGHT * Const.SCALE //destination, scaled 3x
        );

        //stats.end();

        requestAnimationFrame(loop);

    }

    function clear(g){
        ctxcomp.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
        ctxbg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
        ctxfg.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
        ctxui.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
    }











