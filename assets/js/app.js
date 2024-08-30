import { Snake } from './Entity/Snake.js';
import { Fruit } from './Entity/Fruit.js';

const grid_size = 16;
const snake = new Snake();
const apple = new Fruit(320, 320, grid_size);
const score_zone = document.getElementById('score');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const keyset_select = document.getElementById('keyset_select');
let keyset = ['Z', 'Q', 'S', 'D'];
let score = 0;
let count = 0;

// Keyset selection
keyset_select.addEventListener('change', function(event){
    switch(event.target.value){
        case 'ZQSD' :
            keyset = ['Z', 'Q', 'S', 'D'];
            break;

        case 'WASD' :
            keyset = ['W', 'A', 'S', 'D'];
            break;
    };
    document.activeElement.blur(); // Removes focus from the keyset selector in order to prevent a bug.
});

// Game loop (not starting it yet)
function loop(){
    requestAnimationFrame(loop);
    if(++count < 4){return;}; //Slows game loop to 15 fps instead of 60 (60/15 = 4)
  
    // Clearing the canvas to start a new frame
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Let the snake move
    snake.move();
  
    // Teleport the snake to the other side of the canvas if it goes out of bounds
    if(snake.x < 0){
        snake.x = canvas.width - grid_size;
    }
    else if(snake.x >= canvas.width){
        snake.x = 0;
    };
    if(snake.y < 0){
        snake.y = canvas.height - grid_size;
    }
    else if(snake.y >= canvas.height){
        snake.y = 0;
    };
  
    // Keep track of where snake has been
    snake.cells.unshift({x: snake.x, y: snake.y});
  
    // Remove cells as we move away from them
    if(snake.cells.length > snake.length){snake.cells.pop();};
  
    // Draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid_size - 1, grid_size - 1);
  
    // Draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index){
        // Drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid_size - 1, grid_size - 1);

        // Snake ate an apple
        if(cell.x === apple.x && cell.y === apple.y){
            snake.length++;
            score++;
            score_zone.innerText = score;
            apple.respawn();
        }
    
        // Checking collisions
        for(let i = index + 1; i < snake.cells.length; i++){

            // Snake eats itself, so it dies
            if(cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.length = 4;
                snake.dx = grid_size;
                snake.dy = 0;

                apple.respawn();
                score = 0;
                score_zone.innerText = 0;
            };
        };
    });
};
  
// Listen to keyboard events to move the snake
document.addEventListener('keydown', function(event){
    let pressed_key = event.key;
    if(pressed_key.length === 1){pressed_key = pressed_key.toUpperCase();};
    switch(pressed_key){
        case keyset[0] :
        case 'ArrowUp' :
            snake.up();
            break;

        case keyset[1] :
        case 'ArrowLeft' :
            snake.left();
            break;

        case keyset[2] :
        case 'ArrowDown' :
            snake.down();
            break;

        case keyset[3] :
        case 'ArrowRight' :
            snake.right();
            break;

        default: break;
    };
});

// Start the game
requestAnimationFrame(loop);