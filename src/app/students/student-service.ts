import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { IStudent } from "./student";

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private studentUrl = 'api/students/student.json'

    constructor(private http: HttpClient) { }

    getStudents(): Observable<IStudent[]> {
        return this.http.get<IStudent[]>(this.studentUrl).pipe(
            tap(data => console.log('All', JSON.stringify(data))),
            catchError(this.handleError)
        );

    }

    getStudentsFromSession(): Observable<IStudent[]> {
        let students = JSON.parse(sessionStorage.getItem('students') ?? '') as IStudent[];
        console.log(students);
        return of(students);
    }

    getStudentByIdFromSession(id: number): IStudent {
        let students: IStudent[] = [];
        let errorMessage: string;

        this.getStudentsFromSession().subscribe({
            next: studentData => students = studentData,
            error: err => errorMessage = err
        });

        let index = students.findIndex(obj => obj.Id == id)
        return students[index];
    }

    addStudentToSession(student: IStudent): void {
        let students: IStudent[] = [];
        let errorMessage: string;
        debugger;
        this.getStudentsFromSession().subscribe({
            next: studentData => students = studentData,
            error: err => errorMessage = err
        });

        student.Id = students.length + 1;
        students.push(student);
        sessionStorage.setItem('students', JSON.stringify(students));
        console.log(students);
    }

    editStudentToSession(student: IStudent): void {
        let students: IStudent[] = [];
        let errorMessage: string;

        this.getStudentsFromSession().subscribe({
            next: studentData => students = studentData,
            error: err => errorMessage = err
        });
        debugger;
        let index = students.findIndex(obj => obj.Id == student.Id)
        students.splice(index, 1, student);
        sessionStorage.setItem('students', JSON.stringify(students));
    }

    deleteStudentFromSession(student: IStudent): void {
        let students: IStudent[] = [];
        let errorMessage: string;

        this.getStudentsFromSession().subscribe({
            next: studentData => students = studentData,
            error: err => errorMessage = err
        });
        let index = students.findIndex(obj => obj.Id == student.Id)
        alert('Deleting row of ' + student.FirstName)
        students.splice(index, 1);
        sessionStorage.setItem('students', JSON.stringify(students));
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occured : ${err.error.message}`;
        } else {
            errorMessage = `Server returned code : ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(errorMessage);
    }
}