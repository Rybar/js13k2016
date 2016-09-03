//todo: split out into separate modules
/*global that*/
    states =  {

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

                        //song=playSound(sounds.song, true)
                        break;
                }

            },

            onexit: function(event, from, to){
             // titlesong.sound.stop();
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
