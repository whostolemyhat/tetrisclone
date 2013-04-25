/**
* Mostly nicked from Invent With Python
* http://inventwithpython.com/pygame/
*/

// TODO: move to own file/require etc

/** namespace
* see http://stackoverflow.com/questions/881515/javascript-namespace-declaration
* and http://addyosmani.com/blog/essential-js-namespacing/
*/
(function(tessellate, $, undefined) {
    // var == private
    var S_SHAPE_TEMPLATE = [['.....',
                         '.....',
                         '..00.',
                         '.00..',
                         '.....'],
                        ['.....',
                         '..0..',
                         '..00.',
                         '...0..',
                         '.....']];

    var Z_SHAPE_TEMPLATE = [['.....',
                         '.....',
                         '.00..',
                         '..00.',
                         '.....'],
                        ['.....',
                         '..0..',
                         '.00..',
                         '.0...',
                         '.....']];

    var I_SHAPE_TEMPLATE = [['..0..',
                         '..0..',
                         '..0..',
                         '..0..',
                         '.....'],
                        ['.....',
                         '.....',
                         '0000.',
                         '.....',
                         '.....']];

    var O_SHAPE_TEMPLATE = [['.....',
                         '.....',
                         '.00..',
                         '.00..',
                         '.....']];

    var J_SHAPE_TEMPLATE = [['.....',
                         '.0...',
                         '.000.',
                         '.....',
                         '.....'],
                        ['.....',
                         '..00.',
                         '..0..',
                         '..0..',
                         '.....'],
                        ['.....',
                         '.....',
                         '.000.',
                         '...0.',
                         '.....'],
                        ['.....',
                         '..0..',
                         '..0..',
                         '.00..',
                         '.....']];

    var L_SHAPE_TEMPLATE = [['.....',
                         '...0.',
                         '.000.',
                         '.....',
                         '.....'],
                        ['.....',
                         '..0..',
                         '..0..',
                         '..00.',
                         '.....'],
                        ['.....',
                         '.....',
                         '.000.',
                         '.0...',
                         '.....'],
                        ['.....',
                         '.00..',
                         '..0..',
                         '..0..',
                         '.....']];

    var T_SHAPE_TEMPLATE = [['.....',
                         '..0..',
                         '.000.',
                         '.....',
                         '.....'],
                        ['.....',
                         '..0..',
                         '..00.',
                         '..0..',
                         '.....'],
                        ['.....',
                         '.....',
                         '.000.',
                         '..0..'],
                        ['.....',
                         '..0..',
                         '.00..',
                         '..0..',
                         '.....']];

    // tessellate == public
    tessellate.SHAPES = {
        S: S_SHAPE_TEMPLATE,
        Z: Z_SHAPE_TEMPLATE,
        J: J_SHAPE_TEMPLATE,
        L: L_SHAPE_TEMPLATE,
        T: T_SHAPE_TEMPLATE
    };

})(window.tessellate = window.tessellate || {}, jQuery);

// standard jQuery
$(document).ready(function() {
    $('body').append('hello');
    console.log(tessellate.SHAPES);
});