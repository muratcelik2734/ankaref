import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Widget } from '../models/widget';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private widgets: Widget[] = [];
  private widgetsSubject = new BehaviorSubject<Widget[]>([]);
  
  constructor() {
    this.generateRandomWidgets();
  }

  private generateRandomWidgets() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (let i = 0; i < 8; i++) {
      const widget: Widget = {
        id: i + 1,
        name: `Widget ${i + 1}`,
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        humidity: Math.floor(Math.random() * 60) + 20, // 20-80%
        batteryLevel: Math.floor(Math.random() * 100),
        lastUpdate: new Date(
          yesterday.getTime() + Math.random() * (now.getTime() - yesterday.getTime())
        ),
        coordinates: [
          41.015137 + (Math.random() - 0.5) * 0.1, // İstanbul koordinatları civarı
          28.979530 + (Math.random() - 0.5) * 0.1
        ],
        isHighlighted: false
      };
      this.widgets.push(widget);
    }
    this.widgetsSubject.next(this.widgets);
  }

  getWidgets(): Observable<Widget[]> {
    return this.widgetsSubject.asObservable();
  }

  highlightWidget(id: number) {
    this.widgets = this.widgets.map(widget => ({
      ...widget,
      isHighlighted: widget.id === id
    }));
    this.widgetsSubject.next(this.widgets);
  }

  filterWidgets(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.widgetsSubject.next(this.widgets);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filteredWidgets = this.widgets.map(widget => ({
      ...widget,
      isHighlighted: widget.name.toLowerCase().includes(term)
    }));

    this.widgetsSubject.next(filteredWidgets);
  }

  updateWidget(updatedWidget: Widget) {
    this.widgets = this.widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    );
    this.widgetsSubject.next(this.widgets);
  }
} 