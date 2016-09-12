/**
 * Created by ryan on 9/10/16.
 */
states.gameover = {
    onenter: function(event, from, to){
        gameOverCountdown = 15;

    },

    render: function(ctx){

        ctxui.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);

        ctxui.fillStyle = 'rgba(0,0,0, .75)';
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 0,
            text: "yyyyyy\nyyyyyy\nyyyyyy\nyyyyyy",
            hspacing: 0,
            vspacing: 0,
            halign: 'center',
            valign: 'left',
            scale: 10,
            snap: 1,
            render: 1,
            glitch: {xch: 0, ych: 1, yamt: gameOverCountdown, xamt: 0}
        });

        ctxui.fillStyle = '#f80';
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 65,
            text: "GAME OVER",
            hspacing: 2,
            vspacing: 5,
            halign: 'center',
            valign: 'left',
            scale: 4,
            snap: 1,
            render: 1,
            glitch: {xch: 0, ych: 1, yamt: gameOverCountdown, xamt: 0}

        });

        ctxui.fillStyle = '#fff';
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 100,
            text: "YOU COLLECTED " + score + " GLITCHES.\nS: SHARE YOUR SCORE VIA TWITTER\nX: PLAY AGAIN",
            hspacing: 2,
            vspacing: 5,
            halign: 'center',
            valign: 'left',
            scale: 1,
            snap: 1,
            render: 1,
            glitch: {xch: 0, ych: 1, yamt: gameOverCountdown, xamt: 0}

        });

    },
    update: function(){
        if(gameOverCountdown > 0)gameOverCountdown -= .5;

        //particlePool.use();
        //
        //var p = 2;
        //while(p--){
        //    particlePool.get({
        //        x: Math.random() * Const.GAMEWIDTH,
        //        y: 220,
        //        mapcollide: false,
        //        collides: false,
        //        gravity: -.03,
        //        //dy: -this.body.dy,
        //        //dx: //-this.body.dx * 0.5,
        //        radius: rnd(2,20),
        //        color: "rgba(0,0,0,.5)",
        //        life: 5,
        //        ctx: ctxfg
        //    });
        //
        //}

        //if(Key.isDown(Key.r)) {
        //
        //    if(fsm.current)fsm.reset();
        //
        //}
        if(Key.isDown(Key.x)){

            if(fsm.current == 'gameover')fsm.play();

        }

        if(Key.isDown(Key.s)){
            window.open('https://twitter.com/intent/tweet?text=I%20just%20collected%20' + score +
                '%20glitches%20in%20Super%20Glitch%20Box%20%23js13k%20http%3A%2F%2Fbit.ly%2F2c7P6pm', '_self');
        }

    }

}