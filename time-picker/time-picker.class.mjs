import _element from './utils/element.mjs';

export default class TimePicker {
    element = {};
    hours = '12';
    minutes = '00';
    name = 'time';
    value = '12:00';

    constructor(instance) {
        this.build(instance);
        document.addEventListener('click', (event) => {
            const isTimePicker = event.target.closest('time-picker') === this.element;
            if (!isTimePicker) {
                this.element.querySelector('.time-picker-dialog').removeAttribute('active');
            }
        });
    }

    addFocus = (event) => {
        this.element.classList.add('focus');
    }

    removeFocus = (event) => {
        this.element.classList.remove('focus');
    }

    updateTimeInputField = (event, type) => {
        const target = event.target.classList.contains('text') ? event.target.parentElement : event.target;
        this.element.querySelectorAll('.minute, .hour').forEach((element) => {
            element.classList.remove('active');
        })
        if ((event.type === 'mouseover' && event.buttons === 1) || event.type === 'click') {
            const value = target.getAttribute('value') || target.parentElement.getAttribute('value');
            target.classList.add('active');
            this.element.querySelector('.digital-' + type).textContent = this._padNumber(value);
            this.handleTimeChangeInDialog();
        }
    }

    toggleClockface = (event, unit) => {
        const target = event.target;
        this.element.querySelectorAll('.clockface-type[unit], .hour-minute div[unit]').forEach((element) => {
            element.removeAttribute('active');
        });
        this.element.querySelectorAll('.clockface-type[unit="' + unit + '"], .hour-minute div[unit="' + unit + '"]').forEach((element) => {
            element.setAttribute('active', '');
        });
    }

    toggleAnalog = (event) => {
        const target = event.target;
        const dialog = this.element.querySelector('.time-picker-dialog');
        if (dialog.hasAttribute('active')) {
            dialog.removeAttribute('active');
            this.removeFocus();
        } else {
            dialog.setAttribute('active', '');
            this.addFocus();
        }
    }

    handleTimeChangeInDialog = () => {
        const inputTime = this.element.querySelector('input[type="time"]');
        let hour = this.element.querySelector('.digital-hour').textContent;
        let minute = this.element.querySelector('.digital-minute').textContent;
        inputTime.value = this._convertTime(hour, minute, null, 'military');
    }

    handleTimeChangeInDialogMeridiem = (event) => {
        const target = event.target;
        const meridiem = target.getAttribute('meridiem');
        const inputTime = this.element.querySelector('input[type="time"]');
        let hour = this.element.querySelector('.digital-hour').textContent;
        let minute = this.element.querySelector('.digital-minute').textContent;
        inputTime.value = this._convertTime(hour, minute, meridiem, 'military');

        this._toggleMeridiem(meridiem);
    }

    handleInputChange = () => {
        const value = this.element.querySelector('input.text-input').value;
        const digitalHour = this.element.querySelector('.hour-minute .digital-hour');
        const digitalMinute = this.element.querySelector('.hour-minute .digital-minute');
        let hour = this._parse12HourTime(value.split(':')[0]);
        let minute = value.split(':')[1];
        digitalHour.textContent = this._padNumber(hour);
        digitalMinute.textContent = this._padNumber(minute);
        this._toggleMeridiem();
    }

