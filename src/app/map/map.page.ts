import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import {HttpClient} from '@angular/common/http';

declare let google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(private appComponent:AppComponent, private http:HttpClient) { }

  async ngOnInit() {

    // Default coordinate.
    let lat_long = new google.maps.LatLng(-27.6651371, 153.1477415);

    let map_options = {
      center: lat_long,
      zoom: 5,
      map_type_id: google.maps.MapTypeId.ROADMAP,
    }

    // Create map.
    let map = new google.maps.Map(this.mapElement.nativeElement, map_options);

    let json_data;
    this.http.get("assets/country_data.json").subscribe((data) => {
      json_data = data;

      for (const country of json_data) {
        // Create coordinate.
        const latLng = new google.maps.LatLng(country.latlng[0], country.latlng[1])
        // Create marker at coordinate.
        const marker = new google.maps.Marker({
          position: latLng,
          map: map
        })

        // Create an array of HTML strings, the length depends on how many recipes each country has.
        const string_array = [];
        string_array.push(`<h4>Recipes From ${country.name}</h4>`);
        for (let i = 0; i < country.recipes?.length; i++) {
          string_array.push(`<a href="https://www.google.com/search?q=${country.recipes?.[i]}"><p>${country.recipes?.[i]}\n</p></a>`);
        }

        // Create InfoWindow for marker.
        const infoWindow = new google.maps.InfoWindow({
          content: string_array.join('') // Join the string array
        })
        this.info_windows.push(infoWindow);
        
        // Assign InfoWindow to marker.
        google.maps.event.addListener(marker, 'click', () => {
          this.closeInfoWindows();
          infoWindow.open(map, marker);
        })
      }
    });

    this.appComponent.toggleMenuSwipe(false);
  }

  // Close all Google Maps InfoWindows.
  closeInfoWindows() {
    this.info_windows.forEach((info_window) => {
      info_window.close();
    })
  }

  // Open a Google Map InfoWindow.
  openInfoWindow(marker:any, infoWindow:any) {
    infoWindow.open(marker);
  }

  @ViewChild('map', {static:true}) mapElement;
  map:any;

  info_windows:Array<any> = [];

}