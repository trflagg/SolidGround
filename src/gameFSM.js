define(['constants'
        , 'rig']
        , function(constants
                   , Rig) {
    
    var gameFSM = function(game) {
        this.game = game;
    }

    gameFSM.prototype.onplaceRig = function(event, from, to) {
        var placingRig = new Rig(this.game, constants.exile_x, constants.exile_y);
        this.game.add.existing(placingRig);
        this.game._placingRig = placingRig;
    };

    // attach FSM
    StateMachine.create({
        target: gameFSM.prototype

        , events: [
            { name: 'startup',      from: 'none',                   to: 'placeRig'}
            , { name: 'placeRig',     from: ['startup', 'selectDig'
                                           , 'wait'],               to: 'selectDig'}
            , { name: 'selectDig',    from: ['placeRig','wait'],    to: 'wait'}
            , { name: 'wait',         from: 'selectDig',            to: 'selectDig'}
        ]
    });

    return gameFSM;
});