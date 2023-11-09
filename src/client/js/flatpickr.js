
import flatpickr from "flatpickr";
// and and export date picker in project
flatpickr(".flatpickr.js-flatpickr-dateTime", {
    enableTime: false,
    altInput: true,
    altFormat: 'd M Y',
    dateFormat: 'Y-m-d',
})

export { flatpickr }