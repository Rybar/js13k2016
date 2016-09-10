/**
 * Created by ryan on 9/10/16.
 */
states.gameover = {
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
        if(Key.isDown(Key.x)){

            if(fsm.current == 'gameover')fsm.play();

        }

    }

}
