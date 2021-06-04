import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { IStudent } from './student';
import { StudentService } from './student-service';

@Component({
  selector: 'pm-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})

export class StudentListComponent implements OnInit {
  constructor(private studentService: StudentService) { }
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  sub!: Subscription;
  studentData: IStudent[] = [];
  errorMessage: string = "";
  columnDefs = [
    { field: 'FirstName' },
    { field: 'LastName' },
    { field: 'FormNo' },
    { field: 'Email' },
    { field: 'Course' },
  ];


  ngOnInit(): void {
    // this.sub = this.studentService.getStudents().subscribe({
    //   next: studentData => this.studentData = studentData,
    //   error: err => this.errorMessage = err
    // });

    this.refreshData();
  }

  getSelectedRows(): void {
    // debugger;
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    // const selectedDataStringPresentation = selectedData.map(node => `${node.FormNo} ${node.FirstName}`).join(', ');

    // alert(`Selected value: ${selectedDataStringPresentation}`);
    alert(`Selected Row : ${JSON.stringify(selectedData)}`)
  }

  refreshData(): void {
    this.sub = this.studentService.getStudentsFromSession().subscribe({
      next: studentData => this.studentData = studentData,
      error: err => this.errorMessage = err
    });

    console.log(this.studentData);
  }

  ngOnDestory() {
    this.sub.unsubscribe();
  }

}
