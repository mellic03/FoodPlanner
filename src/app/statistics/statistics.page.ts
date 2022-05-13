import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../services/storage.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  @ViewChild('food_usage_chart', {static: true}) canvas;
  chart:any;
  
  constructor(private storage:StorageService) { }

  // Chart needs to read dates from date array and plot the last two weeks of dates

  data = {
    datasets: [{
      label: "Percentage of Food used",
      data: [4, 5, 5, 4, 2, 3, 2, 1],
      backgroundColor: ["rgba(105, 99, 215, 1)"]
    }],
    labels: [],
  }

  async ngOnInit() {

    // Create x-axis labels of dates
    let planner_dates:Array<Array<string>> = await this.storage.get("planner_dates");
    for (let date of planner_dates) {
      this.data.labels.push(date["day_of_month"] + "/" + date["month"]);
    }


    // Get number of ingredients
    let number_of_ingredients:any = this.storage.getAllInfo(await this.storage.get("all_recipes"));
    number_of_ingredients = number_of_ingredients.length;
    console.log(number_of_ingredients);


    // Get number of ingredients that are in "checked" (cooked) recipes
    



 

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: this.data
    });

  }



  


}
