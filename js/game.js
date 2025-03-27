class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.lastMoveTime = 0; // 新增时间记录属性
        
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    handleKeyPress(e) {
        console.log('按键:', e.key);
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        const newDirection = keyMap[e.key];
        console.log('尝试切换方向:', newDirection, '当前方向:', this.direction);
        
        if (newDirection && !this.isOppositeDirection(newDirection)) {
            this.direction = newDirection;
            console.log('方向已更新:', this.direction);
        }
    }

    isOppositeDirection(newDir) {
        console.log('方向检测 新方向:', newDir, '当前方向:', this.direction);
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        return this.direction === opposites[newDir];
    }

    gameLoop() {
        const currentTime = Date.now();
        
        if (currentTime - this.lastMoveTime > 1000) {
            this.moveSnake();
            if (this.checkCollision()) {
                alert('游戏结束！得分：' + this.score);
                location.reload();
                return;
            }
            this.checkFood();
            this.lastMoveTime = currentTime; // 更新最后移动时间
        }
        
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    moveSnake() {
        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        this.snake.unshift(head);
        this.snake.pop();
    }

    checkCollision() {
        const head = this.snake[0];
        
        // 边界检测
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // 自身碰撞检测
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    checkFood() {
        const head = this.snake[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.snake.push({...this.snake[this.snake.length-1]});
            this.food = this.generateFood();
        }
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // 绘制食物
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }
}

// 启动游戏
new SnakeGame();