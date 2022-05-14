export class Ingredient {
    
    name:string;
    quantity:number;
    unit:string;

    // Used in shopping list to tell whether an ingredient is "checked" off the list.
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

    // Used in planner/statistics to tell whether a recipe has been cooked.
    cooked:boolean = false;

    constructor(name:string, ingredients:Array<Ingredient> = []) {
        this.name = name;
        this.ingredients = ingredients;
    }

    addIngredient(ingredient:Ingredient) {
        this.ingredients.push(ingredient);
    }
}


export class PlannerDate {

    date_ISO:Date;

    day_of_week_alphabetical:string;
    day_of_week:number;
    day_of_month:number;
    month:number;
    year:number;

    // An array of recipe name-checked pairs
    recipes:Array<Recipe>;

    constructor(date_ISO) {
        this.date_ISO = date_ISO;
        this.day_of_week = this.date_ISO.getDay();

        let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.day_of_week_alphabetical = week_days[this.day_of_week];

        this.day_of_month = this.date_ISO.getDate();
        this.month = this.date_ISO.getMonth();
        this.year = this.date_ISO.getFullYear();

        this.recipes = [];
    }

    // Add a recipe to the recipe array
    addRecipe(recipe:Recipe) {
        this.recipes.push(recipe);
    }

    // Remove a recipe to the recipe array
    removeRecipe(recipe_name:string) {
        for (let i = 0; i < this.recipes.length; i++) {
            if (this.recipes[i].name == recipe_name) {
                this.recipes.splice(i, 1);
                console.log("Removed: " + recipe_name);
                return(0);
            }
        }
        console.log("Could not find recipe: " + recipe_name);
    }
}