export class Snake{
    constructor(x = 160, y = 160, dx = 16, dy = 0, length = 4, grid_size = 16){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.cells = [];
        this.length = length;
        this.grid_size = grid_size;
    };

    draw(context, index){
        context.fillStyle = 'green';
        context.fillRect(
            this.cells[index].x,
            this.cells[index].y,
            this.grid_size - 1,
            this.grid_size - 1
        );
    };

    move(){
        this.x += this.dx;
        this.y += this.dy;
    };

    up(){
        if(this.dy === 0){
            this.dx = 0;
            this.dy = -this.grid_size;
        };
    };

    down(){
        if(this.dy === 0){
            this.dx = 0;
            this.dy = this.grid_size;
        };
    };

    left(){
        if(this.dx === 0){
            this.dx = -this.grid_size;
            this.dy = 0;
        };
    };

    right(){
        if(this.dx === 0){
            this.dx = this.grid_size;
            this.dy = 0;
        };
    };
};