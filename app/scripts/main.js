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

        S.x = 4;
        S.y = 0;

        S.rotate = function() {
            var rotatedShape = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            
            var shapeLength = 4;
            // http://charlesleifer.com/blog/even-more-canvas-fun-tetris-in-javascript/
            // dynamic rotation of shapes
            // go through each array in shape array
            for(var y = 0; y < shapeLength; y++) {
                for(var x = 0; x < shapeLength; x++) {
                    // new array = len - val of pos of current (-1 for 0-index)
                    rotatedShape[x][y] = this.shape[shapeLength - y - 1][x];
                }
            }
            this.shape = rotatedShape;
        };

        S.leftEdge = function() {
            for(var y = 0; y < this.shape.length; y++) {
                for(var x = 0; x < this.shape[y].length; x++) {
                    // check vertical first! (L-shape: if row-first, will return first x it finds == wrong!)
                    if(this.shape[x][y] !== 0) {
                        return y;
                    }
                }
            }
        };
        S.rightEdge = function() {
            // start at top right
            for(var x = 3; x >= 0; x--) {
                for(var y = 0; y < 4; y++) {
                    if(this.shape[y][x] !== 0) {
                        return x;
                    }
                }
            }
        };
        S.bottomEdge = function() {
            // work back through array to find first non-0 entry
            for(var y = 3; y >= 0; y--) {
                for(var x = 0; x < this.shape[y].length; x++) {
                    if(this.shape[y][x] !== 0) {
                        // return row
                        return y;
                    }
                }
            }
        };
        S.init = function() {
            var rotation = Math.floor(Math.random() * 4);
            var randShape = Math.floor(Math.random() * shapes.length);
            this.shape = shapes[randShape];
            for(var i = 0; i < rotation; i++) {
                this.rotate();
            }
        };
        // S.clone = function() {};

        S.moveDown = function() {
            this.y++;
            if(this.bottomEdge() + this.y >= Board.height) {
                this.y--;
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
            
            // iterate through board
            for(var y = 0; y < this.board.length; y++) {
                var row = this.board[y];
                for(var x = 0; x < row.length; x++) {
                    drawBlock(x, y, row[x]);    
                }
            }

            // draw the shape lol
            for(var y = 0; y < fallingPiece.shape.length; y++) {
                for(var x = 0; x < fallingPiece.shape[y].length; x++) {
                    if(fallingPiece.shape[y][x] !== 0) {
                        drawBlock(x + fallingPiece.x, y + fallingPiece.y, fallingPiece.shape[y][x]);
                    }
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

        var FPS = 15;
        play = setInterval(function() {
            update();
            draw();
        }, 1000 / FPS);

    };

    var draw = function() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        Board.draw();
    };

    var update = function() {
        if(!collision() && ((fallingPiece.y + fallingPiece.bottomEdge()) < Board.height - 1)) {
            fallingPiece.moveDown();
        } else {
            for(var y = 0; y < fallingPiece.shape.length; y++) {
                for(var x = 0; x < fallingPiece.shape[y].length; x++) {
                    if(fallingPiece.shape[y][x] !== 0) {
                        Board.board[y + fallingPiece.y][x + fallingPiece.x] = fallingPiece.shape[y][x];
                    }
                }
            }

            fallingPiece = nextPiece;
            nextPiece = new Shape();
            nextPiece.init();
        }
    };

    var collision = function() {
        for(var y = 0; y < fallingPiece.shape.length; y++) {
            for(var x = 0; x < fallingPiece.shape[y].length; x++) {
                if(fallingPiece.shape[y][x] !== 0) {
                    if(Board.board[y + fallingPiece.y][x + fallingPiece.x]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

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
