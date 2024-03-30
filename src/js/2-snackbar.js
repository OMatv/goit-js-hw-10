import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const delayInput = form.elements['delay'];
    const delay = parseInt(delayInput.value);

    const stateInput = form.elements['state'];
    const state = stateInput.value;

    const delayPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else if (state === 'rejected') {
          reject(delay);
        }
      }, delay);
    });

    delayPromise
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `Fulfilled promise in ${delay}ms`,
          position: 'topRight',
          timeout: 5000,
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `Rejected promise in ${delay}ms`,
          position: 'topRight',
          timeout: 5000,
        });
      });
  });
});
