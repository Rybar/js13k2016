//todo: split out into separate modules
/*global that*/
    var states =  {

        boot: {

            onenter: function() {
                if(!sounds.jump)initAudio(); //off for now, placeholder song works
            },

            render: function(){

                clear(GAME);
                ALL = [];

                var i = Const.WIDTH;

                while(i--){
                    ctxui.fillStyle = "#020";
                    Txt.text({
                        ctx: ctxui,
                        x: i * (Const.GRID+2),
                        y: 70,
                        text: rndTxt('wesdxz', 2) + "\n" + rndTxt('wesdxz', 2) + "\n" + rndTxt('wesdxz', 2),
                        hspacing: 1,
                        vspacing: 1,
                        halign: 'top',
                        valign: 'left',
                        scale: 1,
                        snap: 1,
                        render: 1,
                    });
                }
                var loadmsg = ['INITIALIZING',
                    'RENDERING SOUNDS...',
                    'CONFIGURATING PIXELS....',
                    'RETICULATING SPLINES...',
                    'MESSAGE 42',
                    'PREPARING ENEMIES...',
                    'ALMOST THERE...',
                    'READY. PRESS A TO CONTINUE'];

                ctx.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
                ctxui.fillStyle = sounds.loaded==7 ? "#0f0" : "#080";
                Txt.text({
                    ctx: ctxui,
                    x: 18,
                    y: 79,
                    text: loadmsg[sounds.loaded],
                    hspacing: 1,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'center',
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
                if( /*sounds.loaded == sounds.total && */ Key.isDown(Key.a)) {
                    if(fsm.current == 'boot') fsm.ready();
                }

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
