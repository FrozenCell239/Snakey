export class Snake{
    constructor(x = 160, y = 160, dx = 16, dy = 0, length = 4, grid = 16){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.cells = [];
        this.length = length;
        this.grid = grid;
    };

    move(){
        this.x += this.dx;
        this.y += this.dy;
    };

    up(){
        if(this.dy === 0){
            this.dx = 0;
            this.dy = -this.grid;
        };
    };

    down(){
        if(this.dy === 0){
            this.dx = 0;
            this.dy = this.grid;
        };
    };

    left(){
        if(this.dx === 0){
            this.dx = -this.grid;
            this.dy = 0;
        };
    };

    right(){
        if(this.dx === 0){
            this.dx = this.grid;
            this.dy = 0;
        };
    };
};