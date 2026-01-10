import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutModule } from './layouts/layout.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
