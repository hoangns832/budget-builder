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
          {
            id: 1,
            category: 'Income',
            subCategories: [''],
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0,
          },
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

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    const { row, column } = this.getCellIndex();
    this.budgetBuilderService.setSelectionCell({ row, column });
  }

  private getCellIndex() {
    const currentCell = this.el.nativeElement.closest('td');
    const currentRow = currentCell.parentElement;
    const table = currentRow.closest('table');
    return {
      row: currentRow.rowIndex,
      column: currentCell.cellIndex,
      table,
    };
  }

  private handleArrowKey(key: string) {
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      const { row: rowIndex, column: cellIndex, table } = this.getCellIndex();
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
