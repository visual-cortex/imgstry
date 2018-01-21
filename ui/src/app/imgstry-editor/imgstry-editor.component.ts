import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { FilterOption } from '../../../../source/core/types/index';
import { Imgstry } from '../../../../source/core/imgstry.browser';

export interface ImgstryValues {
  brightness?: number;
  contrast?: number;
}
@Component({
  selector: 'app-imgstry-editor',
  templateUrl: './imgstry-editor.component.html',
  styleUrls: ['./imgstry-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgstryEditorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef;
  @Input()
  brightness: number;
  @Input()
  contrast: number;

  public processor: Imgstry;

  constructor(
    private renderer: Renderer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.processor) { return; }

    const options: FilterOption[] = [];
    if (changes['brightness']) {
      options.push({
        filter: 'brightness',
        value: this.brightness,
        priority: 1
      });
    }
    if (changes['contrast']) {
      options.push({
        filter: 'contrast',
        value: this.contrast,
        priority: 1
      });
    }
    this.processor.batch(options, true);
  }

  ngAfterViewInit() {
    this.renderer.setElementProperty(this.canvas.nativeElement, 'width', 300);
    this.renderer.setElementProperty(this.canvas.nativeElement, 'height', 300);
    this.processor = new Imgstry(this.canvas.nativeElement);
    this.processor.brightness(50);
    this.processor.reset();
  }
}
