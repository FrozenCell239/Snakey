function randint(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
};

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const grid = 16;
let count = 0;
let snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};
let apple = {
  x: 320,
  y: 320
};

// Game loop (not starting it yet)
function loop() {
  requestAnimationFrame(loop);
  if(++count < 4){return;}; //Slows game loop to 15 fps instead of 60 (60/15 = 4)

  // Clearing the canvas to start a new frame
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {

    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // canvas is 400x400 which is 25x25 grids
      apple.x = randint(0, 25) * grid;
      apple.y = randint(0, 25) * grid;
    }

    // check collision with all cells after this one (modified bubble sort)
    for (let i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = randint(0, 25) * grid;
        apple.y = randint(0, 25) * grid;
      }
    }
  });
}

// Listen to keyboard events to move the snake
document.addEventListener('keydown', function(key){
    // Left arrow key
    if(key.which === 37 && snake.dx === 0){
        snake.dx = -grid;
        snake.dy = 0;
    }

    // Up arrow key
    else if(key.which === 38 && snake.dy === 0){
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Right arrow key
    else if(key.which === 39 && snake.dx === 0){
        snake.dx = grid;
        snake.dy = 0;
    }

    // Down arrow key
    else if(key.which === 40 && snake.dy === 0){
        snake.dy = grid;
        snake.dx = 0;
    };
});

// Start the game
requestAnimationFrame(loop);