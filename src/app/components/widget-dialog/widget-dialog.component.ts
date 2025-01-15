import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Widget } from '../../models/widget';

@Component({
  selector: 'app-widget-dialog',
  template: `
    <div class="widget-dialog">
      <h2 mat-dialog-title>Nem ve Sıcaklık Sensörü</h2>
      <p class="text-muted">{{data.name}}</p>
      
      <mat-dialog-content>
        <div class="d-flex align-items-center gap-4 my-4">
          <div class="d-flex align-items-center">
            <i class="bi bi-thermometer-half me-2"></i>
            <span class="fs-4">{{data.temperature}} °C</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="bi bi-droplet-half me-2"></i>
            <span class="fs-4">% {{data.humidity}}</span>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions>
        <button mat-stroked-button class="w-50" (click)="onTemperatureClick()">
          <span>Sıcaklık</span>
          <span>Ayarla</span>
        </button>
        <button mat-stroked-button class="w-50" (click)="onHumidityClick()">
          <span>Nem</span>
          <span>Ayarla</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class WidgetDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<WidgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Widget
  ) {}

  onTemperatureClick() {
  }

  onHumidityClick() {
  }
} 