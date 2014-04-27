define(['jquery'], function($) {
    var constants = {
        tile_size: 32
        , exile_x: -100
        , exile_y: -100

        , top_pipe: 1
        , right_pipe: 2
        , bottom_pipe: 4
        , left_pipe: 8

        , lightblue_50_score: 50
        , lightblue_25_score: 25
        , magenta_50_score: 50
        , magenta_25_score: 25
    };

    // 33% of screen width, divided by tile_size (drop remainder)
    constants['game_size_x'] = Math.floor($(window).width() / constants.tile_size) - 1;
    constants['game_size_y'] = Math.floor($(window).height() / constants.tile_size);

    constants['dirt_size_x'] = constants['game_size_x'];
    constants['dirt_size_y'] = 50;

    constants['dirt_start'] = Math.floor(constants['game_size_y'] * (0.5));

    constants['score_y'] = 0;

    return constants;
})