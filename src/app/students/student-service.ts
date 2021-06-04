import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
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

    getStudentsFromSession(): IStudent[] {
        let students = JSON.parse(sessionStorage.getItem('students') ?? '') as IStudent[];
        console.log(students);
        return students;
    }

    addStudentToSession(student: string): void {
        let students = this.getStudentsFromSession();
        students.push(JSON.parse(student));
        sessionStorage.setItem('students', JSON.stringify(students));
        console.log(students);
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