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
    var shapes = [
        [[0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0]],

        [[0, 0, 0, 0],
         [0, 1, 1, 0],
         [0, 1, 1, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [0, 1, 0, 0],
         [1, 1, 1, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [0, 0, 1, 0],
         [0, 0, 1, 0],
         [0, 1, 1, 0]],

        [[0, 0, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 1, 0]],

        [[0, 0, 0, 0],
         [0, 0, 1, 0],
         [0, 1, 1, 0],
         [0, 1, 0, 0]],

        [[0, 0, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 1, 0],
         [0, 0, 1, 0]]
    ];

    function Shape(S) {

        S = S || {};

        S.rotate = function() {
            console.log('rotating');

            var rotatedShape = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            
            var shapeLength = 4;
            // http://charlesleifer.com/blog/even-more-canvas-fun-tetris-in-javascript/
            for(var y = 0; y < shapeLength; y++) {
                for(var x = 0; x < shapeLength; x++) {
                    rotatedShape[x][y] = S.shape[shapeLength - y - 1][x];
                }
            }
            S.shape = rotatedShape;
        };

        S.leftEdge = function() {};
        S.rightEdge = function() {};
        S.bottomEdge = function() {};
        S.init = function() {
            var rotation = Math.floor(Math.random() * 4);
            var randShape = Math.floor(Math.random() * shapes.length);
            S.shape = shapes[randShape];
            for(var i = 0; i < rotation; i++) {
                S.rotate();
            }
        };
        S.clone = function() {};
        S.draw = function() {
            for(var y = 0; y < S.shape.length; y++) {
                var row = S.shape[y];
                for(var x = 0; x < row.length; x++) {
                    drawBlock(x, y, row[x]);
                }
            }
        };

        return S;
    }

    var Board = {
        colour: '#ccc',
        x: 0,
        y: 0,
        height: 20,
        width: 12,

        board: [],

        init: function() {
            for(var y = 0; y < this.height; y++) {
                var row = [];
                for(var x = 0; x < this.width; x++) {
                    row.push(0);
                }
                this.board.push(row);
            }
        },

        update: function() {},
        draw: function() {
            // rect(this.x, this.y, this.width, this.height, this.colour);
            // iterate through board
            for(var y = 0; y < this.board.length; y++) {
                var row = this.board[y];
                for(var x = 0; x < row.length; x++) {
                    drawBlock(x, y, row[x]);    
                }
            }
        }
    }


    function drawBlock(x, y, blockType) {
        var colour;
        switch(blockType) {
            case 0:
                colour = Board.colour;
                break;
            default:
                colour = 'red';
                break;
        }

        x = x * TILE_SIZE;
        y = y * TILE_SIZE;
        rect(x, y, TILE_SIZE, TILE_SIZE, colour);
    }

    var play;
    var fallingPiece;
    var nextPiece;
    var CANVAS_WIDTH;
    var CANVAS_HEIGHT;
    var TILE_SIZE = 20;
    // var TILE_HEIGHT = 15;
    // var BORDER_WIDTH = 2;
    // var MOVE_DOWN_FREQ = 100;
    // var MOVE_SIDEWAYS_FREQ = 150;

    // $('<canvas id="canvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>').appendTo('.container');
    var canvas;
    var ctx;

    // var board = {
    //     width: 10,
    //     height: 30,
    //     draw: function() {
    //         for(var x = 0; x < this.width; x++) {
    //             for(var y = 0; y < this.height; y++) {
    //                 rect((x * TILE_WIDTH) + (x * BORDER_WIDTH), (y * TILE_HEIGHT) + (y * BORDER_WIDTH), TILE_WIDTH, TILE_HEIGHT, '#2e2');
    //             }
    //         }
    //     },
    //     pieces: []
    // };


    tessellate.init = function() {
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');

        CANVAS_WIDTH = canvas.width;
        CANVAS_HEIGHT = canvas.height;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        fallingPiece = new Shape();
        nextPiece = new Shape();

        fallingPiece.init();
        nextPiece.init();

        Board.init();

        console.log(Board.board);

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
        // console.log('drawing');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        Board.draw();
        fallingPiece.draw();
    };

    var update = function() {


    };

    tessellate.end = function() {
        window.clearTimeout(play);
        console.log('stopped');
    };



    // TODO: move to lib
    function rect(x, y, width, height, colour) {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.fill();
        // border
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = '#2e2';
        // ctx.stroke();
        ctx.closePath();
    };

    tessellate.handleKeys = function(e) {
        switch(e.keyCode) {
            case 38:
                fallingPiece.rotate();
                break;
        }
    };

})(window.tessellate = window.tessellate || {}, jQuery);

// standard jQuery
$(document).ready(function() {
    if(Modernizr.canvas) {

        tessellate.init();

        $('#start').click(function() {
            tessellate.init();
            return false;
        });
        $('#stop').click(function() {
            tessellate.end();
            return false;
        });

        $(document).keydown(function(e) {
            tessellate.handleKeys(e);
        });

    } else {
        $('.main').append("Your browser doesn't like fun!");
    }
});
