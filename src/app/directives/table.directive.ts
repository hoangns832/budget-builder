import { Directive, ElementRef, HostListener } from '@angular/core';
import { BudgetBuilderService } from '../services/budget-builder.service';

@Directive({
  selector: '[appTable]',
})
export class TableDirective {
  constructor(
    private el: ElementRef,
    private budgetBuilderService: BudgetBuilderService
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.budgetBuilderService.setTableData([
          ...this.budgetBuilderService.getTableData(),
          { income: 0, expense: 0 },
        ]);
        this.handleArrowKey('ArrowDown');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.handleArrowKey(event.key);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.handleArrowKey(event.key);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.handleArrowKey(event.key);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.handleArrowKey(event.key);
        break;
    }
  }

  private handleArrowKey(key: string) {
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      const currentCell = this.el.nativeElement.closest('td');
      const currentRow = currentCell.parentElement;
      const table = currentRow.closest('table');
      const rowIndex = currentRow.rowIndex;
      const cellIndex = currentCell.cellIndex;
      const newRowIndex = key === 'ArrowDown' ? rowIndex + 1 : rowIndex - 1;
      newRowIndex < table.rows.length &&
        table.rows[newRowIndex].cells[cellIndex]?.focus();
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    const textLength = this.el.nativeElement.textContent.length ?? 0;

    const newRange = document.createRange();
    if (key === 'ArrowLeft') {
      if (startOffset === 0) {
        this.el.nativeElement.previousElementSibling.focus();
        return;
      }
      newRange.setStart(range.startContainer, startOffset - 1);
      newRange.setEnd(range.endContainer, endOffset - 1);
    }

    if (key === 'ArrowRight') {
      if (endOffset === textLength) {
        this.el.nativeElement.nextElementSibling.focus();
        return;
      }
      newRange.setStart(range.startContainer, startOffset + 1);
      newRange.setEnd(range.endContainer, endOffset + 1);
    }
    newRange.collapse();
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
