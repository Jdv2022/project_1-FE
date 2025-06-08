import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import {
	CalendarA11y,
	CalendarCommonModule,
	CalendarDateFormatter,
	CalendarDayModule,
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarEventTitleFormatter,
	CalendarModule,
	CalendarMonthModule,
	CalendarUtils,
	CalendarView,
	CalendarWeekModule,
	DateAdapter
} from 'angular-calendar';
import {
	addDays,
	addHours,
	endOfDay,
	endOfMonth,
	isSameDay,
	isSameMonth,
	startOfDay,
	subDays
} from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AttendanceService } from './attendance.service';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { NotificationModalComponent } from 'src/app/private/utilities/notification-modal/notification.modal.component';
import { LoadingModalComponent } from 'src/app/private/utilities/loading-modal/loading.modal.component';
import { RefreshComponent } from 'src/app/private/utilities/refresh/refresh.component';
  
const colors: any = {
	blue: {
	  primary: '#5c77ff',
	  secondary: '#FFFFFF'
	},
	yellow: {
	  primary: '#ffc107',
	  secondary: '#FDF1BA'
	},
	red: {
	  primary: '#f44336',
	  secondary: '#FFFFFF'
	}
};

interface calendarAddition { 
	timeIn: string, 
	timeOut: string, 
	timeInStatus: string, 
	timeOutStatus: string, 
	createdAt: string, 
}
  
@Component({
	selector: 'vex-attendance',
	templateUrl: './attendance.component.html',
	styleUrls: ['./attendance.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		MatButtonModule,
		CalendarCommonModule,
		MatIconModule,
		VexScrollbarComponent,
		NgSwitch,
		NgSwitchCase,
		CalendarMonthModule,
		CalendarWeekModule,
		CalendarDayModule,
		CalendarModule,
		MatSnackBarModule,
		RefreshComponent,
		CommonModule
	],
	providers: [
		{
			provide: DateAdapter,
			useFactory: adapterFactory
		},
		CalendarEventTitleFormatter,
		CalendarDateFormatter,
		CalendarUtils,
		CalendarA11y,
		AttendanceService,
	]
})

export class AttendanceComponent implements OnInit {
	@ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;
  
	view: CalendarView = CalendarView.Month;
	CalendarView = CalendarView;
	viewDate: Date = new Date();
	refresh: Subject<any> = new Subject();
	activeDayIsOpen = true;
	isClockInDisabled: boolean = false;
	isClockOutDisabled: boolean = false;
	timezone: string = '';
	currentBrowsedDate: string = '';
	isRefresh: boolean = false;
	currentBrowsedDateString: string = '';
	exactTime: string = '';

	constructor(
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private attendanceService: AttendanceService
	) {}

	ngOnInit(): void {
		this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const data = new ModelRequestBase();
		data.payload = {
			timezone: this.timezone
		};
		this.attendanceService.getDateAndTimeToday(data).subscribe(
			(response) => {
				this.viewDate = new Date(response.payload.date);
				this.getAttendace();
			}
		)
	}

	private getAttendace() {
		const data2 = new ModelRequestBase();
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		this.currentBrowsedDate = `${year}-${month}-${day}`;
		const date = new Date("2025-06-07");
		this.currentBrowsedDateString = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		data2.payload = {
			timezone: this.timezone,
			month: this.currentBrowsedDate,
		};
		this.attendanceService.getAttendance(data2).subscribe(
			(response) => {
				console.log(response)
				if((response.payload.dayToday ?? null) && (response.payload.attendance ?? null)) {
					const isClockedInToday = response.payload.attendance.find((
						u: { createdAt: string }) => u.createdAt == response.payload.dayToday
					);
					if((isClockedInToday.timeIn ?? null) && (isClockedInToday.timeOut ?? null)) {
						this.isClockInDisabled = true;
						this.isClockOutDisabled = true;
					}
					else if(isClockedInToday.timeIn ?? null) {
						this.isClockInDisabled = true;
					}
					else if(isClockedInToday.timeOut ?? null) {
						this.isClockOutDisabled = true;
					}
					response.payload.attendance.forEach((u: calendarAddition) => {
						this.insertTextElementToCalendarDays(u);
					});
				}
			}
		)
	}

