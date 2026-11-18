// Инициализация темы при загрузке страницы (требование localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('fitlife_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
});

// Переключение темы
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('fitlife_theme', newTheme);
    });
}

// Живые часы
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US');
    }
}, 1000);

// Модальное окно
function openModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('hidden');
}
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('hidden');
}

// Фильтрация программ на странице программ
function filterPrograms(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-[#ff6600]', 'text-white', 'border-[#ff6600]');
        btn.style.borderColor = 'var(--border-color)';
    });
    btnElement.classList.add('bg-[#ff6600]', 'text-white', 'border-[#ff6600]');

    document.querySelectorAll('.program-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Аккордеон (FAQ)
function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    const isOpen = !content.classList.contains('hidden');
    document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
    if (!isOpen) {
        content.classList.remove('hidden');
    }
}

// Калькулятор ИМТ (BMI)
function calculateBMI() {
    const w = parseFloat(document.getElementById('bmi-weight').value);
    const h = parseFloat(document.getElementById('bmi-height').value) / 100;
    const res = document.getElementById('bmi-result');
    if (!res) return;

    if (!w || !h || h <= 0) {
        res.textContent = "Please enter valid weight and height.";
        res.className = "text-sm font-medium text-center pt-2 text-rose-500";
        return;
    }

    const bmi = (w / (h * h)).toFixed(1);
    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 25) status = "Normal weight";
    else if (bmi < 30) status = "Overweight";
    else status = "Obese";

    res.textContent = `Your BMI is ${bmi} (${status})`;
    res.className = "text-sm font-bold text-center pt-2 text-[#ff6600]";
}

// Калькулятор калорий
function calculateCalories() {
    const age = parseInt(document.getElementById('cal-age').value);
    const gender = document.getElementById('cal-gender').value;
    const activity = parseFloat(document.getElementById('cal-activity').value);
    const res = document.getElementById('cal-result');
    if (!res) return;

    const wInput = parseFloat(document.getElementById('bmi-weight')?.value) || 70;
    const hInput = parseFloat(document.getElementById('bmi-height')?.value) || 175;

    if (!age) {
        res.textContent = "Please enter your age.";
        res.className = "text-sm font-medium text-center pt-2 text-rose-500";
        return;
    }

    let bmr = (10 * wInput) + (6.25 * hInput) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * activity);

    res.textContent = `Estimated maintenance: ~${tdee} kcal/day`;
    res.className = "text-sm font-bold text-center pt-2 text-[#ff6600]";
}

// Бронирование программ
function bookProgram(programName) {
    let bookings = JSON.parse(localStorage.getItem('fitlife_bookings')) || [];
    bookings.push({ item: programName, date: new Date().toLocaleDateString() });
    localStorage.setItem('fitlife_bookings', JSON.stringify(bookings));
    updateBookingsFooter();
    alert(`Successfully booked session: ${programName}!`);
}

// Выбор тарифного плана
function selectPlan(planName) {
    let bookings = JSON.parse(localStorage.getItem('fitlife_bookings')) || [];
    bookings.push({ item: planName, date: new Date().toLocaleDateString() });
    localStorage.setItem('fitlife_bookings', JSON.stringify(bookings));
    updateBookingsFooter();
    alert(`Selected membership plan: ${planName}! Our manager will contact you.`);
}

function updateBookingsFooter() {
    let bookings = JSON.parse(localStorage.getItem('fitlife_bookings')) || [];
    const info = document.getElementById('saved-bookings-info');
    if (info && bookings.length > 0) {
        info.textContent = `Your active saved bookings/plans: ${bookings.length}`;
    }
}
updateBookingsFooter();

// Отправка формы контактов
function handleContactSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('contact-alert');
    if (alertBox) {
        alertBox.textContent = "Thank you! Your message has been sent successfully.";
        alertBox.className = "text-center text-sm font-semibold pt-2 text-[#ff6600]";
    }
    
    // Сохранение симуляции пользователя для пункта 5.1
    const name = document.getElementById('contact-name')?.value || "User";
    const email = document.getElementById('contact-email')?.value || "user@mail.com";
    localStorage.setItem('fitlife_user', JSON.stringify({ name, email }));

    document.getElementById('contact-form')?.reset();
}

// Отправка формы модального окна
function handleModalSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('modal-alert');
    if (alertBox) {
        alertBox.textContent = "Request received! We will call you soon.";
        alertBox.className = "text-center text-sm font-semibold pt-2 text-[#ff6600]";
    }
    setTimeout(() => {
        closeModal();
        if (alertBox) alertBox.classList.add('hidden');
        document.getElementById('modal-form')?.reset();
    }, 1500);
}