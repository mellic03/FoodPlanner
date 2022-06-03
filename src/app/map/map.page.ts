import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient} from '@angular/common/http';
import { StorageService } from '../services/storage.service';

declare let google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(private http:HttpClient, private storage:StorageService) { }

  async ngOnInit() {
    // Default coordinate.
    let lat_long = new google.maps.LatLng(-27.6651371, 153.1477415);

    // Have to retrieve theme directly from storage as AppComponent may not have finished loading yet.
    let styles;
    if (await this.storage.get("current_theme") == "dark_theme") {
      styles = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#FFFFFF'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#FFFFFF'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6963d7'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#773f8d'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6963d7'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    }
    
    let map_options = {
      center: lat_long,
      zoom: 3,
      map_type_id: google.maps.MapTypeId.ROADMAP,
      styles: styles
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