    build(instance) {
        this.element = instance;

        if (this.element.hasAttribute('name')) {
            this.name = this.element.getAttribute('name');
        }

        if (this.element.hasAttribute('value')) {
            this.value = this.element.getAttribute('value');
        }

        const minutes = [];
        const hours = [];
        const minuteSpacing = 360 / 60;
        const hourSpacing = 360 / 12;

        // Create component elements
        const inputWrapper = _element('div', 'text-input-wrapper');
        const input = _element('input', 'text-input', {
            type: 'time',
            name: this.name,
            value: this.value
        });
        const icon = _element('i', 'icon-clock');
        const dialogWrapper = _element('div', ['time-picker-dialog']);
        const digitalWrapper = _element('div', ['digital']);
        const hourMinuteWrapper = _element('div', ['hour-minute'])
        const amPmWrapper = _element('div', ['am-pm']);
        const digitalHours = _element('div', ['digital-hour'], {
            unit: 'hour',
            active: ''
        }, this.hours);
        const separator = _element('div', ['hour-minute-separator'], {}, ':');
        const digitalMinutes = _element('div', ['digital-minute'], {
            unit: 'minute'
        }, this.minutes);
        const digitalAm = _element('div', [], {
            meridiem: 'am'
        }, 'AM');
        const digitalPm = _element('div', [], {
            meridiem: 'pm',
            active: ''
        }, 'PM');
        const pickerAnalog = _element('div', ['analog']);
        const pickerClock = _element('div', ['clockface']);
        const pickerHours = _element('div', ['clockface-type'], {
            unit: 'hour',
            active: ''
        });
        const pickerMinutes = _element('div', ['clockface-type'], {
            unit: 'minute'
        });

        // Build component structure
        inputWrapper.prepend(input, icon);
        this.element.prepend(inputWrapper);
        amPmWrapper.prepend(digitalAm, digitalPm);
        hourMinuteWrapper.prepend(digitalHours, separator, digitalMinutes);
        digitalWrapper.prepend(hourMinuteWrapper, amPmWrapper);
        pickerAnalog.prepend(pickerMinutes, pickerHours, pickerClock);
        dialogWrapper.prepend(digitalWrapper, pickerAnalog);
        this.element.append(dialogWrapper);

        // Update dialog values with input value
        this.handleInputChange();

        // Fill minutes
        for (let i = 0; i < 60; i++) {
            minutes.push(i);
        }

        // Fill hours
        for (let i = 1; i < 13; i++) {
            hours.push(i);
        }

        // Add hour elements
        hours.forEach((hour, index) => {
            let hourElement = _element('div', ['hour', 'hour-' + hour], {
                style: `transform: rotate(${hourSpacing * hour}deg)`,
                value: hour
            });
            let hourTextElement = _element('span', ['text', 'hour-' + hour + '-text'], {
                style: `transform: rotate(-${hourSpacing * hour}deg)`
            });
            hourTextElement.textContent = hour;
            hourElement.append(hourTextElement);
            pickerHours.append(hourElement);
        });

        // Add minute elements
        minutes.forEach((minute, index) => {
            let minuteElement = _element('div', ['minute', 'minute-' + minute], {
                style: `transform: rotate(${minuteSpacing * minute}deg)`,
                value: minute
            });
            let minuteTextElement = _element('span', ['text', 'minute-' + minute + '-text'], {
                style: `transform: rotate(-${minuteSpacing * minute}deg)`
            });
            minuteTextElement.textContent = minute % 5 === 0 ? minute : '';
            minuteElement.append(minuteTextElement);
            pickerMinutes.append(minuteElement);
        });

        // Attach all the events...
        this.element.querySelectorAll('.hour').forEach((element) => {
            element.addEventListener('click', (event) => this.updateTimeInputField(event, 'hour'));
            element.addEventListener('mouseover', (event) => this.updateTimeInputField(event, 'hour'));
        });

        this.element.querySelectorAll('.minute').forEach((element) => {
            element.addEventListener('click', (event) => this.updateTimeInputField(event, 'minute'));
            element.addEventListener('mouseover', (event) => this.updateTimeInputField(event, 'minute'));
        });

        this.element.querySelectorAll('.hour-minute div[unit]').forEach((element) => {
            element.addEventListener('click', (event) => this.toggleClockface(event, event.target.getAttribute('unit')));
        });

        this.element.querySelectorAll('.hour-minute input').forEach((element) => {
            element.addEventListener('change', this.handleTimeChangeInDialog);
        });

        this.element.querySelectorAll('.am-pm div[meridiem]').forEach((element) => {
            element.addEventListener('click', (event) => this.handleTimeChangeInDialogMeridiem(event));
        });

        this.element.querySelector('.icon-clock').addEventListener('click', this.toggleAnalog);

        this.element.querySelector('input.text-input').addEventListener('change', this.handleInputChange);
        this.element.querySelector('input.text-input').addEventListener('focus', this.addFocus);
        this.element.querySelector('input.text-input').addEventListener('blur', this.removeFocus);
    }

    _padNumber(num) {
        return num.toString().length < 2 ? 0 + num.toString() : num.toString();
    }

    _parse12HourTime = (hour) => {
        let hourInt = parseInt(hour, 10);

        return hourInt > 12 ? (hour - 12).toString() : hourInt === 0 ? '12' : hour.toString();
    }

    _convertTime = (h = null, m = null, a = null, format = null) => {
        let time = {};
        let output = {};
        let hour = parseInt(h, 10) || parseInt(this.element.querySelector('.digital-hour').textContent, 10);
        let minute = parseInt(m, 10) || parseInt(this.element.querySelector('.digital-minute').textContent, 10);
        let meridiem = a || this.element.querySelector('div[meridiem][active]').getAttribute('meridiem');

        time.minute = this._padNumber(minute).toString();

        if (meridiem === 'am' && hour < 12) {
            time.hour12 = time.hour24 = this._padNumber(hour).toString();
        }

        // if (meridiem === 'am' && hour > 12)

        if (meridiem === 'am' && hour === 12) {
            time.hour12 = '12';
            time.hour24 = '00';
        }

        if (meridiem === 'pm' && hour < 12) {
            time.hour12 = this._padNumber((hour));
            time.hour24 = this._padNumber((hour + 12).toString());
        }

        if (meridiem === 'pm' && hour === 12) {
            time.hour12 = time.hour24 = '12';
        }

        time.standard = `${time.hour12}:${time.minute}`;
        time.military = `${time.hour24}:${time.minute}`;

        switch (format) {
            case 'standard':
                output = time.standard;
                break;

            case 'military':
                output = time.military;
                break;

            default:
                output = time;
        }

        return output;
    }



    _toggleMeridiem = (meridiem = null) => {
        const inputTime = this.element.querySelector('input[type="time"').value;
        const active = this.element.querySelectorAll('.am-pm div[meridiem]').forEach((element) => {
            element.removeAttribute('active');
        });

        if (meridiem) {
            this.element.querySelector('.am-pm div[meridiem="' + meridiem + '"]').setAttribute('active', '');
        } else {
            parseInt(inputTime.split(':')[0], 10) > 11 ? this._toggleMeridiem('pm') : this._toggleMeridiem('am');
        }
    }
}
