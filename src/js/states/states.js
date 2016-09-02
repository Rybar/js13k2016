//todo: split out into separate modules
//title screen and
(function(g){

    g.states =  {

        boot: {

            onenter: function() {
                if(!GAME.sounds)GAME.initAudio(); //off for now, placeholder song works
                else g.audioCtx = {};
            },

            render: function(){

                g.clear(GAME);
                g.ALL = [];
                g.loadmsg = ['INITIALIZING',
                    'RENDERING SOUNDS...',
                    'CONFIGURATING PIXELS....',
                    'RETICULATING SPLINES...',
                    'MESSAGE 42',
                    'PREPARING ENEMIES...',
                    'ALMOST THERE...',
                    'READY. PRESS A TO CONTINUE'];

                ctx.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
                g.ctxui.fillStyle = "#0f0";
                GAME.Txt.text({
                    ctx: g.ctxui,
                    x: 20,
                    y: 20,
                    text: g.loadmsg[g.sounds.loaded],
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

                if(GAME.Key.isDown(GAME.Key.r)) {
                    if(GAME.fsm.current)GAME.fsm.reset();
                }
                if(GAME.sounds.loaded == GAME.sounds.total && GAME.Key.isDown(GAME.Key.a)) {
                    if(GAME.fsm.current == 'boot') GAME.fsm.ready();
                }

            }

        },

        menu: {

            onenter: function(event, from, to){
                if(event == 'ready'){
                    g.titlesong=g.playSound(g.sounds.titlesong, true);
                }
            },

            onexit: function(event, from, to){
              if(event == 'play') g.titlesong.sound.stop();
            },

            render: function(){

                g.clear(GAME);

                g.ctxbg.fillStyle = "#444";


                ctx.fillStyle = "#fff";
                GAME.Txt.text({
                    ctx: g.ctxui,
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
                if(GAME.Key.isDown(GAME.Key.r)) {
                    if(GAME.fsm.current)GAME.fsm.reset();
                }

                if(GAME.Key.isDown(GAME.Key.s)) {
                    ctx.fillStyle = "#00ff00";
                    if(GAME.fsm.current == 'menu') GAME.fsm.play();
                }


            }

        },

        game: {

            onenter: function(event, from, to){

                switch(event) {

                    case 'play':

                        GAME.player = GAME.Player({
                            x: 100,
                            y: 100
                        });
                        GAME.ALL.push(GAME.player);

                        var enemies = 10;
                        while(enemies--){
                           GAME.enemy = GAME.Enemy({
                                x: Math.floor(Math.random() * 200),
                                y: Math.floor(Math.random() * 200),
                                radius: Math.abs(Math.floor(Math.random() * 2) + 4)
                                 });
                            GAME.ALL.push(GAME.enemy);

                        }

                        GAME.song=GAME.playSound(GAME.sounds.song, true)
                        break;
                }

            },

            onexit: function(event, from, to){
              GAME.titlesong.sound.stop();
            },

            render: function(){

                g.clear(GAME);

                //background-------------------
                g.ctxbg.fillStyle = "#223";
                GAME.Txt.text({
                    ctx: g.ctxbg,
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
                    glitchChance: 0.05 + g.const.GLITCH,
                    glitchFactor: .05 + g.const.GLITCHFACTOR,
                });
                //UI text-----------------------
                GAME.Txt.text({
                    ctx: g.ctxui,
                    x: 10,
                    y: 10,
                    text: "WASD OR ARROWS TO MOVE",
                    hspacing: 2, vspacing: 1, halign: 'top', valign: 'left',
                    scale: 1, snap: 1, render: 1,
                    glitchChance: .4, glitchFactor: .5
                });

                GAME.map.render(g.ctxfg);

                GAME.ALL.forEach(function(element, index, array){
                    element.render(g.ctxfg);
                });



            },

            update: function(step){

                //reset from any state
                if(GAME.Key.isDown(GAME.Key.r)) {
                    if(GAME.fsm.current)GAME.fsm.reset();
                }


               if(GAME.Key.isDown(GAME.Key.f))
               {
                   GAME.const.GLITCH += .01;
               }
                if(GAME.Key.isDown(GAME.Key.p))
               {
                   GAME.const.GLITCHFACTOR += .01;
               }


                //physics update

                GAME.ALL.forEach(function(element, index, array){
                    element.update(step);
                    element.body.update(step);
                });


            }

        },

        gameover: {
            render: function(ctx){

                ctx.clearRect(0,0, GAME.const.GAMEWIDTH, GAME.const.GAMEHEIGHT);

                GAME.Txt.text({
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

                if(GAME.Key.isDown(GAME.Key.r)) {

                    if(GAME.fsm.current)GAME.fsm.reset();

                }
                if(GAME.Key.isDown(GAME.Key.s)){

                    if(GAME.fsm.current == 'gameover')GAME.fsm.play();

                }

            }

        },

    }

    return g;

})(GAME);