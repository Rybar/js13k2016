/**
 * Created by Ryan on 9/2/2016.
 */
var GAME = (function(){
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
    };


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












/*

 Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

 Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
 Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

 */

    var StateMachine = {

        //---------------------------------------------------------------------------

        VERSION: "2.3.5",

        //---------------------------------------------------------------------------

        Result: {
            SUCCEEDED:    1, // the event transitioned successfully from one state to another
            NOTRANSITION: 2, // the event was successfull but no state transition was necessary
            CANCELLED:    3, // the event was cancelled by the caller in a beforeEvent callback
            PENDING:      4  // the event is asynchronous and the caller is in control of when the transition occurs
        },

        Error: {
            INVALID_TRANSITION: 100, // caller tried to fire an event that was innapropriate in the current state
            PENDING_TRANSITION: 200, // caller tried to fire an event while an async transition was still pending
            INVALID_CALLBACK:   300 // caller provided callback function threw an exception
        },

        WILDCARD: '*',
        ASYNC: 'async',

        //---------------------------------------------------------------------------

        create: function(cfg, target) {

            var initial      = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
            var terminal     = cfg.terminal || cfg['final'];
            var fsm          = target || cfg.target  || {};
            var events       = cfg.events || [];
            var callbacks    = cfg.callbacks || {};
            var map          = {}; // track state transitions allowed for an event { event: { from: [ to ] } }
            var transitions  = {}; // track events allowed from a state            { state: [ event ] }

            var add = function(e) {
                var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
                map[e.name] = map[e.name] || {};
                for (var n = 0 ; n < from.length ; n++) {
                    transitions[from[n]] = transitions[from[n]] || [];
                    transitions[from[n]].push(e.name);

                    map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
                }
            };

            if (initial) {
                initial.event = initial.event || 'startup';
                add({ name: initial.event, from: 'none', to: initial.state });
            }

            for(var n = 0 ; n < events.length ; n++)
                add(events[n]);

            for(var name in map) {
                if (map.hasOwnProperty(name))
                    fsm[name] = StateMachine.buildEvent(name, map[name]);
            }

            for(var name in callbacks) {
                if (callbacks.hasOwnProperty(name))
                    fsm[name] = callbacks[name]
            }

            fsm.current     = 'none';
            fsm.is          = function(state) { return (state instanceof Array) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
            fsm.can         = function(event) { return !this.transition && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); }
            fsm.cannot      = function(event) { return !this.can(event); };
            fsm.transitions = function()      { return transitions[this.current]; };
            fsm.isFinished  = function()      { return this.is(terminal); };
            fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)

            if (initial && !initial.defer)
                fsm[initial.event]();

            return fsm;

        },

        //===========================================================================

        doCallback: function(fsm, func, name, from, to, args) {
            if (func) {
                try {
                    return func.apply(fsm, [name, from, to].concat(args));
                }
                catch(e) {
                    return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e);
                }
            }
        },

        beforeAnyEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbeforeevent'],                       name, from, to, args); },
        afterAnyEvent:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafterevent'] || fsm['onevent'],      name, from, to, args); },
        leaveAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleavestate'],                        name, from, to, args); },
        enterAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenterstate'] || fsm['onstate'],      name, from, to, args); },
        changeState:     function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onchangestate'],                       name, from, to, args); },

        beforeThisEvent: function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbefore' + name],                     name, from, to, args); },
        afterThisEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafter'  + name] || fsm['on' + name], name, from, to, args); },
        leaveThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleave'  + from],                     name, from, to, args); },
        enterThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenter'  + to]   || fsm['on' + to],   name, from, to, args); },

        beforeEvent: function(fsm, name, from, to, args) {
            if ((false === StateMachine.beforeThisEvent(fsm, name, from, to, args)) ||
                (false === StateMachine.beforeAnyEvent( fsm, name, from, to, args)))
                return false;
        },

        afterEvent: function(fsm, name, from, to, args) {
            StateMachine.afterThisEvent(fsm, name, from, to, args);
            StateMachine.afterAnyEvent( fsm, name, from, to, args);
        },

        leaveState: function(fsm, name, from, to, args) {
            var specific = StateMachine.leaveThisState(fsm, name, from, to, args),
                general  = StateMachine.leaveAnyState( fsm, name, from, to, args);
            if ((false === specific) || (false === general))
                return false;
            else if ((StateMachine.ASYNC === specific) || (StateMachine.ASYNC === general))
                return StateMachine.ASYNC;
        },

        enterState: function(fsm, name, from, to, args) {
            StateMachine.enterThisState(fsm, name, from, to, args);
            StateMachine.enterAnyState( fsm, name, from, to, args);
        },

        //===========================================================================

        buildEvent: function(name, map) {
            return function() {

                var from  = this.current;
                var to    = map[from] || map[StateMachine.WILDCARD] || from;
                var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

                if (this.transition)
                    return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");

                if (this.cannot(name))
                    return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);

                if (false === StateMachine.beforeEvent(this, name, from, to, args))
                    return StateMachine.Result.CANCELLED;

                if (from === to) {
                    StateMachine.afterEvent(this, name, from, to, args);
                    return StateMachine.Result.NOTRANSITION;
                }

                // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
                var fsm = this;
                this.transition = function() {
                    fsm.transition = null; // this method should only ever be called once
                    fsm.current = to;
                    StateMachine.enterState( fsm, name, from, to, args);
                    StateMachine.changeState(fsm, name, from, to, args);
                    StateMachine.afterEvent( fsm, name, from, to, args);
                    return StateMachine.Result.SUCCEEDED;
                };
                this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
                    fsm.transition = null;
                    StateMachine.afterEvent(fsm, name, from, to, args);
                }

                var leave = StateMachine.leaveState(this, name, from, to, args);
                if (false === leave) {
                    this.transition = null;
                    return StateMachine.Result.CANCELLED;
                }
                else if (StateMachine.ASYNC === leave) {
                    return StateMachine.Result.PENDING;
                }
                else {
                    if (this.transition) // need to check in case user manually called transition() but forgot to return StateMachine.ASYNC
                        return this.transition();
                }

            };
        }

    }; // StateMachine

//===========================================================================



