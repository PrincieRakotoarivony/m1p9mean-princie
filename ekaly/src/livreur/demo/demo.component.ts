import { Component, ElementRef, ViewChild } from '@angular/core';
import { DropEvent, DroppableDirective, ValidateDrop } from 'angular-draggable-droppable';


@Component({
  selector: 'mwl-demo-app',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  droppedData: string = '';
  droppedData2: string = '';

  @ViewChild(DroppableDirective, { read: ElementRef, static: true })
  droppableElement: ElementRef | undefined;

  onDrop({ dropData }: DropEvent<string>): void {
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

  onDrop2({ dropData }: DropEvent<string>): void {
    this.droppedData2 = dropData;
    setTimeout(() => {
      this.droppedData2 = '';
    }, 2000);
  }

  validateDrop: ValidateDrop = ({ target }) =>
    this.droppableElement?.nativeElement.contains(target as Node);
}