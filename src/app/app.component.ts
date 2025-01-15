import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import { WidgetListComponent } from './components/widget-list/widget-list.component';
import { WidgetService } from './services/widget.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MapComponent, 
    WidgetListComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ankaref';
  searchTerm: string = '';

  constructor(private widgetService: WidgetService) {}

  onSearch(term: string) {
    this.widgetService.filterWidgets(term);
  }
}
