import { Component, ElementRef, OnInit } from '@angular/core';
import { Day } from './model';
import { CalendarService } from './shared';

@Component({
  selector: 'fly-picker',
  templateUrl: './fly-picker.component.html',
  styleUrls: ['./fly-picker.component.css']
})
export class FlyPickerComponent implements OnInit {
  weekDays: Array<string>;

  departureDate: Day;
  returnDate: Day;
  departureDay: String = '';
  returnDay: String = '';
  startDate: Day;
  selectedDate: Day;
  today: Day;

  showCalendar: boolean = false;
  departure: boolean = false;

  constructor(private _elementRef: ElementRef, private calendarService: CalendarService) {}

  ngOnInit() {
    this.initValues();
  }

  initValues() {
    this.weekDays = this.calendarService.getWeekDays();
    let day = new Date();
    this.today = {
      day: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      dayOfWeek: day.getDay()
    };
    this.departureDate = this.today;
    this.returnDate = this.today;
    this.selectedDate = this.today;
    this.setDepartureDay();
    this.setReturnDay();
  }

  openCalendar() {
    this.showCalendar = true;
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  setDepartureDay() {
    this.departureDay = this.format(this.departureDate);
  }

  setReturnDay() {
    this.returnDay = this.format(this.returnDate);
  }

  format(day: Day) {
    let month = this.formatZeroAhead(day.month + 1);
    let date = this.formatZeroAhead(day.day);
    let dayOfWeek = this.weekDays[day.dayOfWeek];
    return `${dayOfWeek} ${date}/${month}`;
  }

  formatZeroAhead(num: number) {
    return num < 10 ? `0${num}`  : `${num}`;
  }

  onDepartureInputClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.openDepartureCalendar();
  }

  openDepartureCalendar() {
    if (!this.showCalendar) {
      this.departure = true;
      this.startDate = this.today;
      this.selectedDate = this.departureDate;
      this.openCalendar();
    }
  }

  onReturnInputClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.openReturnCalendar();
  }

  openReturnCalendar() {
    if (!this.showCalendar) {
      this.departure = false;
      this.startDate = this.departureDate;
      this.selectedDate = this.returnDate;
      this.openCalendar();
    }
  }

  onDaySelected(day: Day) {
    if (this.departure) {
      this.departureDate = day;
      this.returnDate = day;
      this.setDepartureDay();
      this.setReturnDay();
    } else {
      this.returnDate = day;
      if (this.isReturnDateBefore()) {
        this.departureDate = this.returnDate;
      }
      this.setReturnDay();
    }
    this.closeCalendar();
  }

  onClickOutside() {
    this.closeCalendar();
  }

  isReturnDateBefore() {
    let start = `${this.departureDate.year}${this.departureDate.month}${this.departureDate.day}`;
    let end = `${this.returnDate.year}${this.returnDate.month}${this.returnDate.day}`;

    return parseInt(start) > parseInt(end);
  }

}