//todo: split out into separate modules
/*global that*/
    states =  {

        boot: {

            onenter: function() {
                if(!sounds.jump)initAudio(); //off for now, placeholder song works
                else that.audioCtx = {};
            },

            render: function(){

                clear(GAME);
                ALL = [];
                var loadmsg = ['INITIALIZING',
                    'RENDERING SOUNDS...',
                    'CONFIGURATING PIXELS....',
                    'RETICULATING SPLINES...',
                    'MESSAGE 42',
                    'PREPARING ENEMIES...',
                    'ALMOST THERE...',
                    'READY. PRESS A TO CONTINUE'];

                ctx.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
                ctxui.fillStyle = "#0f0";
                Txt.text({
                    ctx: ctxui,
                    x: 20,
                    y: 20,
                    text: loadmsg[sounds.loaded],
                    hspacing: 2,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'left',
                    scale: 1,
                    snap: 1,
                    render: 1,
                    glitchChance: .0,
                    glitchFactor: 0
                });

            },
            update: function(){

                if(Key.isDown(Key.r)) {
                    if(fsm.current)fsm.reset();
                }
                if(sounds.loaded == sounds.total && Key.isDown(Key.a)) {
                    if(fsm.current == 'boot') fsm.ready();
                }

            }

        },

        menu: {

            onenter: function(event, from, to){
                if(event == 'ready'){
                    titlesong=playSound(sounds.titlesong, true);
                }
            },

            onexit: function(event, from, to){
              if(event == 'play') titlesong.sound.stop();
            },

            render: function(){

                clear(GAME);

                ctxbfillStyle = "#444";


                ctx.fillStyle = "#fff";
                Txt.text({
                    ctx: ctxui,
                    x: 20,
                    y: 20,
                    text: "GLITCHBOX\nPRESS S TO CONTINUE",
                    hspacing: 2,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'center',
                    scale: 1,
                    snap: 1,
                    render: 1,
                    glitchChance: .01,
                    glitchFactor: 2
                });
            },

            update: function(){
                if(Key.isDown(Key.r)) {
                    if(fsm.current)fsm.reset();
                }

                if(Key.isDown(Key.s)) {
                    ctx.fillStyle = "#00ff00";
                    if(fsm.current == 'menu') fsm.play();
                }


            }

        },

        game: {

            onenter: function(event, from, to){

                switch(event) {

                    case 'play':

                        player = Player({
                            x: 100,
                            y: 100
                        });
                        ALL.push(player);

                        var enemies = 10;
                        while(enemies--){
                           var enemy = Enemy({
                                x: Math.floor(Math.random() * 200),
                                y: Math.floor(Math.random() * 200),
                                radius: Math.abs(Math.floor(Math.random() * 2) + 4)
                                 });
                            ALL.push(enemy);

                        }

                        song=playSound(sounds.song, true)
                        break;
                }

            },

            onexit: function(event, from, to){
              titlesong.sound.stop();
            },

            render: function(){

                clear(GAME);

                //background-------------------
                ctxbg.fillStyle = "#223";
                Txt.text({
                    ctx: ctxbg,
                    x: 0,
                    y: 0,
                    text: "xzxz\nzxzx\nxzxz\nzxzx",
                    hspacing: 0,
                    vspacing: 0,
                    halign: 'top',
                    valign: 'left',
                    scale: 10,
                    snap: 1,
                    render: 1,
                    glitchChance: 0.05 + Const.GLITCH,
                    glitchFactor: .05 + Const.GLITCHFACTOR,
                });
                //UI text-----------------------
                Txt.text({
                    ctx: ctxui,
                    x: 10,
                    y: 10,
                    text: "WASD OR ARROWS TO MOVE",
                    hspacing: 2, vspacing: 1, halign: 'top', valign: 'left',
                    scale: 1, snap: 1, render: 1,
                    glitchChance: .4, glitchFactor: .5
                });

                map.render(ctxfg);

                ALL.forEach(function(element, index, array){
                    element.render(ctxfg);
                });



            },

            update: function(step){

                //reset from any state
                if(Key.isDown(Key.r)) {
                    if(fsm.current)fsm.reset();
                }


               if(Key.isDown(Key.f))
               {
                   Const.GLITCH += .01;
               }
                if(Key.isDown(Key.p))
               {
                   Const.GLITCHFACTOR += .01;
               }


                //physics update

                ALL.forEach(function(element, index, array){
                    element.update(step);
                    element.body.update(step);
                });


            }

        },

        gameover: {
            render: function(ctx){

                ctx.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);

                Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "GAME OVER\nPRESS X TO PLAY AGAIN\nPRESS Z FOR MENU",
                    hspacing: 5,
                    vspacing: 5,
                    halign: 'top',
                    valign: 'left',
                    scale: 4,
                    snap: 1,
                    render: 1,
                    glitchChance: .01,
                    glitchFactor: 2
                });

            },
            update: function(){

                if(Key.isDown(Key.r)) {

                    if(fsm.current)fsm.reset();

                }
                if(Key.isDown(Key.s)){

                    if(fsm.current == 'gameover')fsm.play();

                }

            }

        }

    };

Player =  function(opt) {
        body = new Entity({
            radius: 10,
            type: 'player',
            collides: true,
            mapcollide: true,
            gravity: 0.05
        });
        body.setCoords(opt.x,opt.y);

        return {

            cooldown: 0,
            body: body,
            angle: 0,
            update: function(step){

                //player movement
                if(Key.isDown(Key.LEFT) || Key.isDown(Key.a))
                {
                    //console.log(player.body.dx, + " " + player.body.cx + " " + player.body.xx);
                    player.body.dx -= Const.P_SPEED * step;
                }
                else if(Key.isDown(Key.RIGHT) || Key.isDown(Key.d))
                {
                    //console.log(player.body.dx, + " " + player.body.cx + " " + player.body.xx);
                    player.body.dx += Const.P_SPEED * step;
                }

                if(Key.isDown(Key.UP) || Key.isDown(Key.w))
                {
                    player.body.dy = -Const.P_JUMP;
                    playSound(sounds.jump);
                }
                else if(Key.isDown(Key.DOWN) || Key.isDown(Key.s))
                {
                    player.body.dy += Const.P_SPEED * step;
                }

                //console.log('update step');
            },
            render: function(ctx){
                ctx.fillStyle = "#0f0"
                Txt.text({
                    ctx: ctx,
                    x: this.body.xx-this.body.radius,
                    y: this.body.yy-this.body.radius,
                    text: "we\nsd",
                    hspacing: 0,
                    vspacing: 0,
                    halign: 'top',
                    valign: 'left',
                    scale: 1,
                    snap: 1,
                    render: 1,
                    glitchChance: Math.min(Math.abs(this.body.dx * 10), .5),
                    glitchFactor: 2
                });

            }
        };
    }

    Enemy = function(opt) {

        body = new Entity({
            radius: opt.radius,
            type: 'enemy',
            collides: false,
            mapcollide: true,
            gravity: 0.06,
            fillStyle: "#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00", //random shade of red

        });
        body.setCoords(opt.x, opt.y);
        return {
            color: '#f00',
            body: body,
            movingLeft: true,
            antennae: Math.random() > 0.5,

            update: function(step){

                //patrol logic ----------------
                if(this.movingLeft){
                    this.body.dx -= Const.E_SPEED * step;
                }
                else this.body.dx += Const.E_SPEED * step;

                if(this.body.onWallLeft()){
                    this.movingLeft = false;
                }
                if(this.body.onWallRight()){
                    this.movingLeft = true;
                }
                if(this.body.collided){
                    this.movingLeft = !this.movingLeft;
                    this.body.collided = false;
                }

                //world wrap + anger stuff? crate-box style
                if(this.body.yy > Const.GAMEHEIGHT){
                    this.body.setCoords(100, -5);
                }

                //console.log('enemy update');
                //body.update();
            },

            render: function(ctx){
                ctx.fillStyle = "#800";
                ctx.strokeStyle = "#f00";
                ctx.save();
                ctx.translate(0.5, 0.5);

                ctx.fillStyle = opt.fillStyle;
                ctx.fillRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    (this.body.radius*2),
                    (this.body.radius*2));
                ctx.strokeRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);

                ctx.restore();//post stroke, put back the .5 translation so future rendering isnt on subpixels

                ctx.fillStyle = "#FFF";  //eyes
                ctx.fillRect(
                    this.body.xx-3,
                    this.body.yy-2,
                    1, 1);
                ctx.fillRect(
                    this.body.xx+3,
                    this.body.yy-2,
                    1, 1);
                ctx.fillStyle = "#FF0"
                if(this.antennae) {
                    ctx.fillRect(
                        this.body.xx - 3,
                        this.body.yy - 9,
                        1,
                        5);
                    ctx.fillRect(
                        this.body.xx + 3,
                        this.body.yy - 9,
                        1,
                        5);
                }


            }

        };

    };
    Key = {

        _pressed: {},
        _released: {},

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        a: 65,
        w: 87,
        s: 83,
        d: 68,
        z: 90,
        x: 88,
        f: 70,
        p: 80,
        r: 82,

        isDown: function (keyCode) {
            return this._pressed[keyCode];
        },

        justReleased: function (keyCode) {
            return this._released[keyCode];
        },

        onKeydown: function (event) {
            this._pressed[event.keyCode] = true;
        },

        onKeyup: function (event) {
            this._released[event.keyCode] = true;
            delete this._pressed[event.keyCode];

        },

        update: function () {
            this._released = {};
        }
    };

