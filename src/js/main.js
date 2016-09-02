/*global GAME*/
//todo: find some button render-logic code to steal. //keyboard only game
//todo: bullets!
//todo: particles!
//todo: pubsub for enemy-player interactions

/*var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);*/

var GAME = {

    const: {
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

    },

    events: {
        P_BUMP: 0
    },

    map: {

        render: function(ctx) {
            var g = GAME;
            var data = g.Assets.map;
            for(var y = 0; y < data.length; y++){
                for(var x = 0; x < data[y].length; x++){
                    ctx.fillStyle = "#779";
                    if(data[y][x]){
                       //ctx.fillRect( x * g.const.GRID, y * g.const.GRID, g.const.GRID, g.const.GRID );
                        GAME.Txt.text({
                            ctx: ctx,
                            x: x * g.const.GRID,
                            y: y * g.const.GRID,
                            text: "ox\nxo",
                            hspacing: 0,
                            vspacing: 0,
                            halign: 'top',
                            valign: 'left',
                            scale: 1,
                            snap: 1,
                            render: 1,
                            glitchChance: g.const.GLITCH,
                            glitchFactor: g.const.GLITCHFACTOR
                        });
                    }

                }
            }
        }
    },

    init: function () {


        var g = GAME;


        //canvas layers--------------------------
        canvas = document.querySelector('#game'); //final output canvas, user-facing
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "#0F0";

        g.bg = document.createElement('canvas'); //background
        g.bg.width = 200;
        g.bg.height = 200;
        g.ctxbg = g.bg.getContext('2d');
        g.ctxbg.imageSmoothingEnabled = false;
        g.ctxbg.mozImageSmoothingEnabled = false;

        g.fg = document.createElement('canvas'); //most moving parts here, game foreground
        g.fg.width = 200;
        g.fg.height = 200;
        g.ctxfg = g.fg.getContext('2d');
        g.ctxfg.imageSmoothingEnabled = false;
        g.ctxfg.mozImageSmoothingEnabled = false;

        g.ui = document.createElement('canvas'); //ui elements
        g.ui.width = 200;
        g.ui.height = 200;
        g.ctxui = g.ui.getContext('2d');
        g.ctxui.imageSmoothingEnabled = false;
        g.ctxui.mozImageSmoothingEnabled = false;

        g.comp = document.createElement('canvas'); //our composite canvas before scaling
        g.comp.width = 200;
        g.comp.height = 200;
        g.ctxcomp = g.comp.getContext('2d');
        g.ctxcomp.imageSmoothingEnabled = false;
        g.ctxcomp.mozImageSmoothingEnabled = false;

        //temp append to figure out render
/*        var debug = document.getElementById('debug')
        debug.appendChild(g.bg);
        debug.appendChild(g.fg);
        debug.appendChild(g.ui);
        g.bg.style="display:block";
        g.fg.style="display:block";
        g.ui.style="display:block";*/



        //---------------------------------------
        g.ALL = [];
        g.fps = 60;
        g.step = 1 / g.fps;
        g.dt = 0;
        g.now = g.timestamp();
        g.last = g.timestamp();
        //console.log(g.last);
        g.loadProgress = 0;

        g.fsm = StateMachine.create({
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
                    GAME.states.boot.onenter(event, from, to)
                },
                onentermenu: function (event, from, to) {
                    GAME.states.menu.onenter(event, from, to)
                },
                onentergame: function (event, from, to) {
                    GAME.states.game.onenter(event, from, to)
                }
            }
        }),
            //initialize keypress event listeners
            window.addEventListener('keyup', function (event) {
                GAME.Key.onKeyup(event);
            }, false);
        window.addEventListener('keydown', function (event) {
            GAME.Key.onKeydown(event);
            // console.log('key pressed');
        }, false);

        //Fire up the state machine
        g.fsm.load();

        //START it up!
        g.loop();
    },


    timestamp: function () {
        return new Date().getTime();
    },

    //sound rendering
    initAudio: function () {
        var g = GAME;
        g.sounds = {};
        g.sounds.loaded = 0;
        g.sounds.total = 6;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        g.audioCtx = new AudioContext;

        g.soundGen = new g.sonantx.SoundGenerator(g.Assets.sounds.engineSound1);
        g.soundGen.createAudioBuffer(147+24, function(buffer) {
            g.sounds.loaded++;
            g.sounds.es1 = buffer;
        });
        g.soundGen = new g.sonantx.SoundGenerator(g.Assets.sounds.engineSound2);
        g.soundGen.createAudioBuffer(147+24, function(buffer) {
            g.sounds.loaded++;
            g.sounds.es1 = buffer;
        });
        g.soundGen = new g.sonantx.SoundGenerator(g.Assets.sounds.engineSound3);
        g.soundGen.createAudioBuffer(147+24, function(buffer) {
            g.sounds.loaded++;
            g.sounds.es1 = buffer;
        });
        g.soundGen = new g.sonantx.SoundGenerator(g.Assets.sounds.engineSound4);
        g.soundGen.createAudioBuffer(147+24, function(buffer) {
            g.sounds.loaded++;
            g.sounds.es1 = buffer;
        });
        g.soundGen = new g.sonantx.SoundGenerator(g.Assets.sounds.engineSound5);
        g.soundGen.createAudioBuffer(147+24, function(buffer) {
            g.sounds.loaded++;
            g.sounds.es1 = buffer;
        });
        console.log('rendering music');
        g.song = new g.sonantx.MusicGenerator(g.Assets.song);
        g.song.createAudioBuffer(function (buffer) {
            g.song1 = g.audioCtx.createBufferSource();
            g.song1.buffer = buffer;
            g.song1.connect(g.audioCtx.destination);
            g.sounds.loaded++;
            //g.song1.start();
        });

    },

    loop: function () {
        //stats.begin();

        //onsole.log('loop running');

        var g = GAME;
        g.now = g.timestamp();

        g.dt = g.dt + Math.min(1, (g.now - g.last) / 1000);
        //console.log(g.dt + ' '+ g.step);

        while (g.dt > g.step) {
            g.dt = g.dt - g.step;
            g.states[g.fsm.current].update(g.step);
        }

        g.states[g.fsm.current].render(g.ctxfg);
        g.last = g.now;

        //----temp map render
        g.ctxcomp.drawImage(g.bg, 0,0); //composite our canvas layers together
        g.ctxcomp.drawImage(g.fg, 0,0);


        //g.ctxcomp.save();
        //ctx.globalAlpha = 0.9;
        //g.ctxcomp.drawImage(g.fg, 2,2, 198, 198, 0, 0, 202, 202); //fun faux-3d effect, revisit this later
        //g.ctxcomp.drawImage(g.fg, 4,4, 196, 196, 0, 0, 204, 204);
        //g.ctxcomp.drawImage(g.fg, 6,6, 194, 194, 0, 0, 206, 206);
        //g.ctxcomp.restore();
        //g.ctxcomp.drawImage(g.fg, 8,8, 192, 192, 0, 0, 208, 208);

        g.ctxcomp.drawImage(g.ui, 0,0);

        ctx.clearRect(0, 0, g.const.GAMEWIDTH * g.const.SCALE, g.const.GAMEHEIGHT * g.const.SCALE); //erase -if bg is 100% opaque, maybe able to nix this step in the future
        ctx.drawImage(
            g.comp, 0, 0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT, //source
            0, 0, g.const.GAMEWIDTH * g.const.SCALE, g.const.GAMEHEIGHT * g.const.SCALE //destination, scaled 3x
        );

        //stats.end();

        requestAnimationFrame(GAME.loop);

    },

    clear: function(g){
        g.ctxcomp.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
        g.ctxbg.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
        g.ctxfg.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
        g.ctxui.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
    }


};











