import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, marker, Marker } from 'leaflet';
import * as L from 'leaflet';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: any;
  markers: Marker[] = [];
  selectedWidget: any = null;
  widgets: any[] = [
    { id: 1, name: 'Widget 1', temperature: 22, humidity: 60, position: [51.505, -0.09] },
    { id: 2, name: 'Widget 2', temperature: 18, humidity: 55, position: [51.515, -0.1] },
    { id: 3, name: 'Widget 3', temperature: 25, humidity: 70, position: [51.525, -0.11] },
    // Add more widgets as needed
  ];

  ngOnInit() {
    this.initMap();
    this.createMarkers();
  }

  initMap() {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  createMarkers() {
    this.widgets.forEach((widget) => {
      const newMarker = marker(widget.position).addTo(this.map);

      newMarker.on('click', () => {
        this.onMarkerClick(widget);
      });

      this.markers.push(newMarker);
    });
  }

  onMarkerClick(widget: any) {
    this.selectedWidget = widget;
    // Open pop-up with widget details
    const popupContent = `
      <div>
        <h5>${widget.name}</h5>
        <p>Temperature: ${widget.temperature}°C</p>
        <p>Humidity: ${widget.humidity}%</p>
        <button (click)="openTemperatureAdjust()">Sıcaklık Ayarla</button>
        <button (click)="openHumidityAdjust()">Nem Ayarla</button>
      </div>
    `;
    this.map.openPopup(popupContent, widget.position);
    this.highlightWidget(widget);
  }

  highlightWidget(widget: any) {
    this.selectedWidget = widget;
    // Implement the logic to highlight the widget in the sidebar
  }

  openTemperatureAdjust() {
    console.log("Open temperature adjustment for", this.selectedWidget);
    // Implement the logic to adjust temperature
  }

  openHumidityAdjust() {
    console.log("Open humidity adjustment for", this.selectedWidget);
    // Implement the logic to adjust humidity
  }

  searchWidget(event: any) {
    const name = event.target.value
    const filteredWidgets = this.widgets.filter(widget => widget.name.toLowerCase().includes(name.toLowerCase()));
    this.updateMarkers(filteredWidgets);
  }

  updateMarkers(filteredWidgets: any[]) {
    this.markers.forEach(marker => marker.remove()); // Remove existing markers

    filteredWidgets.forEach(widget => {
      const newMarker = marker(widget.position).addTo(this.map);
      newMarker.on('click', () => {
        this.onMarkerClick(widget);
      });
      this.markers.push(newMarker);
    });
  }
}