	/*
	*	dom manipulation through components,
	*   calendar is a third party library and need this way to manipulate
	*/
	private insertTextElementToCalendarDays(u: calendarAddition) {
		const element = document.querySelector(`[aria-label="${u.createdAt}"]`);

		const wrapper1 = document.createElement('div');
		const wrapper2 = document.createElement('div');
		wrapper1.style.position = 'absolute';
		wrapper1.style.paddingLeft = '2px';
		wrapper1.style.bottom = '20px';         
		wrapper1.style.left = '3px';
		wrapper2.style.position = 'absolute';
		wrapper2.style.paddingLeft = '2px';
		wrapper2.style.bottom = '2px';         
		wrapper2.style.left = '3px';

		const timeInSpan = document.createElement('span');
		const timeIn = document.createElement('span');
		timeIn.textContent = ` ${u.timeIn ?? '-'}`;
		timeIn.classList.add('my-custom-style-green');
		timeIn.style.fontSize = 'clamp(0.75rem, .1vw, 1rem)';
		timeInSpan.textContent = 'Time In:';
		timeInSpan.classList.add('my-custom-style-small-text');
		timeInSpan.style.fontSize = 'clamp(0.75rem, .1vw, 1rem)';
		wrapper1.appendChild(timeInSpan);
		wrapper1.appendChild(timeIn);

		const timeOutSpan = document.createElement('span');
		const timeOut = document.createElement('span');
		timeOut.textContent = ` ${u.timeOut ?? '-'}`;
		timeOut.classList.add('my-custom-style-red');
		timeOut.style.fontSize = 'clamp(0.75rem, .1vw, 1rem)';
		timeOutSpan.textContent = 'Time Out:';
		timeOutSpan.classList.add('my-custom-style-small-text');
		timeOutSpan.style.fontSize = 'clamp(0.75rem, .1vw, 1rem)';
		wrapper2.appendChild(timeOutSpan);
		wrapper2.appendChild(timeOut);
		
		if(element) {
			element.classList.add('my-custom-style-text');
			element.appendChild(wrapper1);
			element.appendChild(wrapper2);
			let timeInSpanAttached = true;

			// Handle resize
			function handleResize() {
				const width = window.innerWidth;

				if (width < 800 && timeInSpanAttached) {
					wrapper1.removeChild(timeInSpan);
					wrapper2.removeChild(timeOutSpan);
					timeInSpanAttached = false;
				} 
				else if (width >= 800 && !timeInSpanAttached) {
					wrapper1.insertBefore(timeInSpan, timeIn);
					wrapper2.insertBefore(timeOutSpan, timeOut);
					timeInSpanAttached = true;
				}
			}

			// Listen to resize
			window.addEventListener('resize', handleResize);

			// Call once on load
			handleResize();
		}
	}

	onClockIn() {
		this.isRefresh = true;
		const loading = this.dialog.open(LoadingModalComponent, {
			width: '400px', 
			disableClose: true,
			data: { message: 'Clocking IN!' } 
		});
		let obj = new ModelRequestBase();
		obj.payload = {
			timezone: this.timezone
		}
		this.attendanceService.clockIn(obj).subscribe(
			(response) => {
				this.isRefresh = false;
				this.dialog.open(NotificationModalComponent, {
					width: '400px', 
					disableClose: true,
					data: { message: response.message } 
				}).afterClosed().subscribe(
					() => loading.close()
				);
			},
			(error) => {
				loading.close();
				this.isRefresh = false;
				this.dialog.open(NotificationModalComponent, {
					width: '400px',
					disableClose: true,
					data: { message: error.error.message }
				});
			}
		)
	}
  
	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			this.activeDayIsOpen = !(
				(isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0
			);
			this.viewDate = date;
		}
	}
  
	eventTimesChanged({
		event,
		newStart,
		newEnd
	}: CalendarEventTimesChangedEvent): void {
		// this.events = this.events.map((iEvent) => {
		// 	if (iEvent === event) {
		// 		return {
		// 			...event,
		// 			start: newStart,
		// 			end: newEnd
		// 		};
		// 	}
		// 	return iEvent;
		// });
	  	// this.handleEvent('Dropped or resized', event);
	}
  
	handleEvent(action: string, event: CalendarEvent): void {
	//   const dialogRef = this.dialog.open(CalendarEditComponent, {
	// 	data: event
	//   });
  
	//   dialogRef.afterClosed().subscribe((result) => {
	// 	if (result) {
	// 	  event = result;
	// 	  this.snackbar.open('Updated Event: ' + event.title);
	// 	  this.refresh.next(null);
	// 	}
	//   });
	}
  
	addEvent(): void {
		// this.events = [
		// 	...this.events,
		// 	{
		// 		title: 'New event',
		// 		start: startOfDay(new Date()),
		// 		end: endOfDay(new Date()),
		// 		color: colors.red,
		// 		draggable: true,
		// 		resizable: {
		// 			beforeStart: true,
		// 			afterEnd: true
		// 		}
		// 	}
	  	// ];
	}
  
	deleteEvent(eventToDelete: CalendarEvent) {
	  	// this.events = this.events.filter((event) => event !== eventToDelete);
	}
  
	setView(view: CalendarView) {
	  	this.view = view;
	}
  
	closeOpenMonthViewDay() {
	  	this.activeDayIsOpen = false;
	}
}
  