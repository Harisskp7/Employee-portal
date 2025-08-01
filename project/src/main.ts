import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});