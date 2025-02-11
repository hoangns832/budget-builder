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
        const { row, table } = this.getCellIndex();
        let tableData = this.budgetBuilderService.getTableData();
        tableData.forEach((data, index) => {
          if (data.name === table.rows[row].cells[1].textContent) {
            tableData.push({ name: '' });
            return;
          } else {
            if (
              data.subCategories?.some(
                (subCategory) =>
                  subCategory.name === table.rows[row].cells[1].textContent
              )
            ) {
              tableData[index].subCategories?.push({ name: '', values: {} });
              return;
            }
          }
        });
        this.budgetBuilderService.setTableData(tableData);
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

  @HostListener('input')
  onInput() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    setTimeout(() => {
      const newRange = document.createRange();
      newRange.setStart(range.startContainer, startOffset);
      newRange.setEnd(range.endContainer, endOffset);
      newRange.collapse();
      selection.removeAllRanges();
      selection.addRange(newRange);
    })
  }

  @HostListener('focus', [''])
  onFocus() {
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
      let newRowIndex = key === 'ArrowDown' ? rowIndex + 1 : rowIndex - 1;
      while (newRowIndex > 1 && newRowIndex < table.rows.length - 5) {
        if (
          table.rows[newRowIndex].cells[cellIndex].contentEditable === 'true'
        ) {
          break;
        }
        key === 'ArrowDown' ? newRowIndex++ : newRowIndex--;
      }
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
