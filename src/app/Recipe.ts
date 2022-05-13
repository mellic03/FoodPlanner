export class Ingredient {
    
    name:string;
    quantity:number;
    unit:string;
    checked:boolean = false;

    constructor(name:string, quantity:number, unit:string) {
        
        this.name = name;
        this.quantity = quantity;
        
        this.unit = unit;
    }
}


export class Recipe {

    name:string;
    ingredients:Array<Ingredient>;

    constructor(name:string, ingredients:Array<Ingredient>) {
        this.name = name;
        this.ingredients = ingredients;
    }
}
