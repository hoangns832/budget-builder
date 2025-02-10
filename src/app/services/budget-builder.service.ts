import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BudgetCategory, SelectionCell } from '../interfaces/table-data';

@Injectable({
  providedIn: 'root',
})
export class BudgetBuilderService {
  private tableData$: BehaviorSubject<BudgetCategory[]> = new BehaviorSubject<
    BudgetCategory[]
  >([]);
  private selectionCell$: BehaviorSubject<SelectionCell> =
    new BehaviorSubject<SelectionCell>({ row: 0, column: 0 });

  constructor() {}

  tableDataObs() {
    return this.tableData$.asObservable();
  }

  getTableData() {
    return this.tableData$.getValue();
  }

  setTableData(tableData: BudgetCategory[]) {
    this.tableData$.next(tableData);
  }

  getSelectionCell() {
    return this.selectionCell$.getValue();
  }

  setSelectionCell(selectionCell: SelectionCell) {
    this.selectionCell$.next(selectionCell);
  }
}
