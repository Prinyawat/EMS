import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { HomeService } from "src/app/shared/services/home.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    constructor(private homeService: HomeService) {

    }
    test() {
        console.log('click)')
        this.homeService.getItems().subscribe(res => {
            console.log('res', res);
        });
    }
}
