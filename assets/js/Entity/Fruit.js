export class Fruit{
    constructor(x = -1, y = -1, grid_size = 16){
        this.grid_size = grid_size;
        if(x === -1 || y === -1){
            this.respawn();
        }
        else{
            this.x = x;
            this.y = y;
        }
    };

    draw(context){
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.grid_size - 1, this.grid_size - 1);
    };

    respawn(min = 0, max = 25){
        this.x = (Math.floor(Math.random() * (max - min)) + min) * this.grid_size;
        this.y = (Math.floor(Math.random() * (max - min)) + min) * this.grid_size;
    };
};