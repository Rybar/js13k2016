/*global GAME*/
//todo: find some button render-logic code to steal. //keyboard only game
//todo: bullets!
//todo: particles!
//todo: careful rendering and update refactor before the mess begins


var GAME = {

        init: function(){

            var g = GAME;

            GAME.fsm = StateMachine.create({
                initial: "init",

                events: [
                    {name: 'load', from: 'init', to: 'boot'},
                    {name: 'ready', from: 'boot', to: 'menu' },
                    {name: 'play', from: 'menu', to: 'game' },
                    {name: 'lose', from: 'game', to: 'gameover' },
                    {name: 'reset', from: ['init','boot','menu','gameover','game'], to: 'boot'},
                ],

                callbacks: {
                    onenterboot: function(event, from, to) { GAME.states.boot.onenter(event, from, to) },
                    onentergame: function(event, from, to) { GAME.states.game.onenter(event, from, to) }
                }
            }),

            canvas = document.querySelector('#game');
            ctx = canvas.getContext('2d');
            ctx.fillStyle = "#0F0";
            GAME.ALL= [];
            GAME.fps = 60;
            GAME.step = 1 / GAME.fps;
            GAME.dt = 0;
            GAME.now = GAME.timestamp();
            GAME.last = GAME.timestamp();
            //console.log(g.last);
            GAME.loadProgress = 0;

            //initialize keypress event listeners
            window.addEventListener('keyup', function(event) {
                GAME.Key.onKeyup(event);
            }, false);
            window.addEventListener('keydown', function(event) {
                GAME.Key.onKeydown(event);
               // console.log('key pressed');
            }, false);

            //Fire up the state machine
            GAME.fsm.load();

            //START it up!
            GAME.loop();
        },


        const: {
            GRID: 20,
            WIDTH: 30,
            HEIGHT: 30,
            P_SPEED: .5

        },

        timestamp: function() {
            return new Date().getTime();
        },

        //sound rendering
        initAudio: function(){
            var g = GAME;
        g.sounds = {};
        g.sounds.loaded = 0;
        g.sounds.total = 1;
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        g.audioCtx = new AudioContext;

        //G.soundGen = new G.g.sonantx.SoundGenerator(G.audio.JUMP);
        //G.soundGen.createAudioBuffer(147+24, function(buffer) {
        //    G.sounds.loaded++;
        //    G.sounds.jump = buffer;
        //});
        console.log('rendering music');
        g.song = new sonantx.MusicGenerator(g.Assets.song);
        g.song.createAudioBuffer(function(buffer) {
            var source = g.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(g.audioCtx.destination);
            source.start();
        });

    },

    loop: function() {
        var g = GAME;
        g.now = g.timestamp();

        g.dt = g.dt + Math.min(1, (g.now - g.last) / 1000);
        //console.log(g.dt + ' '+ g.step);
        while (g.dt > g.step) {

            g.dt = g.dt - g.step;
            g.states[g.fsm.current].update(g.step);

        }
        g.states[g.fsm.current].render(g.dt);
        g.last = g.now;

    requestAnimationFrame(GAME.loop);

},

    Player: function() {
        var g = GAME;
        body = new g.Entity({
            radius: 5,
            type: 'player',
            collides: true
        });
        body.setCoords(256,256);

        return {

            cooldown: 0,
            body: body,
            angle: 0,
            update: function(){
                this.angle += .05;
                console.log(this.body.dx)
                body.update();
            },
            render: function(ctx){
                ctx.fillStyle = "#00f"
                ctx.fillRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);
            }
        };
    },

    Enemy: function() {
        var g = GAME;
        body = new g.Entity({
            radius: 5,
            type: 'enemy',
            collides: true
        });
        body.setCoords(150,150);
        return {
            color: '#f00',
            body: body,
            update: function(){
                console.log('enemy update');
                body.update();
            },
            render: function(ctx){
                ctx.fillStyle = "#f00"
                ctx.fillRect(
                    this.body.xx-g.enemy.body.radius,
                    this.body.yy-g.enemy.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);

            }
        };


    },

};








