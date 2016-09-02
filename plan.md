//todo: finish no-namespace refactor
//todo: add 'first' and 'last' to gruntfile

#js13k 2016

Super Glitch Box

    Super crate box clone with a twist
    
    game begins as crate box clone, crates with weapons, falling enemies, etc.
    appears to be a single-screen game, but as amount of glitch increases camera begins
    to reveal more around the play area, the Enemy Factory. 
    
    amount of glitch will escalate with: ?
        each time an enemy falls into the fire
        each time the player dies
        player discovers the glitch control
        
    post glitch:
        player is forced into pit, camera 'breaks' from single screen mode and follows down
        cave is revealed with more varied (randomly generated) enemies. 
        'glitch spots' will appear sporadically, player can teleport to one by 'glitching'.
        glitch jumping will be necessary to navigate out of cave.
        
        
        
    Glitch visual effects:
        graphical errors (in order of escalation)
           text rendering glitches
           sprite glitches
           instruction glitches (revealing the 'glitch' key)
           full screen bars/channel tearing
           
    Glitch abilities
        glitch jump: teleport to visual glitch holes in the world
        
           
TODO MVP:
  
  super crate box game mechanic
    falling patrolling enemies
    crates
    1 gun type

TODO CODE:

    pubsub event logic
    map - cratebox level
    bullets
    particles
    crates - weapons
