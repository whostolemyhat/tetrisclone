/**
* Mostly nicked from Invent With Python
* http://inventwithpython.com/pygame/
*/

// TODO: move to own file/require etc

/** 
* namespace
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

    var play;
    var fallingPiece;
    var nextPiece;
    var CANVAS_WIDTH = 170;
    var CANVAS_HEIGHT = 510;
    var TEMPLATE_WIDTH = 5;
    var TILE_WIDTH = 15;
    var TILE_HEIGHT = 15;
    var BORDER_WIDTH = 2;
    var MOVE_DOWN_FREQ = 100;
    var MOVE_SIDEWAYS_FREQ = 150;

    $('<canvas id="canvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>').appendTo('.container');
    var canvas;
    var ctx;

    var board = {
        width: 10,
        height: 30,
        draw: function() {
            for(var x = 0; x < this.width; x++) {
                for(var y = 0; y < this.height; y++) {
                    rect((x * TILE_WIDTH) + (x * BORDER_WIDTH), (y * TILE_HEIGHT) + (y * BORDER_WIDTH), TILE_WIDTH, TILE_HEIGHT, '#2e2');
                }
            }
        },
        pieces: []
    };

    var piece = {
        x: 0,
        y: 0,
        draw: function() {

        }
    };

    tessellate.getPieces = function() {
        return board.pieces;
    }

    tessellate.init = function() {
        canvas = canvas || $('#canvas')[0];
        ctx = ctx || canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        fallingPiece = getNewPiece();
        nextPiece = getNewPiece();

        // debug
        // board.pieces = [];
        // board.pieces.push(getNewPiece());

        var FPS = 25;
        play = setInterval(function() {
            update();
            draw();
        }, 1000 / FPS);

    };

    var draw = function() {
        console.log('drawing');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        board.draw();
        for(var i = 0; i < board.pieces.length; i++) {
            drawPiece(board.pieces[i]);
        }
        drawPiece(fallingPiece);
    };

    var update = function() {

        if(!fallingPiece) {
            fallingPiece = nextPiece;
            nextPiece = getNewPiece();
        }

        fallingPiece.y += 1;

        if(!validMove(board, fallingPiece)) {
            gameOver();
        }
    };

    tessellate.end = function() {
        window.clearTimeout(play);
        console.log('stopped');
    };

    var getNewPiece = function() {
        /** 
        * Returns random shape in random rotation
        */
        var keys = Object.keys(tessellate.SHAPES);
        var shape = keys[Math.floor(keys.length * Math.random())];
        var newPiece = {
            shape: shape,
            rotation: tessellate.SHAPES[shape][Math.floor(tessellate.SHAPES[shape].length * Math.random())],
            x: 0,
            y: 0, // start above board
            colour: 'red'
        };

        return newPiece;
    };
    
    var gameOver = function() {
        console.log('game over');
    }

    var validMove = function(board, fallingPiece) {
        return true;
    }

    var drawPiece = function(piece) {
        console.log(piece);
        var arr = piece.rotation
        for(var y = 0; y < piece.rotation.length; y++) {
            var arr = piece.rotation[y].split('');
            for(var x = 0; x < arr.length; x++) {
                if(arr[x] === '0') {
                    rect(
                        ((x + piece.x) * TILE_WIDTH) + (x * BORDER_WIDTH), 
                        ((y + piece.y) * TILE_HEIGHT) + (y * BORDER_WIDTH), 
                        TILE_WIDTH, 
                        TILE_HEIGHT, 
                        piece.colour
                        );
                }
            }
        }
    }

    // TODO: move to lib
    function rect(x, y, height, width, colour) {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.fill();
        // border
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = '#2e2';
        // ctx.stroke();
        ctx.closePath();
    }

})(window.tessellate = window.tessellate || {}, jQuery);

// standard jQuery
$(document).ready(function() {
    if(Modernizr.canvas) {


        $('#start').click(function() {
            tessellate.init();
            return false;
        });
        $('#stop').click(function() {
            tessellate.end();
            return false;
        });

    } else {
        $('.main').append("Your browser doesn't like fun!");
    }
});
