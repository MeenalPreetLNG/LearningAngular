import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Location } from '@angular/common';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router, RouterLinkWithHref, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { DebugElement } from '@angular/core';


describe('AppComponent', () => {

  const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
  ];


  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        WelcomeComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule,              
        RouterTestingModule.withRoutes(routes)
      ], 
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  });
  beforeEach(() => {

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    router.initialNavigation();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'learn'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.pageTitle).toEqual('learn');
  });


  it('should test redirection to default path (async)', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/welcome');
 
  }));

});
