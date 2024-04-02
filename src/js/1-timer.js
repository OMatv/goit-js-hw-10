// Функція для підрахунку різниці між датами
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

// Функція для оновлення таймера
function updateTimer(deadline) {
  const timer = document.querySelector('.timer');

  function updateClock() {
    const t = getTimeRemaining(deadline);

    timer.querySelector('[data-days]').textContent = addLeadingZero(t.days);
    timer.querySelector('[data-hours]').textContent = addLeadingZero(t.hours);
    timer.querySelector('[data-minutes]').textContent = addLeadingZero(
      t.minutes
    );
    timer.querySelector('[data-seconds]').textContent = addLeadingZero(
      t.seconds
    );

    if (t.total <= 0) {
      clearInterval(timeinterval); // Зупинка таймера
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

// Обробник події кліку на кнопці Start
document.querySelector('[data-start]').addEventListener('click', function () {
  const deadline = document.getElementById('datetime-picker').value;
  updateTimer(deadline);
  document.querySelector('[data-start]').disabled = true;
  document.getElementById('datetime-picker').disabled = true;
});

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let userSelectedDate; // Оголошення змінної поза методу onClose для зберігання обраної дати

// Об'єкт параметрів для Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // Метод onClose, який викликається при закритті календаря
    userSelectedDate = selectedDates[0]; // Зберігаємо обрану користувачем дату
    const currentDate = new Date(); // Поточна дата
    // Перевірка обраної дати
    if (userSelectedDate < currentDate) {
      // Якщо обрана дата у минулому
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      document.querySelector('[data-start]').disabled = true; // Робимо кнопку "Start" неактивною
    } else {
      // Якщо обрана дата у майбутньому
      document.querySelector('[data-start]').disabled = false; // Робимо кнопку "Start" активною
    }
  },
};

// Ініціалізація Flatpickr на полі введення з id="datetime-picker" з використанням об'єкта options
flatpickr('#datetime-picker', options);

// Функція для переведення мілісекунд в об'єкт {days, hours, minutes, seconds}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
