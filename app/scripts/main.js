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
    var lineTotal = 0;
    var score = 0;
    var time;
    var TIME_STEP = 500;
    var LEVEL_REDUCTION = 25;
    var play;
    var fallingPiece;
    var nextPiece;
    var CANVAS_WIDTH;
    var CANVAS_HEIGHT;
    var TILE_SIZE = 20;
    var FPS = 20;
    // $('<canvas id="canvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>').appendTo('.container');
    var canvas;
    var ctx;

    function updateScore() {
        score = lineTotal * 5;
        $('.lines').text(lineTotal);
        $('.score').text(score);
    }
    // var == private
    var shapes = [
        [[0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0]],

        [[0, 0, 0, 0],
         [0, 2, 2, 0],
         [0, 2, 2, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [0, 3, 0, 0],
         [3, 3, 3, 0],
         [0, 0, 0, 0]],

        [[0, 0, 0, 0],
         [0, 0, 4, 0],
         [0, 0, 4, 0],
         [0, 4, 4, 0]],

        [[0, 0, 0, 0],
         [0, 5, 0, 0],
         [0, 5, 0, 0],
         [0, 5, 5, 0]],

        [[0, 0, 0, 0],
         [0, 0, 6, 0],
         [0, 6, 6, 0],
         [0, 6, 0, 0]],

        [[0, 0, 0, 0],
         [0, 7, 0, 0],
         [0, 7, 7, 0],
         [0, 0, 7, 0]]
    ];

    function Shape(S) {

        S = S || {};

        S.x = 4;
        S.y = 0;

        S.rotate = function() {
            var rotatedShape = {};
            rotatedShape.shape = [
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
                    rotatedShape.shape[x][y] = this.shape[shapeLength - y - 1][x];
                }
            }
            rotatedShape.x = fallingPiece.x;
            rotatedShape.y = fallingPiece.y;

            if(!collision(rotatedShape)) { 
                this.shape = rotatedShape.shape;
            }
            if(this.x + this.leftEdge() < 0) {
                this.x = 0;
            }
            if(this.x + this.rightEdge() >= Board.width) {
                this.x = Board.width - this.rightEdge() - 1;
            }
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

        S.moveLeft = function() {
            this.x--;
            if((this.x + this.leftEdge()) < 0 || collision(this)) {
                this.x++;
            }
        };

        S.moveRight = function() {
            this.x++;
            if((this.x + this.rightEdge()) >= Board.width || collision(this)) {
                this.x--;
            }
        };
        S.moveDown = function() {
            this.y++;
            if((this.bottomEdge() + this.y >= Board.height) || collision(S)) {
                this.y--;

                // move shape onto board
                Board.update();
                getNextPiece();       
            }
        };

        S.update = function() {
            this.moveDown();
        };

        // S.inBounds = function() {
        //     return ((this.x + this.leftEdge()) >= 0) && ((this.x + this.rightEdge()) <= Board.width);
        // }

        return S;
    }

    function checkLines() {
        for(var y = Board.height - 1; y >= 0; y--) {
            var i = 0;
            for(var x = 0; x < Board.width; x++) {
                if(Board.board[y][x] !== 0) {
                    i++;
                }
            }
            // if line full
            if(i === Board.width) {
                removeLine(y);
                return true;
            }
        }
        return false;
    }

    function removeLine(row) {
        // remove all pieces from row
        // move pieces above down 1 row
        for(var y = row - 1; y >= 0; y--) {
            for(var x = 0; x < Board.width; x++) {
                Board.board[y + 1][x] = Board.board[y][x];
            }
        }
        // get faster with each line
        TIME_STEP -= LEVEL_REDUCTION;
    }

    function getNextPiece() {
        fallingPiece = nextPiece;
        nextPiece = new Shape();
        nextPiece.init();
        // run out of board
        if(collision(fallingPiece)) {
            tessellate.gameOver();
        }
    }

    tessellate.gameOver = function() {
        window.clearTimeout(play);
        $('.message').html('<h2>Game Over!</h2><p><strong>Lines cleared:</strong> ' + lineTotal + ' <strong>Score:</strong> ' + score)
        .fadeIn();
        // $('.hero-unit').append('Game Over!');
    }

    var Board = {
        colour: '#34495E',
        x: 0,
        y: 0,
        height: 25,
        width: 12,

        board: [],

        init: function() {
            this.board = [];
            for(var y = 0; y < this.height; y++) {
                var row = [];
                for(var x = 0; x < this.width; x++) {
                    row.push(0);
                }
                this.board.push(row);
            }
        },

        update: function() {
            for(var y = 0; y < fallingPiece.shape.length; y++) {
                for(var x = 0; x < fallingPiece.shape[y].length; x++) {
                    if(fallingPiece.shape[y][x] !== 0) {
                        Board.board[y + fallingPiece.y][x + fallingPiece.x] = fallingPiece.shape[y][x];
                    }
                }
            }
            while(checkLines()) {
                lineTotal++;
                updateScore();
            }
        },
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
            case 1:
                colour = '#F1C40F';
                break;
            case 2:
                colour = '#9B59B6';
                break;
            case 3:
                colour = '#2ECC71';
                break;
            case 4:
                colour = '#3498DB';
                break;
            case 5:
                colour = '#E74C3C';
                break;
            case 6:
                colour = '#E67E22';
                break;
            case 7:
                colour = '#C0392B';
                break;
            default:
                colour = 'red';
                break;
        }

        x = x * TILE_SIZE;
        y = y * TILE_SIZE;
        rect(x, y, TILE_SIZE, TILE_SIZE, colour);
    }

    tessellate.init = function() {
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');

        CANVAS_WIDTH = canvas.width;
        CANVAS_HEIGHT = canvas.height;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        Board.init();

        fallingPiece = new Shape();
        nextPiece = new Shape();

        fallingPiece.init();
        nextPiece.init();

        TIME_STEP = 700;
        LEVEL_REDUCTION = 20;
        lineTotal = 0;
        score = 0;

        time = new Date().getTime();
        play = setInterval(function() {
            update();
            draw();
        }, 1000 / FPS);

    };

    var draw = function() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        Board.draw();
        drawNextBlock();
    };

    var update = function() {
        var delta = new Date().getTime() - time;
        if(delta >= TIME_STEP) {
            fallingPiece.update();
            time = new Date().getTime();
            delta = 0;
        }
    };

    function drawNextBlock() {
        for(var y = 0; y < nextPiece.shape.length; y++) {
            for(var x = 0; x < nextPiece.shape[y].length; x++) {
                if(nextPiece.shape[y][x] !== 0) {
                    drawBlock(x + Board.width + 2, y + 2, nextPiece.shape[y][x]);
                }
            }
        }
    }

    var collision = function(piece) {
        for(var y = 0; y < 4; y++) {
            for(var x = 0; x < 4; x++) {
                if(piece.shape[y][x] !== 0) {
                    if(Board.board[y + piece.y][x + piece.x]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    // TODO: move to lib
    function rect(x, y, width, height, colour) {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.fill();
        ctx.closePath();
    };

    tessellate.handleKeys = function(e) {
        // 37 - left
        // 38 - up
        // 39 - right
        // 40 - down
        switch(e.keyCode) {
            case 38: // up
                fallingPiece.rotate();
                break;
            case 37: //left
                fallingPiece.moveLeft();
                break;
            case 39: // right
                fallingPiece.moveRight();
                break;
            case 40: // down
                fallingPiece.moveDown();
                break;
        }
    };

})(window.tessellate = window.tessellate || {}, jQuery);

// standard jQuery
$(document).ready(function() {
    if(Modernizr.canvas) {

        tessellate.init();

        // $('#start').click(function() {
        //     tessellate.init();
        //     return false;
        // });
        // $('#stop').click(function() {
        //     tessellate.gameOver();
        //     return false;
        // });

        $(document).keydown(function(e) {
            tessellate.handleKeys(e);
        });

    } else {
        $('.main').append("Your browser doesn't like fun!");
    }
});
