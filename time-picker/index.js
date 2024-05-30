import TimePicker from './time-picker.class.mjs';

document.querySelectorAll('time-picker').forEach((element) => {
    element = new TimePicker(element);
});
