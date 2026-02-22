// Stepها
const phoneForm = document.querySelector('.step-phone');
const codeForm = document.querySelector('.step-code');
const successStep = document.querySelector('.step-success');

// Inputs و دکمه‌ها
const phoneInput = phoneForm.querySelector('#phone');
const phoneBtn = phoneForm.querySelector('.btn-auth');

const otpInputs = codeForm.querySelectorAll('.otp-group input');
const codeBtn = codeForm.querySelector('.btn-auth');

// Progress Bar
const indicators = document.querySelectorAll('.step-indicator');

// تایمر
const timerEl = document.getElementById('timer');
const resendBtn = document.getElementById('resend');
let timerInterval;

// اعتبارسنجی شماره موبایل ایران
function isValidIranPhone(number) {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(number);
}

// فعال/غیرفعال دکمه شماره موبایل
phoneInput.addEventListener('input', () => {
  // فقط اعداد
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g,'');
  phoneBtn.disabled = !isValidIranPhone(phoneInput.value);
});

// فانکشن تغییر Step و Progress Bar
function goToStep(currentIndex, nextIndex) {
    const steps = [phoneForm, codeForm, successStep];
    const stepContainers = document.querySelectorAll('.step-container');
  
    // تغییر Step فعال
    steps[currentIndex].classList.remove('active');
    steps[nextIndex].classList.add('active');
  
    // آپدیت دایره‌ها و خط‌ها
    stepContainers.forEach((container, idx) => {
      const indicator = container.querySelector('.step-indicator');
      const line = container.querySelector('.step-line');
      
      if(idx <= nextIndex){
        indicator.classList.add('active');
        if(line) line.classList.add('active');
      } else {
        indicator.classList.remove('active');
        if(line) line.classList.remove('active');
      }
    });
  }
  

// ارسال شماره موبایل → رفتن به Step بعدی + شروع تایمر
phoneForm.addEventListener('submit', e => {
  e.preventDefault();
  goToStep(0,1);  // مرحله 2: OTP
  otpInputs[0].focus();
  startOtpTimer();
});

// تایمر OTP ۲ دقیقه‌ای
function startOtpTimer(duration = 120) {
  let time = duration;
  resendBtn.disabled = true;

  const minutesInit = String(Math.floor(time/60)).padStart(2,'0');
  const secondsInit = String(time%60).padStart(2,'0');
  timerEl.textContent = `${minutesInit}:${secondsInit}`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const minutes = String(Math.floor(time/60)).padStart(2,'0');
    const seconds = String(time%60).padStart(2,'0');
    timerEl.textContent = `${minutes}:${seconds}`;
    time--;
    if(time < 0){
      clearInterval(timerInterval);
      timerEl.textContent = '00:00';
      resendBtn.disabled = false;
    }
  }, 1000);
}

// دکمه ارسال دوباره OTP
resendBtn.addEventListener('click', () => {
  otpInputs.forEach(i => i.value='');
  otpInputs[0].focus();
  codeBtn.disabled = true;
  startOtpTimer();
  // اینجا می‌تونی فانکشن ارسال دوباره کد واقعی رو هم صدا بزنی
});

// OTP: حرکت خودکار و فعال/غیرفعال کردن دکمه تایید
otpInputs.forEach((input, idx) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g,'');
    if(input.value && idx < otpInputs.length-1) otpInputs[idx+1].focus();
    codeBtn.disabled = ![...otpInputs].every(i=>i.value.length===1);
  });

  input.addEventListener('keydown', e => {
    if(e.key === 'Backspace' && !input.value && idx > 0) otpInputs[idx-1].focus();
  });
});

// ارسال OTP → Step موفقیت
codeForm.addEventListener('submit', e => {
  e.preventDefault();
  goToStep(1,2);  // مرحله 3: موفقیت
});