/*global G */

//sounds created in sonant-live composer, rendered with sonant-x
//5x5 pixel letters created by Jack Rugile, Radius Raid
//5x5 sprite-part lowercase characters graphics created by Ryan Malm

//todo: letters-sprites: investigate hand-compression schemes, RLE, encoding each sprite as a single integer
var Assets = {

        map:  [

            [1,1,1,1,1,1,1,1,,,,,1,1,1,1,1,1,1,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,1,1,1,1,1,1,1,1,1,1,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,1,1,1,1,,,,,,,,,,,1,1,1,1,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,,,,,,,,,,,,,,,,,,,1],
            [1,1,1,1,1,1,1,1,,,,,1,1,1,1,1,1,1,1],

        ],

        sounds: {
            jump: {
                "osc1_oct": 7,
                "osc1_det": 0,
                "osc1_detune": 0,
                "osc1_xenv": 1,
                "osc1_vol": 192,
                "osc1_waveform": 2,
                "osc2_oct": 7,
                "osc2_det": 0,
                "osc2_detune": 0,
                "osc2_xenv": 1,
                "osc2_vol": 201,
                "osc2_waveform": 0,
                "noise_fader": 0,
                "env_attack": 7105,
                "env_sustain": 150,
                "env_release": 0,
                "env_master": 191,
                "fx_filter": 2,
                "fx_freq": 5839,
                "fx_resonance": 254,
                "fx_delay_time": 1,
                "fx_delay_amt": 16,
                "fx_pan_freq": 6,
                "fx_pan_amt": 128,
                "lfo_osc1_freq": 0,
                "lfo_fx_freq": 1,
                "lfo_freq": 6,
                "lfo_amt": 195,
                "lfo_waveform": 0
            },

            engineSound2: {
                "osc1_oct": 7,
                "osc1_det": 0,
                "osc1_detune": 0,
                "osc1_xenv": 1,
                "osc1_vol": 192,
                "osc1_waveform": 0,
                "osc2_oct": 7,
                "osc2_det": 0,
                "osc2_detune": 39,
                "osc2_xenv": 1,
                "osc2_vol": 192,
                "osc2_waveform": 0,
                "noise_fader": 0,
                "env_attack": 193767,
                "env_sustain": 118467,
                "env_release": 200000,
                "env_master": 192,
                "fx_filter": 4,
                "fx_freq": 2962,
                "fx_resonance": 143,
                "fx_delay_time": 1,
                "fx_delay_amt": 35,
                "fx_pan_freq": 1,
                "fx_pan_amt": 255,
                "lfo_osc1_freq": 0,
                "lfo_fx_freq": 0,
                "lfo_freq": 3,
                "lfo_amt": 0,
                "lfo_waveform": 1
            },

            engineSound3: {
                "osc1_oct": 7,
                "osc1_det": 0,
                "osc1_detune": 0,
                "osc1_xenv": 1,
                "osc1_vol": 192,
                "osc1_waveform": 0,
                "osc2_oct": 7,
                "osc2_det": 0,
                "osc2_detune": 39,
                "osc2_xenv": 1,
                "osc2_vol": 192,
                "osc2_waveform": 0,
                "noise_fader": 0,
                "env_attack": 193767,
                "env_sustain": 118467,
                "env_release": 200000,
                "env_master": 192,
                "fx_filter": 4,
                "fx_freq": 2962,
                "fx_resonance": 143,
                "fx_delay_time": 1,
                "fx_delay_amt": 35,
                "fx_pan_freq": 1,
                "fx_pan_amt": 255,
                "lfo_osc1_freq": 0,
                "lfo_fx_freq": 0,
                "lfo_freq": 3,
                "lfo_amt": 0,
                "lfo_waveform": 1
            },

            engineSound4: {
                "osc1_oct": 7,
                "osc1_det": 0,
                "osc1_detune": 0,
                "osc1_xenv": 1,
                "osc1_vol": 192,
                "osc1_waveform": 0,
                "osc2_oct": 7,
                "osc2_det": 0,
                "osc2_detune": 39,
                "osc2_xenv": 1,
                "osc2_vol": 192,
                "osc2_waveform": 0,
                "noise_fader": 0,
                "env_attack": 193767,
                "env_sustain": 118467,
                "env_release": 200000,
                "env_master": 192,
                "fx_filter": 4,
                "fx_freq": 2962,
                "fx_resonance": 143,
                "fx_delay_time": 1,
                "fx_delay_amt": 35,
                "fx_pan_freq": 1,
                "fx_pan_amt": 255,
                "lfo_osc1_freq": 0,
                "lfo_fx_freq": 0,
                "lfo_freq": 3,
                "lfo_amt": 0,
                "lfo_waveform": 1
            },
            engineSound5: {
                "osc1_oct": 7,
                "osc1_det": 0,
                "osc1_detune": 0,
                "osc1_xenv": 1,
                "osc1_vol": 192,
                "osc1_waveform": 0,
                "osc2_oct": 7,
                "osc2_det": 0,
                "osc2_detune": 39,
                "osc2_xenv": 1,
                "osc2_vol": 192,
                "osc2_waveform": 0,
                "noise_fader": 0,
                "env_attack": 193767,
                "env_sustain": 118467,
                "env_release": 200000,
                "env_master": 192,
                "fx_filter": 4,
                "fx_freq": 2962,
                "fx_resonance": 143,
                "fx_delay_time": 1,
                "fx_delay_amt": 35,
                "fx_pan_freq": 1,
                "fx_pan_amt": 255,
                "lfo_osc1_freq": 0,
                "lfo_fx_freq": 0,
                "lfo_freq": 3,
                "lfo_amt": 0,
                "lfo_waveform": 1
            }

        },

        song: {
            "songLen": 36,
            "songData": [
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 234,
                    "osc1_waveform": 1,
                    "osc2_oct": 6,
                    "osc2_det": 0,
                    "osc2_detune": 9,
                    "osc2_xenv": 0,
                    "osc2_vol": 219,
                    "osc2_waveform": 1,
                    "noise_fader": 0,
                    "env_attack": 137,
                    "env_sustain": 2000,
                    "env_release": 4611,
                    "env_master": 255,
                    "fx_filter": 4,
                    "fx_freq": 982,
                    "fx_resonance": 89,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 25,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 77,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 4,
                    "lfo_amt": 152,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        2,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                123,
                                0,
                                123,
                                0,
                                126,
                                0,
                                126,
                                0,
                                128,
                                0,
                                128,
                                0,
                                0,
                                0,
                                0,
                                0,
                                123,
                                0,
                                123,
                                0,
                                126,
                                0,
                                126,
                                0,
                                128,
                                0,
                                128,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                125,
                                0,
                                125,
                                0,
                                128,
                                0,
                                128,
                                0,
                                130,
                                0,
                                130,
                                0,
                                0,
                                0,
                                0,
                                0,
                                125,
                                0,
                                125,
                                0,
                                128,
                                0,
                                128,
                                0,
                                130,
                                0,
                                130,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 255,
                    "osc1_waveform": 2,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 9,
                    "osc2_xenv": 0,
                    "osc2_vol": 154,
                    "osc2_waveform": 1,
                    "noise_fader": 0,
                    "env_attack": 197,
                    "env_sustain": 2193,
                    "env_release": 351,
                    "env_master": 184,
                    "fx_filter": 0,
                    "fx_freq": 11025,
                    "fx_resonance": 255,
                    "fx_delay_time": 4,
                    "fx_delay_amt": 108,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 56,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 0,
                    "lfo_amt": 0,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0,
                                140,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                150,
                                0,
                                0,
                                0,
                                152,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                137,
                                0,
                                0,
                                0,
                                140,
                                0,
                                0,
                                0,
                                142,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                149,
                                0,
                                0,
                                0,
                                152,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 1,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 11,
                    "osc2_xenv": 0,
                    "osc2_vol": 192,
                    "osc2_waveform": 3,
                    "noise_fader": 29,
                    "env_attack": 88,
                    "env_sustain": 548,
                    "env_release": 1584,
                    "env_master": 228,
                    "fx_filter": 0,
                    "fx_freq": 11025,
                    "fx_resonance": 255,
                    "fx_delay_time": 4,
                    "fx_delay_amt": 134,
                    "fx_pan_freq": 7,
                    "fx_pan_amt": 156,
                    "lfo_osc1_freq": 1,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 0,
                    "lfo_amt": 0,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        2,
                        1,
                        2,
                        3,
                        2,
                        1,
                        3,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                123,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                154,
                                0,
                                159,
                                0,
                                166,
                                0,
                                171,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                171,
                                0,
                                166,
                                0,
                                159,
                                0,
                                154,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                125,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                149,
                                0,
                                156,
                                0,
                                161,
                                0,
                                168,
                                0,
                                173,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 113,
                    "osc1_waveform": 3,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 0,
                    "osc2_waveform": 0,
                    "noise_fader": 247,
                    "env_attack": 41496,
                    "env_sustain": 26863,
                    "env_release": 91231,
                    "env_master": 138,
                    "fx_filter": 3,
                    "fx_freq": 7640,
                    "fx_resonance": 188,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 124,
                    "fx_pan_freq": 2,
                    "fx_pan_amt": 115,
                    "lfo_osc1_freq": 1,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 5,
                    "lfo_amt": 232,
                    "lfo_waveform": 2,
                    "p": [
                        0,
                        1,
                        0,
                        1,
                        0,
                        1,
                        0,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 1,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 9,
                    "osc2_xenv": 0,
                    "osc2_vol": 192,
                    "osc2_waveform": 1,
                    "noise_fader": 0,
                    "env_attack": 49,
                    "env_sustain": 3426,
                    "env_release": 49,
                    "env_master": 192,
                    "fx_filter": 1,
                    "fx_freq": 982,
                    "fx_resonance": 140,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 25,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 77,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 3,
                    "lfo_amt": 69,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        1,
                        1,
                        2,
                        1,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                123,
                                123,
                                135,
                                135,
                                126,
                                126,
                                138,
                                138,
                                128,
                                128,
                                140,
                                140,
                                133,
                                133,
                                145,
                                145,
                                123,
                                123,
                                135,
                                135,
                                126,
                                126,
                                138,
                                138,
                                128,
                                128,
                                140,
                                140,
                                130,
                                130,
                                142,
                                142
                            ]
                        },
                        {
                            "n": [
                                125,
                                125,
                                137,
                                137,
                                128,
                                128,
                                140,
                                140,
                                130,
                                130,
                                142,
                                142,
                                135,
                                135,
                                147,
                                147,
                                125,
                                125,
                                137,
                                137,
                                128,
                                128,
                                140,
                                140,
                                130,
                                130,
                                142,
                                142,
                                132,
                                132,
                                144,
                                144
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 5,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 1,
                    "osc1_vol": 214,
                    "osc1_waveform": 0,
                    "osc2_oct": 5,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 1,
                    "osc2_vol": 204,
                    "osc2_waveform": 0,
                    "noise_fader": 229,
                    "env_attack": 50,
                    "env_sustain": 6363,
                    "env_release": 1818,
                    "env_master": 158,
                    "fx_filter": 3,
                    "fx_freq": 7924,
                    "fx_resonance": 240,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 74,
                    "fx_pan_freq": 4,
                    "fx_pan_amt": 232,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 6,
                    "lfo_amt": 231,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                147,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 3,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 4,
                    "osc2_xenv": 0,
                    "osc2_vol": 192,
                    "osc2_waveform": 3,
                    "noise_fader": 0,
                    "env_attack": 36863,
                    "env_sustain": 35969,
                    "env_release": 8772,
                    "env_master": 192,
                    "fx_filter": 1,
                    "fx_freq": 3022,
                    "fx_resonance": 255,
                    "fx_delay_time": 4,
                    "fx_delay_amt": 140,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 162,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 8,
                    "lfo_amt": 255,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        2,
                        3
                    ],
                    "c": [
                        {
                            "n": [
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                149,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                156,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                168,
                                0,
                                161,
                                0,
                                152,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                171,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ],
            "rowLen": 4410,
            "endPattern": 11
        },

        titlesong: {
            "songLen": 37,
            "songData": [
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 3,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 7,
                    "osc2_xenv": 0,
                    "osc2_vol": 201,
                    "osc2_waveform": 3,
                    "noise_fader": 0,
                    "env_attack": 789,
                    "env_sustain": 1234,
                    "env_release": 13636,
                    "env_master": 191,
                    "fx_filter": 2,
                    "fx_freq": 5839,
                    "fx_resonance": 254,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 121,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 147,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 6,
                    "lfo_amt": 195,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        2,
                        0,
                        0,
                        1,
                        2,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                157,
                                0,
                                0,
                                0,
                                156,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                157,
                                0,
                                0,
                                0,
                                159,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 255,
                    "osc1_waveform": 2,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 18,
                    "osc2_xenv": 1,
                    "osc2_vol": 191,
                    "osc2_waveform": 2,
                    "noise_fader": 0,
                    "env_attack": 3997,
                    "env_sustain": 56363,
                    "env_release": 100000,
                    "env_master": 255,
                    "fx_filter": 2,
                    "fx_freq": 392,
                    "fx_resonance": 255,
                    "fx_delay_time": 8,
                    "fx_delay_amt": 69,
                    "fx_pan_freq": 5,
                    "fx_pan_amt": 67,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 4,
                    "lfo_amt": 57,
                    "lfo_waveform": 3,
                    "p": [
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                130,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                123,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 8,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 0,
                    "osc1_waveform": 0,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 0,
                    "osc2_waveform": 0,
                    "noise_fader": 60,
                    "env_attack": 50,
                    "env_sustain": 419,
                    "env_release": 4607,
                    "env_master": 130,
                    "fx_filter": 1,
                    "fx_freq": 10332,
                    "fx_resonance": 120,
                    "fx_delay_time": 4,
                    "fx_delay_amt": 16,
                    "fx_pan_freq": 5,
                    "fx_pan_amt": 108,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 5,
                    "lfo_amt": 187,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                147,
                                147,
                                0,
                                0,
                                147,
                                0,
                                0,
                                147,
                                0,
                                147,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                147,
                                147,
                                0,
                                0,
                                147,
                                0,
                                0,
                                147,
                                0,
                                147
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 1,
                    "osc1_vol": 255,
                    "osc1_waveform": 0,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 1,
                    "osc2_vol": 255,
                    "osc2_waveform": 0,
                    "noise_fader": 0,
                    "env_attack": 50,
                    "env_sustain": 150,
                    "env_release": 4800,
                    "env_master": 200,
                    "fx_filter": 2,
                    "fx_freq": 600,
                    "fx_resonance": 254,
                    "fx_delay_time": 0,
                    "fx_delay_amt": 0,
                    "fx_pan_freq": 0,
                    "fx_pan_amt": 0,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 0,
                    "lfo_amt": 0,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 255,
                    "osc1_waveform": 2,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 9,
                    "osc2_xenv": 0,
                    "osc2_vol": 154,
                    "osc2_waveform": 2,
                    "noise_fader": 0,
                    "env_attack": 2418,
                    "env_sustain": 1075,
                    "env_release": 10614,
                    "env_master": 240,
                    "fx_filter": 3,
                    "fx_freq": 2962,
                    "fx_resonance": 255,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 117,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 73,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 5,
                    "lfo_amt": 124,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        1,
                        2,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                157,
                                0,
                                0,
                                0,
                                156,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                154,
                                0,
                                154,
                                0,
                                152,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                154,
                                0,
                                147,
                                0,
                                152,
                                0,
                                157,
                                0,
                                0,
                                0,
                                159,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 1,
                    "osc2_oct": 6,
                    "osc2_det": 0,
                    "osc2_detune": 9,
                    "osc2_xenv": 0,
                    "osc2_vol": 192,
                    "osc2_waveform": 1,
                    "noise_fader": 0,
                    "env_attack": 137,
                    "env_sustain": 2000,
                    "env_release": 4611,
                    "env_master": 192,
                    "fx_filter": 1,
                    "fx_freq": 982,
                    "fx_resonance": 89,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 25,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 77,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 3,
                    "lfo_amt": 69,
                    "lfo_waveform": 0,
                    "p": [
                        1,
                        2,
                        1,
                        3,
                        1,
                        3
                    ],
                    "c": [
                        {
                            "n": [
                                130,
                                0,
                                130,
                                0,
                                142,
                                0,
                                130,
                                130,
                                0,
                                142,
                                130,
                                0,
                                142,
                                0,
                                130,
                                0,
                                130,
                                0,
                                130,
                                0,
                                142,
                                0,
                                130,
                                130,
                                0,
                                142,
                                130,
                                0,
                                142,
                                0,
                                130,
                                0
                            ]
                        },
                        {
                            "n": [
                                123,
                                0,
                                123,
                                0,
                                135,
                                0,
                                123,
                                123,
                                0,
                                135,
                                123,
                                0,
                                135,
                                0,
                                123,
                                0,
                                123,
                                0,
                                123,
                                0,
                                135,
                                0,
                                123,
                                123,
                                0,
                                135,
                                123,
                                0,
                                135,
                                0,
                                123,
                                0
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                135,
                                0,
                                147,
                                0,
                                135,
                                135,
                                0,
                                147,
                                135,
                                0,
                                147,
                                0,
                                135,
                                0,
                                135,
                                0,
                                135,
                                0,
                                147,
                                0,
                                135,
                                135,
                                0,
                                147,
                                135,
                                0,
                                147,
                                0,
                                135,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 255,
                    "osc1_waveform": 3,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 255,
                    "osc2_waveform": 0,
                    "noise_fader": 127,
                    "env_attack": 22,
                    "env_sustain": 88,
                    "env_release": 3997,
                    "env_master": 255,
                    "fx_filter": 3,
                    "fx_freq": 4067,
                    "fx_resonance": 234,
                    "fx_delay_time": 4,
                    "fx_delay_amt": 33,
                    "fx_pan_freq": 2,
                    "fx_pan_amt": 84,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 3,
                    "lfo_amt": 28,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        1,
                        2,
                        1,
                        2,
                        1,
                        3
                    ],
                    "c": [
                        {
                            "n": [
                                0,
                                0,
                                142,
                                0,
                                154,
                                0,
                                0,
                                0,
                                142,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                0,
                                0,
                                142,
                                0,
                                154,
                                0,
                                0,
                                0,
                                142,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                0,
                                0,
                                147,
                                0,
                                154,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                154,
                                0,
                                147,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                154,
                                0
                            ]
                        },
                        {
                            "n": [
                                0,
                                0,
                                147,
                                0,
                                154,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                154,
                                0,
                                0,
                                0,
                                0,
                                0,
                                147,
                                0,
                                154,
                                0,
                                0,
                                0,
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 8,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 0,
                    "osc1_waveform": 0,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 0,
                    "osc2_waveform": 0,
                    "noise_fader": 255,
                    "env_attack": 140347,
                    "env_sustain": 9216,
                    "env_release": 133417,
                    "env_master": 208,
                    "fx_filter": 2,
                    "fx_freq": 2500,
                    "fx_resonance": 16,
                    "fx_delay_time": 2,
                    "fx_delay_amt": 157,
                    "fx_pan_freq": 8,
                    "fx_pan_amt": 207,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 2,
                    "lfo_amt": 51,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                147,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ],
            "rowLen": 5513,
            "endPattern": 9
        },

        letters: {
            '.' : [
                [,,,,0],
                [,,,,0],
                [,,,,0],
                [,,,,0],
                [,,1,,0]

            ],
            '1': [
                [,1,1,,0],
                [,,1,,0],
                [,,1,,0],
                [,,1,,0],
                [1,1,1,1,1]

            ],
            '2': [
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [, 1, 1, 1, 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            '3': [
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, 1, 0]
            ],
            '4': [
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1],
                [, , , 1, 0],
                [, , , 1, 0]
            ],
            '5': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [1, 1, 1, 1, 0]
            ],
            '6': [
                [, 1, 1, 1, 0],
                [1, , , , 0],
                [1, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '7': [
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            '8': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '9': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 1],
                [, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '0': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            'A': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'B': [
                [1, 1, 1, 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'C': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'D': [
                [1, 1, 1, , 0],
                [1, , , 1, 0],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'E': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'F': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, , 0],
                [1, , , , 0],
                [1, , , , 0]
            ],
            'G': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'H': [
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'I': [
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0],
                [1, 1, 1, 1, 1]
            ],
            'J': [
                [, , , , 1],
                [, , , , 1],
                [, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'K': [
                [1, , , 1, 0],
                [1, , 1, , 0],
                [1, 1, 1, , 0],
                [1, , , 1, 0],
                [1, , , , 1]
            ],
            'L': [
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'M': [
                [1, , , , 1],
                [1, 1, , 1, 1],
                [1, , 1, , 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'N': [
                [1, , , , 1],
                [1, 1, , , 1],
                [1, , 1, , 1],
                [1, , , 1, 1],
                [1, , , , 1]
            ],
            'O': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'P': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , , , 0]
            ],
            'Q': [
                [1, 1, 1, 1, 0],
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1]
            ],
            'R': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , 1, 0],
                [1, , , , 1]
            ],
            'S': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'T': [
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            'U': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'V': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [, 1, , 1, 0],
                [, , 1, , 0]
            ],
            'W': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , 1, , 1],
                [1, 1, , 1, 1],
                [1, , , , 1]
            ],
            'X': [
                [1, , , , 1],
                [, 1, , 1, 0],
                [, , 1, , 0],
                [, 1, , 1, 0],
                [1, , , , 1]
            ],
            'Y': [
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            'Z': [
                [1, 1, 1, 1, 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, 1, , , 0],
                [1, 1, 1, 1, 1]
            ],
            ' ': [
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , , , 0]
            ],
            ',': [
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            '+': [
                [, , , , 0],
                [, , 1, , 0],
                [, 1, 1, 1, 0],
                [, , 1, , 0],
                [, , , , 0]
            ],
            '/': [
                [, , , , 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, 1, , , 0],
                [1, , , , 0]
            ],
            ':': [
                [, , , , 0],
                [, , 1, , 0],
                [, , , , 0],
                [, , 1, , 0],
                [, , , , 0]
            ],
            '@': [
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, , 1],
                [1, , 1, , 1],
                [1, 1, 1, 1, 1]
            ],
            'x': [ //solid first checkers
                [1, , 1, , 1],
                [, 1, , 1, 0],
                [1, , 1, , 1],
                [, 1, , 1, 0],
                [1, , 1, , 1]
            ],
            'z': [
                //empty first checkers
                [, 1, , 1, 0],
                [1, , 1, , 1],
                [, 1, , 1, 0],
                [1, , 1, , 1],
                [, 1, , 1, 0]
            ],
            'o': [
                //box with dot
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , 1, , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'e': [
                //down-right slope
                [1,,,,0],
                [1,1,,,0],
                [1,1,1,,0],
                [1,1,1,1,0],
                [1,1,1,1,1],

            ],
            'w': [
                //down-left slope
                [,,,,1],
                [,,,1,1],
                [,,1,1,1],
                [,1,1,1,1],
                [1,1,1,1,1],

            ],
            's': [
                //up-left slope
                [1, 1, 1, 1, 1],
                [, 1, 1, 1, 1],
                [, , 1, 1, 1],
                [, , , 1, 1],
                [, , , , 1]
            ],
            'd': [
                //up-right slope
                [1,1,1,1,1],
                [1,1,1,1,0],
                [1,1,1,,0],
                [1,1,,,0],
                [1,,,,0]

            ]

        }

    };
/*global GAME*/
//todo: factor in global glitch variables
//todo: modify glitch render to glitch both directions on both axes
	Txt = {
		textLine: function (opt) {
			if (!opt.glitchFactor) opt.glitchFactor = 0;
			if (!opt.glitchChance) opt.glitchChance = 0;

			var textLength = opt.text.length,
				size = 5;
			for (var i = 0; i < textLength; i++) {
				var letter = Assets.letters[( opt.text.charAt(i) )] || Assets.letters['unknown'];
				for (var y = 0; y < size; y++) {
					//var g = (Math.random() > opt.glitchChance) * opt.glitchFactor;
					for (var x = 0; x < size; x++) {
						if (letter[y][x] === 1) {
							var gl = (Math.random() > opt.glitchChance) * opt.glitchFactor;
							//if(g)
							opt.ctx.fillRect(opt.x + ( x * opt.scale ) + gl + ( ( size * opt.scale ) + opt.hspacing ) * i, opt.y + y * opt.scale + gl, opt.scale, opt.scale);
						}
					}
				}
			}
		},


		text: function (opt) {
			var size = 5,
				letterSize = size * opt.scale,
				lines = opt.text.split('\n'),
				linesCopy = lines.slice(0),
				lineCount = lines.length,
				longestLine = linesCopy.sort(function (a, b) {
					return b.length - a.length;
				})[0],
				textWidth = ( longestLine.length * letterSize ) + ( ( longestLine.length - 1 ) * opt.hspacing ),
				textHeight = ( lineCount * letterSize ) + ( ( lineCount - 1 ) * opt.vspacing );

			var sx = opt.x,
				sy = opt.y,
				ex = opt.x + textWidth,
				ey = opt.y + textHeight;

			if (opt.halign == 'center') {
				sx = opt.x - textWidth / 2;
				ex = opt.x + textWidth / 2;
			} else if (opt.halign == 'right') {
				sx = opt.x - textWidth;
				ex = opt.x;
			}

			if (opt.valign == 'center') {
				sy = opt.y - textHeight / 2;
				ey = opt.y + textHeight / 2;
			} else if (opt.valign == 'bottom') {
				sy = opt.y - textHeight;
				ey = opt.y;
			}

			var cx = sx + textWidth / 2,
				cy = sy + textHeight / 2;

			if (opt.render) {
				for (var i = 0; i < lineCount; i++) {
					var line = lines[i],
						lineWidth = ( line.length * letterSize ) + ( ( line.length - 1 ) * opt.hspacing ),
						x = opt.x,
						y = opt.y + ( letterSize + opt.vspacing ) * i;

					if (opt.halign == 'center') {
						x = opt.x - lineWidth / 2;
					} else if (opt.halign == 'right') {
						x = opt.x - lineWidth;
					}

					if (opt.valign == 'center') {
						y = y - textHeight / 2;
					} else if (opt.valign == 'bottom') {
						y = y - textHeight;
					}

					if (opt.snap) {
						x = Math.floor(x);
						y = Math.floor(y);
					}

					this.textLine({
						ctx: opt.ctx,
						x: x,
						y: y,
						text: line,
						hspacing: opt.hspacing || 0,
						scale: opt.scale || 1,
						glitchChance: opt.glitchChance,
						glitchFactor: opt.glitchFactor
					});
				}
			}

			return {
				sx: sx,
				sy: sy,
				cx: cx,
				cy: cy,
				ex: ex,
				ey: ey,
				width: textWidth,
				height: textHeight
			}
		}
	};

/*global
* Const*/




    Entity = function(opt){
        var that = this;



        if(!opt){
            opt = {
                radius: 10,
                gravity: 0,
                type: 'generic',
                frictX: 0.92,
                frictY: 0.94

            }
        }
        that.type = opt.type;
        that.cx = 0;
        that.cy = 0;
        that.xr = 0;
        that.yr = 0;

        that.xx = 0;
        that.yy = 0;

        that.dx = 0;
        that.dy = 0;

        that.collided = false;
        that.ox = 0; //previous frame x
        that.oy = 0; //previous frame y -

        that.radius = opt.radius || 10;
        that.gravity = opt.gravity || 0;

        that.frictX = opt.frictX || 0.92;
        that.frictY = opt.frictY || 0.94;
        that.dead = false;
        that.collides = opt.collides || 0;
        that.mapcollide = opt.mapcollide || 0;

        that.id = Math.random();

    };


    Entity.prototype.die = function() {
        var that = this;

        that.dead = true;
        ALL.splice(ALL.indexOf(that), 1);
    }

    Entity.prototype.setCoords = function(x,y) {
        var that = this;

        that.xx = x;
        that.yy = y;
        that.cx = Math.floor(that.xx/Const.GRID);
        that.cy = Math.floor(that.yy/Const.GRID);
        that.xr = (that.xx - that.cx*Const.GRID) / Const.GRID;
        that.yr = (that.yy - that.cy*Const.GRID) / Const.GRID;
    };

    Entity.prototype.hasCollision = function(cx, cy) {
        var that = this;

        if(that.mapcollide){
            //if( (that.cx<1 && that.xr < .5) || cx >= Const.WIDTH)
            //    return true;
            //else if(that.cy<1 && that.yr < .5 || cy>=Const.HEIGHT ){
            //    return true;
            //}
            if( (Assets.map[cy]) == undefined  || Assets.map[cy][cx] == undefined ) {
                return false;
            }
            else return Assets.map[cy][cx] || false; //eventually return map coordinates.
        }

    };

    Entity.prototype.overlaps = function(e) { //e is another Entity
        var that = this;

        var maxDist = that.radius + e.radius;
        var distSqr = (e.xx - that.xx)*(e.xx-that.xx) + (e.yy - that.yy)*(e.yy-that.yy);
        if(distSqr <= maxDist*maxDist )
            return true;
        else
            return false;
    };

    Entity.prototype.onGround = function() {
        var that = this;

        return that.hasCollision(that.cx, that.cy+1) && that.yr>=0.5;
    };

    Entity.prototype.onCeiling = function() {
        var that = this;

        return that.hasCollision(that.cx, that.cy-1) && that.yr<=0.5;
    };

    Entity.prototype.onWallLeft = function() {
        var that = this;

        return that.hasCollision(that.cx-1, that.cy) && that.xr<=0.5;
    }
    Entity.prototype.onWallRight = function() {
        var that = this;

        return that.hasCollision(that.cx+1, that.cy) && that.xr>=0.5;
    }

    Entity.prototype.update = function() {
        var that = this;


        //console.log(that.type);

        if(that.dead == false){


            var gravity = that.gravity;

            //map collison

            //X component
            that.xr += that.dx;
            that.dx *= that.frictX;
            if( that.hasCollision(that.cx-1, that.cy) && that.xr <= 0.3 ) { // if there's something to the left AND we're near the left edge of the current cell
                that.dx = 0;
                that.xr = 0.3;
            }
            if( that.hasCollision(that.cx+1, that.cy) && that.xr >= 0.7 ) { // ditto right
                that.dx = 0;
                that.xr = 0.7;
            }
            while(that.xr < 0) { //update the cell and fractional movement
                that.cx--;
                that.xr++;
            }
            while(that.xr > 1) { //update the cell and fractional movement
                that.cx++;
                that.xr--;
            }

            //Y component
            that.dy += gravity;
            that.yr += that.dy;
            that.dy *= that.frictY;

            if( that.hasCollision(that.cx, that.cy-1) && that.yr <= 0.4 ) { // if there's something above...
                that.dy = 0;
                that.yr = 0.4;
            }
            if( that.hasCollision(that.cx, that.cy+1) && that.yr >= 0.7 ) { // ditto below
                that.dy = 0;
                that.yr = 0.7;
            }
            while(that.yr < 0) { //update the cell and fractional movement up
                that.cy--;
                that.yr++;
            }
            while(that.yr > 1) { //update the cell and fractional movement down
                that.cy++;
                that.yr--;
            }

            //object collision handling--------------------

            for(var i = 0; i < ALL.length; i++) {
                //console.log('in collision check loop');
                var e = ALL[i].body;
                if(e.dead == false){
                    if(e.collides){
                        //broad phase collision detection
                        if(e != that && Math.abs(that.cx-e.cx) <= 1 && Math.abs(that.cy-e.cy) <= 1 ){

                            //if the cells are close enough, then we break out the actual distance check
                            var dist = Math.sqrt( (e.xx-that.xx) * (e.xx-that.xx) + (e.yy-that.yy)*(e.yy-that.yy) );
                            if(dist <= that.radius + e.radius) {
                                //console.log('collision resolution!')
                                that.collided = true;
                                var ang = Math.atan2(e.yy-that.yy, e.xx-that.xx);
                                var force = 0.03;
                                var repelPower = (that.radius + e.radius - dist) / (that.radius + e.radius);
                                that.dx -= Math.cos(ang) * repelPower * force;
                                that.dy -= Math.sin(ang) * repelPower * force;
                                e.dx += Math.cos(ang) * repelPower * force;
                                e.dy += Math.sin(ang) * repelPower * force;
                            }

                        }
                    }

                }

            }
            //----------------------------------------------

            //update actual pixel coordinates:

            that.xx = Math.floor((that.cx + that.xr)*Const.GRID);
            that.yy = Math.floor((that.cy + that.yr)*Const.GRID);
            that.ddx = (that.cx + that.xr)* Const.GRID - that.ox;
            that.ddy = (that.cy + that.yr)* Const.GRID - that.oy;
            that.ox = (that.cx + that.xr)* Const.GRID;
            that.oy = (that.cy + that.yr)* Const.GRID;


        }


    };

//---------SONANT-X---------
/*
// Sonant-X
//
// Copyright (c) 2014 Nicolas Vanhoren
//
// Sonant-X is a fork of js-sonant by Marcus Geelnard and Jake Taylor. It is
// still published using the same license (zlib license, see below).
//
// Copyright (c) 2011 Marcus Geelnard
// Copyright (c) 2008-2009 Jake Taylor
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
//
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
//
// 3. This notice may not be removed or altered from any source
//    distribution.
*/

var sonantx = {};

var WAVE_SPS = 44100;                    // Samples per second
var WAVE_CHAN = 2;                       // Channels
var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively

var audioCtx = null;

// Oscillators
function osc_sin(value)
{
    return Math.sin(value * 6.283184);
}

function osc_square(value)
{
    if(osc_sin(value) < 0) return -1;
    return 1;
}

function osc_saw(value)
{
    return (value % 1) - 0.5;
}

function osc_tri(value)
{
    var v2 = (value % 1) * 4;
    if(v2 < 2) return v2 - 1;
    return 3 - v2;
}

// Array of oscillator functions
var oscillators =
[
    osc_sin,
    osc_square,
    osc_saw,
    osc_tri
];

function getnotefreq(n)
{
    return 0.00390625 * Math.pow(1.059463094, n - 128);
}

function genBuffer(waveSize, callBack) {
    setTimeout(function() {
        // Create the channel work buffer
        var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
        var b = buf.length - 2;
        var iterate = function() {
            var begin = new Date();
            var count = 0;
            while(b >= 0)
            {
                buf[b] = 0;
                buf[b + 1] = 128;
                b -= 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
                    setTimeout(iterate, 0);
                    return;
                }
            }
            setTimeout(function() {callBack(buf);}, 0);
        };
        setTimeout(iterate, 0);
    }, 0);
}

function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
    var p1 = (instr.fx_delay_time * rowLen) >> 1;
    var t1 = instr.fx_delay_amt / 255;

    var n1 = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while(n1 < waveSamples - p1)
        {
            var b1 = 4 * n1;
            var l = 4 * (n1 + p1);

            // Left channel = left + right[-p1] * t1
            var x1 = chnBuf[l] + (chnBuf[l+1] << 8) +
                (chnBuf[b1+2] + (chnBuf[b1+3] << 8) - 32768) * t1;
            chnBuf[l] = x1 & 255;
            chnBuf[l+1] = (x1 >> 8) & 255;

            // Right channel = right + left[-p1] * t1
            x1 = chnBuf[l+2] + (chnBuf[l+3] << 8) +
                (chnBuf[b1] + (chnBuf[b1+1] << 8) - 32768) * t1;
            chnBuf[l+2] = x1 & 255;
            chnBuf[l+3] = (x1 >> 8) & 255;
            ++n1;
            count += 1;
            if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(callBack, 0);
    };
    setTimeout(iterate, 0);
}

sonantx.AudioGenerator = function(mixBuf) {
    this.mixBuf = mixBuf;
    this.waveSize = mixBuf.length / WAVE_CHAN / 2;
};
sonantx.AudioGenerator.prototype.getWave = function() {
    var mixBuf = this.mixBuf;
    var waveSize = this.waveSize;
    // Local variables
    var b, k, x, wave, l1, l2, s, y;

    // Turn critical object properties into local variables (performance)
    var waveBytes = waveSize * WAVE_CHAN * 2;

    // Convert to a WAVE file (in a binary string)
    l1 = waveBytes - 8;
    l2 = l1 - 36;
    wave = String.fromCharCode(82,73,70,70,
                               l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
                               87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
                               68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
                               l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255);
    b = 0;
    while(b < waveBytes)
    {
        // This is a GC & speed trick: don't add one char at a time - batch up
        // larger partial strings
        x = "";
        for (k = 0; k < 256 && b < waveBytes; ++k, b += 2)
        {
            // Note: We amplify and clamp here
            y = 4 * (mixBuf[b] + (mixBuf[b+1] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            x += String.fromCharCode(y & 255, (y >> 8) & 255);
        }
        wave += x;
    }
    return wave;
};
sonantx.AudioGenerator.prototype.getAudio = function() {
    var wave = this.getWave();
    var a = new Audio("data:audio/wav;base64," + btoa(wave));
    a.preload = "none";
    a.load();
    return a;
};
sonantx.AudioGenerator.prototype.getAudioBuffer = function(callBack) {
    if (audioCtx === null)
        audioCtx = new AudioContext();
    var mixBuf = this.mixBuf;
    var waveSize = this.waveSize;

    var waveBytes = waveSize * WAVE_CHAN * 2;
    var buffer = audioCtx.createBuffer(WAVE_CHAN, this.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
    var lchan = buffer.getChannelData(0);
    var rchan = buffer.getChannelData(1);
    var b = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while (b < (waveBytes / 2)) {
            var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            lchan[b] = y / 32768;
            y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            rchan[b] = y / 32768;
            b += 1;
            count += 1;
            if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(function() {callBack(buffer);}, 0);
    };
    setTimeout(iterate, 0);
};

sonantx.SoundGenerator = function(instr, rowLen) {
    this.instr = instr;
    this.rowLen = rowLen || 5605;

    this.osc_lfo = oscillators[instr.lfo_waveform];
    this.osc1 = oscillators[instr.osc1_waveform];
    this.osc2 = oscillators[instr.osc2_waveform];
    this.attack = instr.env_attack;
    this.sustain = instr.env_sustain;
    this.release = instr.env_release;
    this.panFreq = Math.pow(2, instr.fx_pan_freq - 8) / this.rowLen;
    this.lfoFreq = Math.pow(2, instr.lfo_freq - 8) / this.rowLen;
};
sonantx.SoundGenerator.prototype.genSound = function(n, chnBuf, currentpos) {
    var marker = new Date();
    var c1 = 0;
    var c2 = 0;

    // Precalculate frequencues
    var o1t = getnotefreq(n + (this.instr.osc1_oct - 8) * 12 + this.instr.osc1_det) * (1 + 0.0008 * this.instr.osc1_detune);
    var o2t = getnotefreq(n + (this.instr.osc2_oct - 8) * 12 + this.instr.osc2_det) * (1 + 0.0008 * this.instr.osc2_detune);

    // State variable init
    var q = this.instr.fx_resonance / 255;
    var low = 0;
    var band = 0;
    for (var j = this.attack + this.sustain + this.release - 1; j >= 0; --j)
    {
        var k = j + currentpos;

        // LFO
        var lfor = this.osc_lfo(k * this.lfoFreq) * this.instr.lfo_amt / 512 + 0.5;

        // Envelope
        var e = 1;
        if(j < this.attack)
            e = j / this.attack;
        else if(j >= this.attack + this.sustain)
            e -= (j - this.attack - this.sustain) / this.release;

        // Oscillator 1
        var t = o1t;
        if(this.instr.lfo_osc1_freq) t += lfor;
        if(this.instr.osc1_xenv) t *= e * e;
        c1 += t;
        var rsample = this.osc1(c1) * this.instr.osc1_vol;

        // Oscillator 2
        t = o2t;
        if(this.instr.osc2_xenv) t *= e * e;
        c2 += t;
        rsample += this.osc2(c2) * this.instr.osc2_vol;

        // Noise oscillator
        if(this.instr.noise_fader) rsample += (2*Math.random()-1) * this.instr.noise_fader * e;

        rsample *= e / 255;

        // State variable filter
        var f = this.instr.fx_freq;
        if(this.instr.lfo_fx_freq) f *= lfor;
        f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
        low += f * band;
        var high = q * (rsample - band) - low;
        band += f * high;
        switch(this.instr.fx_filter)
        {
            case 1: // Hipass
                rsample = high;
                break;
            case 2: // Lopass
                rsample = low;
                break;
            case 3: // Bandpass
                rsample = band;
                break;
            case 4: // Notch
                rsample = low + high;
                break;
            default:
        }

        // Panning & master volume
        t = osc_sin(k * this.panFreq) * this.instr.fx_pan_amt / 512 + 0.5;
        rsample *= 39 * this.instr.env_master;

        // Add to 16-bit channel buffer
        k = k * 4;
        if (k + 3 < chnBuf.length) {
            var x = chnBuf[k] + (chnBuf[k+1] << 8) + rsample * (1 - t);
            chnBuf[k] = x & 255;
            chnBuf[k+1] = (x >> 8) & 255;
            x = chnBuf[k+2] + (chnBuf[k+3] << 8) + rsample * t;
            chnBuf[k+2] = x & 255;
            chnBuf[k+3] = (x >> 8) & 255;
        }
    }
};
sonantx.SoundGenerator.prototype.getAudioGenerator = function(n, callBack) {
    var bufferSize = (this.attack + this.sustain + this.release - 1) + (32 * this.rowLen);
    var self = this;
    genBuffer(bufferSize, function(buffer) {
        self.genSound(n, buffer, 0);
        applyDelay(buffer, bufferSize, self.instr, self.rowLen, function() {
            callBack(new sonantx.AudioGenerator(buffer));
        });
    });
};
sonantx.SoundGenerator.prototype.createAudio = function(n, callBack) {
    this.getAudioGenerator(n, function(ag) {
        callBack(ag.getAudio());
    });
};
sonantx.SoundGenerator.prototype.createAudioBuffer = function(n, callBack) {
    this.getAudioGenerator(n, function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

sonantx.MusicGenerator = function(song) {
    this.song = song;
    // Wave data configuration
    this.waveSize = WAVE_SPS * song.songLen; // Total song size (in samples)
};
sonantx.MusicGenerator.prototype.generateTrack = function (instr, mixBuf, callBack) {
    var self = this;
    genBuffer(this.waveSize, function(chnBuf) {
        // Preload/precalc some properties/expressions (for improved performance)
        var waveSamples = self.waveSize,
            waveBytes = self.waveSize * WAVE_CHAN * 2,
            rowLen = self.song.rowLen,
            endPattern = self.song.endPattern,
            soundGen = new sonantx.SoundGenerator(instr, rowLen);

        var currentpos = 0;
        var p = 0;
        var row = 0;
        var recordSounds = function() {
            var beginning = new Date();
            while (true) {
                if (row === 32) {
                    row = 0;
                    p += 1;
                    continue;
                }
                if (p === endPattern - 1) {
                    setTimeout(delay, 0);
                    return;
                }
                var cp = instr.p[p];
                if (cp) {
                    var n = instr.c[cp - 1].n[row];
                    if (n) {
                        soundGen.genSound(n, chnBuf, currentpos);
                    }
                }
                currentpos += rowLen;
                row += 1;
                if (new Date() - beginning > MAX_TIME) {
                    setTimeout(recordSounds, 0);
                    return;
                }
            }
        };

        var delay = function() {
            applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
        };

        var b2 = 0;
        var finalize = function() {
            var beginning = new Date();
            var count = 0;
            // Add to mix buffer
            while(b2 < waveBytes)
            {
                var x2 = mixBuf[b2] + (mixBuf[b2+1] << 8) + chnBuf[b2] + (chnBuf[b2+1] << 8) - 32768;
                mixBuf[b2] = x2 & 255;
                mixBuf[b2+1] = (x2 >> 8) & 255;
                b2 += 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                    setTimeout(finalize, 0);
                    return;
                }
            }
            setTimeout(callBack, 0);
        };
        setTimeout(recordSounds, 0);
    });
};
sonantx.MusicGenerator.prototype.getAudioGenerator = function(callBack) {
    var self = this;
    genBuffer(this.waveSize, function(mixBuf) {
        var t = 0;
        var recu = function() {
            if (t < self.song.songData.length) {
                t += 1;
                self.generateTrack(self.song.songData[t - 1], mixBuf, recu);
            } else {
                callBack(new sonantx.AudioGenerator(mixBuf));
            }
        };
        recu();
    });
};
sonantx.MusicGenerator.prototype.createAudio = function(callBack) {
    this.getAudioGenerator(function(ag) {
        callBack(ag.getAudio());
    });
};
sonantx.MusicGenerator.prototype.createAudioBuffer = function(callBack) {
    this.getAudioGenerator(function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

//---------END SONANT-X-----
/**
 * Created by ryan on 8/31/16.
 */

window.onload = init();
}());
