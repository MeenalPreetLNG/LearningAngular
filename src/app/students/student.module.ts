import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './student-list.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { StudentAddComponent } from './student-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import 'ag-grid-enterprise'
import { BtnCellRenderer } from './button-renderer.component';


@NgModule({
  declarations: [
    StudentListComponent,
    StudentAddComponent,
    BtnCellRenderer
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([BtnCellRenderer]),
    RouterModule.forChild([
      { path: 'students', component: StudentListComponent },
      { path: 'students/:id', component: StudentListComponent }
    ])
  ]
})
export class StudentModule { }
