import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { IStudent } from './student';
import { StudentListComponent } from './student-list.component';
import { StudentService } from './student-service';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'pm-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css']
})

export class StudentAddComponent implements OnInit {
  studentForm!: FormGroup;
  emailMessage!: string;
  student!: IStudent;
  title: string = 'Add New Student';

  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };
  constructor(private fb: FormBuilder,
    private studentSerice: StudentService,
    private studentListComponent: StudentListComponent,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.student = this.studentSerice.getStudentByIdFromSession(id);
      this.title = 'Edit Student';
    }

    this.initializeForm(this.student);

    const emailControl = this.studentForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );
  }

  initializeForm(student: IStudent) {
    this.studentForm = this.fb.group({
      firstName: [student?.FirstName, [Validators.required, Validators.minLength(3)]],
      lastName: [student?.LastName, [Validators.required, Validators.maxLength(50)]],
      formNo: [student?.FormNo, [Validators.required]],
      emailGroup: this.fb.group({
        email: [student?.Email, [Validators.required, Validators.email]],
        confirmEmail: [student?.Email, Validators.required]
      }, { validator: emailMatcher }),
      course: [student?.Course, Validators.required]
    })
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  save(): void {
    console.log(this.studentForm);
    console.log('Saved: ' + JSON.stringify(this.studentForm.value));

    let studentEdited = {
      "FirstName": this.studentForm.get('firstName')?.value,
      "LastName": this.studentForm.get('lastName')?.value,
      "FormNo": this.studentForm.get('formNo')?.value,
      "Email": this.studentForm.get('emailGroup.email')?.value,
      "Course": this.studentForm.get('course')?.value
    } as IStudent;

    console.log(studentEdited);
    if (this.student == null) {
      this.studentSerice.addStudentToSession(studentEdited);
      window.location.reload();
    }
    else {
      studentEdited.Id = this.student.Id;
      this.studentSerice.editStudentToSession(studentEdited);
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      }
      this.router.navigate(['/students'])
    }

    // this.studentListComponent.refreshData();
    // this.title = "Add New Student";
    // this.student = {} as IStudent;
    // this.initializeForm(this.student);
    // window.location.reload()
    
  }
}
