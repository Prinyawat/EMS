import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Status } from '../shared/status.model';
import { StatusService } from '../shared/status.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-status-add-edit',
  templateUrl: './status-add-edit.component.html',
  styles: ``,
  
})
export class StatusAddEditComponent implements OnInit{

  status: Status = new Status();
  statusList: Status[] = [];
  selectedValue: any;
  constructor(public activeModal: NgbActiveModal, private statusService: StatusService) {}


onSubmit(form: NgForm) {
  this.status.statusType = this.selectedValue;
  if (form.valid) {
    if (this.status.statusId == null || this.status.statusId === 0) {
      this.insertStatus(form);
    } else {
      this.updateStatus(form);
    }
  } 
}

insertStatus(form: NgForm) {
  this.statusService.formData = this.status;
  this.statusService.postStatus().subscribe({
    next: () => {
      this.statusService.refreshList();
      console.log('Status inserted successfully');
      this.close('Save click');
    },
    error: (err) => {
      console.error('Error during status insertion:', err);
    }
  });
}

updateStatus(form: NgForm) {
  this.statusService.formData = this.status;
  this.statusService.putStatus().subscribe({
    next: () => {
      this.statusService.refreshList();
      console.log('Status updated successfully');
      this.close('Save click');
    },
    error: (err) => {
      console.error('Error during status update:', err);
    }
  });
 }

  ngOnInit() {
    this.getStatuses(); 
  }

  getStatuses() {
    this.statusService.refreshList();
    this.statusList = this.statusService.status; 
  }

  
  close(reason: string) {
    this.activeModal.close(reason);
  }

  dismiss(reason: string) {
    this.activeModal.dismiss(reason);
  }

  DistrictStatusTypes(): string[] {
    return [...new Set(this.statusList.map((st) => st.statusType))];
  }
  
}

