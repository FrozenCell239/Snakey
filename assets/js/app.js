import { Snake } from './Entity/Snake.js';
import { Fruit } from './Entity/Fruit.js';

const grid_size = 16;
const snake = new Snake();
const apple = new Fruit();
const fake_scores = 20;
const score_zone = document.getElementById('score');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const keyset_select = document.getElementById('keyset-select');
const gameover_dialog = document.getElementById('gameover');
const gameover_message = document.getElementById('gameover-message');
const gameover_button = document.getElementById('gameover-button');
let keyset = ['Z', 'Q', 'S', 'D'];
let score = 0;
let count = 0;
let players;
let least_best_score;

// Getting fake players and their scores for tests
async function getFakePlayers(min_score = 60, max_score = 180){
    try{
        const response = await fetch('https://randomuser.me/api/?results=' + fake_scores);
        const data = await response.json();
        let new_players = [];

        min_score = Math.floor(min_score / 10);
        max_score = Math.floor(max_score / 10);
        data.results.forEach(new_player => {
            new_players.push({
                username: new_player.login.username,
                score: (Math.floor(Math.random() * (max_score - min_score)) + min_score) * 10
            });
        });
        return new_players.sort((a, b) => b.score - a.score);
    }
    catch(error){
        console.error(error);
    };
};

// Updating displayed scoreboard
function updateScoreboard(){
    const scoreboard = document.getElementById('scoreboard');

    for(let i = 0; i < fake_scores; i++){
        const new_player = document.createElement('tr');
    
        new_player.innerHTML = `<td class="player">${players[i].username}</td><td class="player_highscore">${players[i].score}</td>`;
        scoreboard.appendChild(new_player);
        if(i + 1 === fake_scores){
            least_best_score = players[i].score;
        };
    };
};

// Checking local storage for highscores
if(localStorage.getItem('snake_players') === null){
    players = await getFakePlayers()
    localStorage.setItem('snake_players', JSON.stringify(players));
}
else{
    players = JSON.parse(localStorage.getItem('snake_players'));
}
updateScoreboard();

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

// Pushing new highscore to the scoreboard
window.newHighscore = function (){
    const username = document.getElementById('username').value;

    // Checking username validity
    if(!(/^[a-zA-Z0-9._-]{6,20}$/.test(username))){
        alert("You must enter a valid username (6 to 20 characters allowed) to save your score and continue.");
        return;
    };

    // Pushing the new highscore to the scoreboard
    players.push({
        username: username,
        score: score
    });
    players.sort((a, b) => b.score - a.score);
    localStorage.setItem('snake_players', JSON.stringify(players));
    updateScoreboard();

    return location.reload();
};

// Game loop (not starting it yet)
function loop(){
    requestAnimationFrame(loop);
    if(++count < 4){return;}; //Slows game loop to 15 fps instead of 60 (60/15 = 4).
  
    // Clearing the canvas to start a new frame
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Letting the snake move
    snake.move();
  
    // Teleporting the snake to the other side of the canvas if it goes out of bounds
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
  
    // Keeping track of where snake has been
    snake.cells.unshift({x: snake.x, y: snake.y});
  
    // Removing last cell of the snake's tail as it moves
    if(snake.cells.length > snake.length){snake.cells.pop();};
  
    // Drawing apple
    apple.draw(context);
  
    // Drawing snake one cell at a time
    snake.cells.forEach(function(cell, index){
        snake.draw(context, index);

        // Snake ate an apple
        if(cell.x === apple.x && cell.y === apple.y){
            snake.length++;
            score += 10;
            score_zone.innerText = score;
            apple.respawn();
        }
    
        // Checking collisions
        for(let i = index + 1; i < snake.cells.length; i++){
            // Snake eats itself, so it dies
            if(cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){
                if(score > least_best_score){
                    gameover_message.innerText = `You scored ${score} points. Enter your username to save your score and continue.`;
                    gameover_button.innerText = "Save and try again !";
                    gameover_button.getAttributeNode('onclick').value = `newHighscore(${score})`;
                }
                else{
                    document.getElementById('username').remove();
                    gameover_message.innerText = `You scored ${score} points. Another chance ?`;
                    gameover_button.innerText = "Try again !";
                    gameover_button.getAttributeNode('onclick').value = 'location.reload()';
                };
                gameover_dialog.showModal();
            };
        };
    });
};
  
// Listening for keyboard controls
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