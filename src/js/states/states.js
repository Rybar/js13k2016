//todo: split out into separate modules
//title screen and
(function(g){

    g.states =  {

        boot: {

            onenter: function() {
                //-if(!GAME.sounds)GAME.initAudio(); //off for now, placeholder song works
            },

            render: function(){

                g.clear(GAME);
                g.ALL = [];

                ctx.clearRect(0,0, g.const.GAMEWIDTH, g.const.GAMEHEIGHT);
                g.ctxui.fillStyle = "#0f0";
                GAME.Txt.text({
                    ctx: g.ctxui,
                    x: 20,
                    y: 20,
                    text: "READY...PRESS A",
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
                if(GAME.Key.isDown(GAME.Key.a)) {
                    if(GAME.fsm.current == 'boot') GAME.fsm.ready();
                }

            }

        },

        menu: {
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

                        var enemies = 50;
                        while(enemies--){
                           GAME.enemy = GAME.Enemy({
                                x: Math.floor(Math.random() * 200),
                                y: Math.floor(Math.random() * 200),
                                radius: (Math.floor(Math.random() * 5)) + 5
                                 });
                            GAME.ALL.push(GAME.enemy);

                        }


                        break;
                }

            },

            render: function(){

                g.clear(GAME);

                g.ctxbg.fillStyle = "#333";
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
                    glitchChance: 0,
                    glitchFactor: 0,
                });

                GAME.Txt.text({
                    ctx: g.ctxui,
                    x: 10,
                    y: 10,
                    text: "WASD OR ARROWS TO MOVE",
                    hspacing: 2, vspacing: 1, halign: 'top', valign: 'left',
                    scale: 1, snap: 1, render: 1,
                    glitchChance: .4, glitchFactor: .5
                });

                GAME.ALL.forEach(function(element, index, array){
                    element.render(g.ctxfg);
                });


            },

            update: function(step){



                //reset from any state
                if(GAME.Key.isDown(GAME.Key.r)) {
                    if(GAME.fsm.current)GAME.fsm.reset();
                }
                //player movement
                if(GAME.Key.isDown(GAME.Key.LEFT) || GAME.Key.isDown(GAME.Key.a))
                {
                    //console.log(GAME.player.body.dx, + " " + GAME.player.body.cx + " " + GAME.player.body.xx);
                    GAME.player.body.dx -= GAME.const.P_SPEED * step;
                }
                else if(GAME.Key.isDown(GAME.Key.RIGHT) || GAME.Key.isDown(GAME.Key.d))
                {
                    //console.log(GAME.player.body.dx, + " " + GAME.player.body.cx + " " + GAME.player.body.xx);
                    GAME.player.body.dx += GAME.const.P_SPEED * step;
                }

                if(GAME.Key.isDown(GAME.Key.UP) || GAME.Key.isDown(GAME.Key.w))
                {
                    GAME.player.body.dy -= GAME.const.P_SPEED * step;
                }
                else if(GAME.Key.isDown(GAME.Key.DOWN) || GAME.Key.isDown(GAME.Key.s))
                {
                    GAME.player.body.dy += GAME.const.P_SPEED * step;
                }
                //console.log('update step');


                //physics update

                GAME.ALL.forEach(function(element, index, array){
                    element.body.update();
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