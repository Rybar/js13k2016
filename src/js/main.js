/*global G */
/*global Stats */
/*global requestAnimationFrame */

(function(){
    G.stats = new Stats();
G.stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
G.stats.domElement.style.position = 'absolute';
G.stats.domElement.style.left = '0px';
G.stats.domElement.style.top = '0px';

    document.body.appendChild( G.stats.domElement );

G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');})();

G.init = function() {
    console.log('initialized');
    G.fps = 60;
    G.step = 1 / G.fps;
    G.dt = 0;
    G.now = G.timestamp();
    G.last = G.timestamp();
    //G.initAudio();
    G.player.init();
    G.frame();
};

G.player = {
    x: 400,
    y: 300,
    angle: 0,

    init: function(){
        this.body = new G.Entity();
        this.body.setCoords(this.x, this.y)
    },

    render: function(ctx) {
        ctx.fillStyle = "rgba(255,0,0,1)";
        G.text( {
            ctx: ctx,
            x: this.x,
            y: this.y,
            text: 'XO\nzx',
            hspacing: -15,
            vspacing: 0,
            halign: 'top',
            valign: 'left',
            scale: 3,
            snap: 1,
            render: 1,
            glitchChance: 0.01,
            glitchFactor: 2
        } );
    },

    update: function(step) {
        G.player.angle += .03;
        if(G.Key.isDown(G.Key.a)){
            this.x -= 5;
        }
        else if(G.Key.isDown(G.Key.d)){
            this.x += 5;
        }

        if(G.Key.isDown(G.Key.w)){
            this.y -= 5;
        }
        else if(G.Key.isDown(G.Key.s)){
            this.y += 5;
        }

        this.body

    }
};

G.loadingScreen = function() {

}

G.frame = function() {
    G.stats.begin();

    //fixed time step loop
    G.now = G.timestamp();
    G.dt = G.dt + Math.min(1, (G.now - G.last) / 1000);
    while (G.dt > G.step) {
        G.dt = G.dt - G.step;
        G.update(G.step);
    }
    G.render(G.ctx, G.dt);
    G.last = G.now;

    G.stats.end();
    requestAnimationFrame(G.frame, G.canvas);
};

G.initAudio = function(){
    G.sounds = {};
    G.sounds.loaded = 0;
    G.sounds.total = 1;
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    G.audioCtx = new AudioContext;

    //G.soundGen = new G.sonantx.SoundGenerator(G.audio.JUMP);
    //G.soundGen.createAudioBuffer(147+24, function(buffer) {
    //    G.sounds.loaded++;
    //    G.sounds.jump = buffer;
    //});
    console.log('rendering music');
    G.song = new sonantx.MusicGenerator(G.assets.song);
    G.song.createAudioBuffer(function(buffer) {
        var source = G.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(G.audioCtx.destination);
        source.start();
    });
};

G.playSound = function(buffer, loop){
     var source = G.audioCtx.createBufferSource();
     var gainNode = G.audioCtx.createGain();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(G.audioCtx.destination);
        source.loop = loop;
        source.start();
        return { volume: gainNode, sound: source};
};

G.timestamp = function() {
    if(window.performance && window.performance.now)
        return window.performance.now();
    else
       return new Date().getTime();
};

G.update = function(step) {
    G.player.update();
};




G.render = function(ctx, dt) {
//screen clear ---
    ctx.fillStyle = "#002200";
    ctx.fillRect(0,0, G.const.VIEW_X, G.const.VIEW_Y);
//----------------
    G.renderArt(ctx);
    G.player.render(ctx);


};

G.renderArt = function(ctx){

    
    ctx.fillStyle = "#FFFFFF";

    G.text( {
        ctx: ctx,
        x: 64,
        y: 64,
        text: 'THIS IS SOME TEXT',
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 1,
        snap: 1,
        render: 1,
        glitchChance: .1,
        glitchFactor: 1
    } );

    ctx.fillStyle = "#008800"
    G.text( {
        ctx: ctx,
        x: 64,
        y: 128,
        text: 'GAME STATE',
        hspacing: 5,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 7,
        snap: 1,
        render: 1,
        glitchChance: 0,
        glitchFactor: 0
    } );

//checkerboards with custom text characters
    ctx.fillStyle = "#888888";
    G.text( {
        ctx: ctx,
        x: 64,
        y: 256,
        text: 'xzxzxz\nzxzxzx\nxzxzxz',
        hspacing: 0,
        vspacing: 0,
        halign: 'top',
        valign: 'left',
        scale: 16,
        snap: 1,
        render: 1,
        glitchChance: 0,
        glitchFactor: 0
    } );

    ctx.fillStyle = "#444466";
    G.text( {
        ctx: ctx,
        x: 64,
        y: 256,
        text: 'zxzxzx\nxzxzxz\nzxzxzx',
        hspacing: 0,
        vspacing: 0,
        halign: 'top',
        valign: 'left',
        scale: 16,
        snap: 1,
        render: 1,
        glitchChance: 0,
        glitchFactor: 0
    } );

}



window.addEventListener('keyup', function(event) {
   G.Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
    G.Key.onKeydown(event);
}, false);


window.onload = G.init;
