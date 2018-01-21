import { Component } from '@angular/core';
import { ImgstryValues } from 'app/imgstry-editor/imgstry-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public value: ImgstryValues = {
    brightness: 0,
    contrast: 0
  };
}
