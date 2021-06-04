import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };
  constructor(private fb: FormBuilder,
    private studentSerice: StudentService,
    private router: Router,
    private studentListComponent : StudentListComponent) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      formNo: ['', [Validators.required]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, { validator: emailMatcher }),
      course: ['', Validators.required]
    })

    const emailControl = this.studentForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );
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

    let student = {
      "FirstName": this.studentForm.get('firstName')?.value,
      "LastName": this.studentForm.get('lastName')?.value,
      "FormNo": this.studentForm.get('formNo')?.value,
      "Email": this.studentForm.get('emailGroup.email')?.value,
      "Course": this.studentForm.get('course')?.value
  } as IStudent;

    console.log(student);
    this.studentSerice.addStudentToSession(student);
    this.studentListComponent.refreshData();
    // window.location.reload()
    // this.router.navigateByUrl('/students')
  }
}
