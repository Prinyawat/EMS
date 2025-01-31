import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserRoutingModule } from './manage-user-routing.module';
import { ManageUserComponent } from './manage-user.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';


@NgModule({
  imports: [
    CommonModule,
    ManageUserRoutingModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    BreadcrumbModule,
    TagModule,
    ConfirmPopupModule,
    DataViewModule,
    FormsModule,
    TableModule,
    RatingModule,
    SliderModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
  ],
  declarations: [ManageUserComponent,],
  providers: [ConfirmationService]
})
export class ManageUserModule {}
