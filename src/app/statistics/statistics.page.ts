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
      label: "Rate of Food Usage Per Day",
      data: [5, 4, 5, 3, 2, 2, 1, 2, 1],
      backgroundColor: ["rgba(105, 99, 215, 0.6)"]
    }],
    labels: [],
  }

  async ngOnInit() {

    let formatted_dates:Array<Array<string>> = await this.storage.get("dates_formatted");

    for (let date of formatted_dates) {
      this.data.labels.push(date[1].substring(5, date[1].length))
    }


    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: this.data
    });
  }

}
