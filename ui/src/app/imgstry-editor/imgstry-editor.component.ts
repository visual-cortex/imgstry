import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ViewChild, Renderer, Input } from '@angular/core';
import { Imgstry } from '../../../../source/core/imgstry.browser';

@Component({
  selector: 'app-imgstry-editor',
  templateUrl: './imgstry-editor.component.html',
  styleUrls: ['./imgstry-editor.component.scss']
})
export class ImgstryEditorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef;
  processor: Imgstry;
  @Input('brightness-value') bValue: number;

  constructor(private renderer: Renderer) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.processor)
      return;
    if (changes['bValue']) {
      this.processor.reset();
      this.processor.brightness(this.bValue);
    }
  }

  ngAfterViewInit() {
    this.renderer.setElementProperty(this.canvas.nativeElement, 'width', 300);
    this.renderer.setElementProperty(this.canvas.nativeElement, 'height', 300);
    this.processor = new Imgstry(this.canvas.nativeElement);
    this.processor.brightness(50);
    this.processor.reset();
  }
}
