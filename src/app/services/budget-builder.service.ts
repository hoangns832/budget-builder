import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableData } from '../interfaces/table-data';

@Injectable({
  providedIn: 'root'
})
export class BudgetBuilderService {

  private tableData$: BehaviorSubject<TableData[]> = new BehaviorSubject<TableData[]>([]);

  constructor() { }

  tableDataObs() {
    return this.tableData$.asObservable();
  }

  getTableData() {
    return this.tableData$.getValue();
  }

  setTableData(tableData: TableData[]) {
    this.tableData$.next(tableData);
  }
}
