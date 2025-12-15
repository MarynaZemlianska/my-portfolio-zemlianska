// Получаем элементы
const modal = document.getElementById('consultationModal');
const openModalBtn = document.querySelector('.button-contact');
const closeModalBtn = document.getElementById('modalClose');

// Функция для открытия модального окна
const openModal = () => {
  modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden'; // Отключаем прокрутку страницы
};

// Функция для закрытия модального окна
const closeModal = () => {
  modal.classList.add('is-hidden');
  document.body.style.overflow = ''; // Включаем прокрутку страницы
};

// Открытие модального окна при клике на кнопку
openModalBtn.addEventListener('click', openModal);

// Закрытие модального окна при клике на кнопку закрытия
closeModalBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике вне его содержимого
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

if (openModalBtn) {
  openModalBtn.addEventListener('click', openModal);
}

// Закрытие модального окна при нажатии клавиши ESC
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('is-hidden') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    closeModal();
  }
});






