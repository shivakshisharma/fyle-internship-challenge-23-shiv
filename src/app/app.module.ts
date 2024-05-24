import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Example import

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule to imports
    HttpClientModule // Ensure that HttpClientModule is imported correctly

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
