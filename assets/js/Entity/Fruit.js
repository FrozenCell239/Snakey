export class Fruit{
    constructor(x = -1, y = -1, grid = 16){
        this.grid = grid;
        if(x === -1 || y === -1){
            this.respawn();
        }
        else{
            this.x = x;
            this.y = y;
        }
    };

    respawn(min = 0, max = 25){
        this.x = (Math.floor(Math.random() * (max - min)) + min) * this.grid;
        this.y = (Math.floor(Math.random() * (max - min)) + min) * this.grid;
    };
};