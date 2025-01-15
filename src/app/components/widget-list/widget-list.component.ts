import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetService } from '../../services/widget.service';
import { Widget } from '../../models/widget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetListComponent implements OnInit {
  widgets: Widget[] = [];

  constructor(private widgetService: WidgetService) {}

  ngOnInit() {
    this.widgetService.getWidgets().subscribe(widgets => {
      this.widgets = widgets;
    });
  }

  onWidgetClick(widget: Widget) {
    this.widgetService.highlightWidget(widget.id);
  }
} 