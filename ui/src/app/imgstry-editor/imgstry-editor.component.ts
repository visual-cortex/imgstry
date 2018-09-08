import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { FilterOption } from '../../../../source/core/types/index';
import { Imgstry } from '../../../../source/browser/imgstry.browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

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
export class ImgstryEditorComponent implements OnInit, OnChanges {
  @ViewChild('canvas')
  canvas: ElementRef;
  @Input()
  set src(url: string) {
    this.loadImage(url);
  }
  @Input()
  brightness: number;
  @Input()
  contrast: number;

  public processor: Imgstry;

  constructor(
    private renderer: Renderer,
    private cd: ChangeDetectorRef,
    private zone: NgZone
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

  private loadImage(url: string): Observable<boolean> {
    const observer: Subject<boolean> = new Subject();

    this.zone.runOutsideAngular(() => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        this.renderer.setElementProperty(this.canvas.nativeElement, 'width', image.width);
        this.renderer.setElementProperty(this.canvas.nativeElement, 'height', image.height);
        this.processor = new Imgstry(this.canvas.nativeElement);
        this.processor.drawImage(image);
        observer.next(!!this.processor);
        observer.complete();
      };
      image.src = url;
    });

    return observer.asObservable();
  }
}
