/**
 * Created by ryan on 9/10/16.
 */
states.gameover = {
    onenter: function(event, from, to){

        gameOverCountdown = 15;
        playSound(sounds.gameover, 1, 0, false);

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

        ctxui.fillStyle = '#bbb';
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

        if(Key.isDown(Key.x)){

            if(fsm.current == 'gameover')fsm.play();

        }

        if(Key.isDown(Key.s)){
            window.open('https://twitter.com/intent/tweet?text=text%3DI%20just%20collected%20' + score +
                '%20glitches%20in%20Super%20Glitch%20Box%2C%20A%20%23js13k%20game%20by%20%40ryanmalm%20%20http%3A%2F%2Fbit.ly%2F2c7P6pm', '_self');
        }

    }

}
