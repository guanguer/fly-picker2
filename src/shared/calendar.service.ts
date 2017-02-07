import { Injectable } from "@angular/core";

@Injectable()
export class CalendarService {

  private YEAR_MONTHS: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  private WEEK_DAYS: Array<string> = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];

  getYearMonths() {
    return this.YEAR_MONTHS;
  }

  getWeekDays() {
    return this.WEEK_DAYS;
  }

}