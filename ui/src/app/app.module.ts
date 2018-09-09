import 'hammerjs';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImgstryEditorComponent } from './imgstry-editor/imgstry-editor.component';
import { MatSliderModule } from '@angular/material/slider';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    ImgstryEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
