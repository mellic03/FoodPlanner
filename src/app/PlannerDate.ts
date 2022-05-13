
interface PDate {
    date_ISO:Date;
    day_of_week_alphabetical:string;
    day_of_week:number;
    day_of_month:number;
    month:number;
    year:number;
    
    recipes:Array<Object>;

    addRecipe(recipe_name:string);
    removeRecipe(recipe_name:string);
}

export class PlannerDate implements PDate {

    date_ISO:Date;

    day_of_week_alphabetical:string;
    day_of_week:number;
    day_of_month:number;
    month:number;
    year:number;

    // An array of recipe name-checked pairs
    recipes:Array<Object>;

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
    addRecipe(recipe_name:string) {
        this.recipes.push({recipe_name: recipe_name, checked: false});
    }

    // Remove a recipe to the recipe array
    removeRecipe(recipe_name:string) {
        for (let i = 0; i < this.recipes.length; i++) {
            if (this.recipes[i] == [recipe_name, false]) {
                this.recipes.splice(i, 1);
                console.log("Removed: " + recipe_name);
                return(0);
            }
        }
        console.log("Could not find recipe: " + recipe_name);
    }

}