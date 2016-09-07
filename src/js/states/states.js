//todo: split out into separate modules
/*global that*/
    var states =  {

        boot: {

            onenter: function() {
                //if(!sounds.jump)initAudio(); //off for now, placeholder song works
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
                    text: loadmsg[7], //loadmsg[sounds.loaded],
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
                if( /*sounds.loaded == sounds.total && */ Key.isDown(Key.a)) {
                    if(fsm.current == 'boot') fsm.ready();
                }

            }

        },

        menu: {

            onenter: function(event, from, to){
                if(event == 'ready'){
                    //titlesong=playSound(sounds.titlesong, true);
                }
            },

            onexit: function(event, from, to){
              //if(event == 'play') titlesong.sound.stop();
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

                particlePool.get({
                    x: Math.random() * 200,
                    y: 200,
                    mapcollide: false,
                    collides: false,
                    gravity: -.05,
                    //dy: -this.body.dy,
                    //dx: //-this.body.dx * 0.5,
                    radius: 10,
                    color: "#0f0",
                    life: 1
                });
                particlePool.use();



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
