import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    Observable,
    tap
} from 'rxjs';
import {
    environment
} from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AgendaService {

    constructor(private http: HttpClient, ) { }

    env: string = `${environment.apiUrl}/api/Agenda`;
    getAgendas() {
        return this.http.get(this.env + "/Agendas");
    }
}

