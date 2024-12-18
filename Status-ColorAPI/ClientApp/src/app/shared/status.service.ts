import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http"
import { environment } from '../../environments/environment.development';
import { Status } from './status.model';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  url:string = environment.apiBaseUrl + '/StatusColor'
  formData: Status = new Status()
  status: any[] = [];
  
  
  constructor(private http: HttpClient) { }

  // refreshList(){
  //   this.http.get(this.url, parameter)//active-inactive, Statustype , search 
  //   .subscribe({
  //     next: res => {    
  //     this.status = res as any[]
  //   },
  //   error: err => {console.log(err)}
  //   })
  // }

  refreshList(activeStatus?: string, statusType?: string, searchText?: string): void {
    const params = {
      activeStatus: activeStatus || '',
      statusType: statusType || '',
      searchText: searchText || ''
    };
  
    this.http.get(this.url, { params }).subscribe({
      next: (res) => {
        this.status = res as any[];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  getStatusTypes() {
    return this.http.get<string[]>(this.url + '/StatusTypes');
  }
  

  postStatus() {
    return this.http.post(this.url, this.formData)
  }

  putStatus() {
    return this.http.put(this.url + '/' + this.formData.statusId, this.formData)
  }

  
}
