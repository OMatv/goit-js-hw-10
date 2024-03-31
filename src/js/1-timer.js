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
function updateTimer() {
  const deadline = document.getElementById('datetime-picker').value;
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
      clearInterval(timeinterval); // Зупиняємо таймер
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

// Обробник події кліку на кнопці Start
document.querySelector('[data-start]').addEventListener('click', updateTimer);

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
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Обробник події кліку на кнопці "Start"
document.querySelector('[data-start]').addEventListener('click', function () {
  // Отримання вибраної дати
  const selectedDate = userSelectedDate;

  // Отримання поточної дати та часу
  const currentDate = new Date();

  // Розрахунок різниці між вибраною датою та поточною в мілісекундах
  let timeDiff = selectedDate.getTime() - currentDate.getTime();

  // Оновлення інтерфейсу таймера та запуск таймера
  function updateTimer() {
    const timeRemaining = convertMs(timeDiff);

    // Оновлення відображення таймера
    document.querySelector('[data-days]').textContent = addLeadingZero(
      timeRemaining.days
    );
    document.querySelector('[data-hours]').textContent = addLeadingZero(
      timeRemaining.hours
    );
    document.querySelector('[data-minutes]').textContent = addLeadingZero(
      timeRemaining.minutes
    );
    document.querySelector('[data-seconds]').textContent = addLeadingZero(
      timeRemaining.seconds
    );

    // Перевірка на завершення таймера
    if (timeDiff <= 0) {
      clearInterval(timerInterval); // Зупиняємо таймер
      document.querySelector('[data-start]').disabled = false; // Активуємо кнопку "Start"
      document.getElementById('datetime-picker').disabled = false; // Активуємо поле введення
      return;
    }

    timeDiff -= 1000; // Зменшуємо різницю на 1 секунду
  }

  // Перша відправка запуску таймера
  updateTimer();

  // Запуск таймера кожну секунду
  const timerInterval = setInterval(updateTimer, 1000);

  // Деактивація кнопки "Start" та поля введення
  document.querySelector('[data-start]').disabled = true;
  document.getElementById('datetime-picker').disabled = true;
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
