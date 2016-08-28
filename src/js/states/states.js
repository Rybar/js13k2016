(function(g){

    g.states =  {

        boot: {

            onenter: function() {
                //if(!GAME.sounds)GAME.initAudio();
            },

            render: function(){
                ctx.clearRect(0,0,512,512);
                GAME.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "READY...PRESS A",
                    hspacing: 5,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'left',
                    scale: 2,
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

                ctx.clearRect(0,0,512,512);

                GAME.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "GAMEY GAME\nPRESS S TO CONTINUE",
                    hspacing: 5,
                    vspacing: 1,
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

                        GAME.player = GAME.Player();
                        GAME.ALL.push(GAME.player);

                        GAME.enemy = GAME.Enemy();
                        GAME.ALL.push(GAME.enemy);

                        break;
                }

            },

            render: function(){

                ctx.clearRect(0,0,512,512);

                GAME.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 64,
                    text: "WASD OR ARROWS\nTO MOVE",
                    hspacing: 3, vspacing: 1, halign: 'top', valign: 'left',
                    scale: 2, snap: 1, render: 1,
                    glitchChance: .1, glitchFactor: 3
                });

                GAME.ALL.forEach(function(element, index, array){
                    element.render(ctx);
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
            render: function(){

                ctx.clearRect(0,0,512,512);

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