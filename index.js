var snake = function() {
    var c = document.createElement('canvas'),
        ctx = c.getContext('2d'),
        snakeArray = [],
        food = {},
        length = 5,
        tid = 0,
        timer = 100,
        dir = 'right',
        paused = 0,
        score = 0,
        nx = 0,
        ny = 0,
        gameover = false,
        that = {
            init: function() {
		        c.setAttribute('width', 450);
		        c.setAttribute('height', 450);
		        document.body.appendChild(c);

                this.createSnake();
                this.createFood();
                this.bindEvents();
                this.paint();
            },

            bindEvents: function() {
		        document.addEventListener('keyup', function(e) {
		            var key = e.which;
		            if (key == 37 && dir != 'right') dir = 'left';
		            if (key == 38 && dir != 'down') dir = 'up';
		            if (key == 39 && dir != 'left') dir = 'right';
		            if (key == 40 && dir != 'up') dir = 'down';
		        });

		        document.addEventListener('click', this.togglePause.bind(this));
            },

            createSnake: function() {
                for (var i = length; i > 0; i--) {
                    snakeArray.push({ x: i, y: 0 });
                };
            },

            createFood: function() {
                food = {
                    x: Math.round(Math.random() * 44),
                    y: Math.round(Math.random() * 44)
                };
            },

            paint: function() {
                var arr = snakeArray.concat([food]);
                for (var i = 0, j = arr.length; i < j; i++) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(arr[i].x * 10, arr[i].y * 10, 10, 10);
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(arr[i].x * 10, arr[i].y * 10, 10, 10);
                }
                ctx.fillText('score: ' + score, 10, 20);
            },

            update: function() {
                var tail = {};

                nx = snakeArray[0].x;
                ny = snakeArray[0].y;

                if (dir == 'left') nx--;
                if (dir == 'right') nx++;
                if (dir == 'up') ny--;
                if (dir == 'down') ny++;

                if (food.x === nx && food.y === ny) {
                    tail.x = nx;
                    tail.y = ny;
                    this.createFood();
                    score++;
                } else {
                    tail = snakeArray.pop();
                    tail.x = nx;
                    tail.y = ny;
                }
                snakeArray.unshift(tail);
            },

            checkCollide: function() {
                if (nx > 44 || nx < 0 || ny > 44 || ny < 0 || this.checkCollideBySelf()) return true;
            },

            checkCollideBySelf: function() {
                var flag = false;
                for (var i = 1, j = snakeArray.length; i < j; i++) {
                    if (nx === snakeArray[i].x &&
                        ny === snakeArray[i].y) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            },

            run: function() {
                gameover = false;

                var o = this;
                o.tid = setTimeout(function run() {
                    o.update();
                    if (o.checkCollide()) {
                        o.gameOver();
                    } else {
	                    ctx.clearRect(0, 0, 450, 450);
	                    
	                    o.paint();
                        o.tid = setTimeout(run, timer);
                    }
                }, timer);
            },

            togglePause: function() {
            	if (gameover) return;

                if (paused ^= 1)
                    this.tid && clearTimeout(this.tid);
                else
                    this.run();
            },

            gameOver: function() {
                if (this.tid) clearTimeout(this.tid);
                gameover = true;
                alert('game over');
            }
        };

    that.init();

    return that;
};