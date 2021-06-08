import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { BtnCellRenderer } from './button-renderer.component';
import { IStudent } from './student';
import { StudentAddComponent } from './student-add.component';
import { StudentService } from './student-service';

@Component({
  selector: 'pm-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})

export class StudentListComponent implements OnInit {
  sub!: Subscription;
  studentData: IStudent[] = [];
  errorMessage: string = "";
  frameworkComponents: any;

  constructor(private studentService: StudentService,
    private router: Router) {
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    }
  }
  @ViewChild('agGrid') agGrid!: AgGridAngular;


  defaultColDef = {
    sortable: true,
    filter: true,
    suppressSizeToFit: true
  };

  columnDefs = [
    // { field: 'Id', checkboxSelection: true, width:'100px' },
    { field: 'FirstName', checkboxSelection: true },
    { field: 'LastName', width: '150px' },
    { field: 'FormNo', width: '150px' },
    { field: 'Email' },
    { field: 'Course', width: '150px' },
    {
      field: 'Edit',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: 'Edit',
        cls: 'btn btn-primary btn-sm fa fa-edit'
      },
      width: '80px',
      filter: false,
      sortable: false
    },
    {
      field: 'Delete',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDeleteButtonClick.bind(this),
        label: 'Delete',
        cls: 'btn btn-danger btn-sm fa fa-remove'
      },
      width: '100px',
      filter: false,
      sortable: false
    }
  ];

  onDeleteButtonClick(params: any) {
    debugger;
    let student = params.data as IStudent
    this.studentService.deleteStudentFromSession(student);
    this.refreshData();
  }

  onEditButtonClick(params: any) {
    debugger;
    let student = params.data as IStudent;
    this.router.navigate(['/students/' + student.Id])
  }

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
