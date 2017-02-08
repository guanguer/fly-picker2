# fly-picker2

[![Build Status](https://travis-ci.org/guanguer/fly-picker2.svg?branch=master)](https://travis-ci.org/guanguer/fly-picker2)

Angular2 date picker module - Work in progress...

## Demo
* You can look at the live demo [Here](https://guanguer.github.io/fly-picker2)

## Installation
* In your Angular2 project run
```bash
$ npm install --save fly-picker2
```

## Usage

* In your Angular2 module, import the fly-picker2 module
```ts
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FlyPickerModule } from 'fly-picker2';

import { AppComponent } from './app.component';

@NgModule({
  imports: [ BrowserModule, FlyPickerModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

* Add the component selector to your html
```html
<fly-picker (dateChanged)="onDateChanged($event)"></fly-picker>
```

* Register the event listener in your component
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'root-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  startDate: string;
  endDate: string;

  onDateChanged(range) {
    this.startDate = range.start;
    this.endDate = range.end;
  }
}
```

* You can find a full example on the [repository](https://github.com/guanguer/fly-picker2-demo)

## TO-DO
* Resolve issues with tab navigation and key events
* Enable tab navigation between months
* Add a bunch of tests
* Collect coverage metrics
* Capability of overriding css styles
* Test in older browsers
* Responsive capabilities
* Get rid of some bugs
* ...
