import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { StatusAddEditComponent } from './status-add-edit/status-add-edit.component';
import { StatusService } from './shared/status.service';
import { Status } from './shared/status.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [NgbModalConfig, NgbModal],
})
export class AppComponent  implements OnInit{
  title = 'Status-ColorApps';
  sortColumn: string = '';
  sortDirection: boolean = true;
  filteredStatus: Status[] = [];
  selectedStatusType: string = '';
  selectedActiveStatus: string = ''; 
  searchText: string = '';
  formData: Status = new Status()
  

  constructor(private modalService: NgbModal,public service: StatusService) {}

  ngOnInit(): void {
    this.service.refreshList();
    this.filteredStatus = this.service.status;

  }
 

  open() {
    this.modalService.open(StatusAddEditComponent);
  }
  
  onSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortDirection = !this.sortDirection; 
    } else {
      this.sortColumn = columnName;
      this.sortDirection = true;
    }
  
    
    this.service.status.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];
  
      if (valueA < valueB) {
        return this.sortDirection ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection ? 1 : -1;
      }
      return 0;
    });
  }
  
  getFilteredStatus() {
    let filtered = this.service.status;
  
    if (this.searchText) {
      filtered = filtered.filter(st =>
        st.statusName?.toLowerCase().includes(this.searchText.toLowerCase()) 
      );
    }
  
    if (this.selectedStatusType) {
      filtered = filtered.filter(st => st.statusType === this.selectedStatusType);
    }
  
    if (this.selectedActiveStatus) {
      const isActive = this.selectedActiveStatus === '1'; 
      filtered = filtered.filter(st => st.active === isActive);
    }
  
    return filtered;
  }
  

  // onStatusTypeChange(event: Event) {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.selectedStatusType = value; 

      // this.service.refreshList(parameter);
  // }

  // onActiveStatusChange(event: Event) {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.selectedActiveStatus = value; 

    
  //   // this.service.refreshList(parameter);
  // }

  // onSearchChange(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.searchText = value; 
  // }

  onActiveStatusChange(event: Event) {
    this.selectedActiveStatus = (event.target as HTMLSelectElement).value;
    this.refreshFilteredList();
  }
  
  onStatusTypeChange(event: Event) {
    this.selectedStatusType = (event.target as HTMLSelectElement).value;
    this.refreshFilteredList();
  }
  
  onSearchChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.refreshFilteredList();
  }
  
  refreshFilteredList() {
    this.service.refreshList(this.selectedActiveStatus, this.selectedStatusType, this.searchText);
  }
  
  openEditModal(status: Status) {
    const modalRef = this.modalService.open(StatusAddEditComponent);
    modalRef.componentInstance.status = { ...status }; 
    modalRef.componentInstance.selectedValue = status.statusType;
  }
  
  DistrictStatusTypes(): string[] {
    return [...new Set(this.service.status.map((st) => st.statusType))];
  }
  
  
}
