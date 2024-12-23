import { Component} from '@angular/core';
import * as L from 'leaflet';
@Component({
    selector: 'app-checking',
    templateUrl: './checking.component.html',
    providers: []
})
export class CheckingComponent {
    valRadio: string = '';

    display: boolean = false;

    private map!: L.Map;

    ngOnInit(): void {
        // พิกัดเริ่มต้นของแผนที่
        this.map = L.map('map').setView([18.7953, 98.9989], 13); // พิกัดของเชียงใหม่ (latitude, longitude)

        // ใช้ OpenStreetMap สำหรับแผนที่
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }

}
