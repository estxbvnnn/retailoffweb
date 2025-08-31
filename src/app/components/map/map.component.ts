import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-map',
  imports: [CommonModule],
  styles: [`.map { width:100%; height:240px; border-radius:8px; overflow:hidden; }`],
  template: `<div #mapEl class="map"></div>`
})
export class MapComponent implements OnInit, OnDestroy {
  @Input({ required: true }) lat!: number;
  @Input({ required: true }) lng!: number;
  @Input() zoom = 14;
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  private map: any;

  async ngOnInit(): Promise<void> {
    const mb: any = await import('mapbox-gl');
    const mapboxgl = mb.default ?? mb;
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.map = new mapboxgl.Map({
      container: this.mapEl.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.lng, this.lat],
      zoom: this.zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
