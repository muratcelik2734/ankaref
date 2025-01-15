import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Leaflet from 'leaflet';
import { WidgetService } from '../../services/widget.service';
import { Widget } from '../../models/widget';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: Leaflet.Map;
  private markers: Leaflet.Marker[] = [];

  constructor(
    private widgetService: WidgetService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.widgetService.getWidgets().subscribe(widgets => {
      this.updateMarkers(widgets);
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = Leaflet.map('map').setView([41.015137, 28.979530], 12);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  } 

  private updateMarkers(widgets: Widget[]) {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    widgets.forEach(widget => {
      const marker = Leaflet.marker(widget.coordinates)
        .addTo(this.map)
        .on('click', () => this.onMarkerClick(widget));

      if (widget.isHighlighted) {
        this.map.setView(widget.coordinates, 14);
      }

      this.markers.push(marker);
    });
  }

  private onMarkerClick(widget: Widget) {
    this.widgetService.highlightWidget(widget.id);
    const marker = this.markers[widget.id - 1];
    
    const createPopupContent = (mode: 'default' | 'temperature' | 'humidity' = 'default') => `
      <div class="popup-content">
        ${mode === 'default' ? `
          <h5>Nem ve Sıcaklık Sensörü</h5>
          <p>${widget.name}</p>
          
          <div class="values-and-buttons">
            <div class="values">
              <div class="value-container">
                <i class="bi bi-thermometer"></i>
                <span class="value">${widget.temperature} °C</span>
              </div>

              <div class="value-container">
                <i class="bi bi-droplet"></i>
                <span class="value">% ${widget.humidity}</span>
              </div>
            </div>

            <div class="buttons">
              <button type="button" class="btn-ayarla" id="editTemperatureBtn">
                Sıcaklık Ayarla
              </button>
              <button type="button" class="btn-ayarla" id="editHumidityBtn">
                Nem Ayarla
              </button>
            </div>
          </div>
        ` : mode === 'temperature' ? `
          <div class="temperature-edit">
            <div class="edit-header">
              <h5>Sıcaklık Ayarla</h5>
              <p>${widget.name}</p>
            </div>
            
            <div class="edit-content">
              <div class="current-value">
                <span>Mevcut</span>
                <div class="value-display">
                  <i class="bi bi-thermometer"></i>
                  <span>${widget.temperature} °C</span>
                </div>
              </div>
              
              <div class="new-value">
                <span>Yeni</span>
                <div class="value-input">
                  <input type="number" id="temperatureInput" value="30" min="0" max="40">
                  <span>°C</span>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button type="button" class="btn-iptal" id="cancelEditBtn">
                İptal et
              </button>
              <button type="button" class="btn-guncelle" id="updateTemperatureBtn">
                Güncelle
              </button>
            </div>
          </div>
        ` : `
          <div class="humidity-edit">
            <div class="edit-header">
              <h5>Nem Ayarla</h5>
              <p>${widget.name}</p>
            </div>
            
            <div class="edit-content">
              <div class="current-value">
                <span>Mevcut</span>
                <div class="value-display">
                  <i class="bi bi-droplet"></i>
                  <span>% ${widget.humidity}</span>
                </div>
              </div>
              
              <div class="new-value">
                <span>Yeni</span>
                <div class="value-input">
                  <input type="number" id="humidityInput" value="50" min="0" max="100">
                  <span>%</span>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button type="button" class="btn-iptal" id="cancelEditBtn">
                İptal et
              </button>
              <button type="button" class="btn-guncelle" id="updateHumidityBtn">
                Güncelle
              </button>
            </div>
          </div>
        `}
      </div>
    `;

    const popup = Leaflet.popup({
      className: 'map-dialog-container',
      maxWidth: 400,
      minWidth: 400,
      closeButton: false
    })
      .setLatLng(marker.getLatLng())
      .setContent(createPopupContent())
      .openOn(this.map);

    const setupEventListeners = () => {
      const editTempBtn = document.getElementById('editTemperatureBtn');
      const editHumBtn = document.getElementById('editHumidityBtn');
      const cancelBtn = document.getElementById('cancelEditBtn');
      const updateTempBtn = document.getElementById('updateTemperatureBtn');
      const updateHumBtn = document.getElementById('updateHumidityBtn');
      const tempInput = document.getElementById('temperatureInput') as HTMLInputElement;
      const humInput = document.getElementById('humidityInput') as HTMLInputElement;

      if (editTempBtn) {
        editTempBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.setContent(createPopupContent('temperature'));
          setTimeout(setupEventListeners, 0);
        });
      }

      if (editHumBtn) {
        editHumBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.setContent(createPopupContent('humidity'));
          setTimeout(setupEventListeners, 0);
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.setContent(createPopupContent('default'));
          setTimeout(setupEventListeners, 0);
        });
      }

      if (updateTempBtn && tempInput) {
        updateTempBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newTemp = parseFloat(tempInput.value);
          if (!isNaN(newTemp) && newTemp >= 0 && newTemp <= 40) {
            widget.temperature = newTemp;
            this.widgetService.updateWidget(widget);
            popup.setContent(createPopupContent('default'));
            setTimeout(setupEventListeners, 0);
          }
        });
      }

      if (updateHumBtn && humInput) {
        updateHumBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newHum = parseFloat(humInput.value);
          if (!isNaN(newHum) && newHum >= 0 && newHum <= 100) {
            widget.humidity = newHum;
            this.widgetService.updateWidget(widget);
            popup.setContent(createPopupContent('default'));
            setTimeout(setupEventListeners, 0);
          }
        });
      }
    };

    setTimeout(setupEventListeners, 0);

    popup.on('remove', () => {
      this.widgetService.highlightWidget(-1);
    });
  }

  
} 