const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
let currentExpression = '';
let result = '';
const logo = document.getElementById('bouncing-logo');
let x = 0;
let y = 0;
let dx = (Math.random() > 0.5 ? 1 : -1);
let dy = (Math.random() > 0.5 ? 1 : -1);
const speed = 2;
let logoWidth;
let logoHeight;

function startAnimation() {
    logoWidth = logo.offsetWidth;
    logoHeight = logo.offsetHeight;
    if (logoWidth > 0 && logoHeight > 0) {
        animateBouncingLogo();
    }
}
if (logo.complete) {
    startAnimation();
} else {
    logo.onload = startAnimation;
}
function animateBouncingLogo() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    x += dx * speed;
    y += dy * speed;
    if (x + logoWidth >= viewportWidth || x <= 0) {
        dx *= -1;
        x = Math.max(0, Math.min(x, viewportWidth - logoWidth));
    }
    if (y + logoHeight >= viewportHeight || y <= 0) {
        dy *= -1;
        y = Math.max(0, Math.min(y, viewportHeight - logoHeight));
    }
    logo.style.left = `${x}px`;
    logo.style.top = `${y}px`;
    requestAnimationFrame(animateBouncingLogo);
}
function appendToExpression(value) {
    if (value === '!') {
        currentExpression += '!';
    } else if (value === 'sqrt(') {
        currentExpression += 'Math.sqrt(';
    } else if (['sin(', 'cos(', 'tan(', 'log(', 'ln('].includes(value)) {
        currentExpression += 'Math.' + value;
    } else if (value === '^') {
        currentExpression += '**';
    } else {
        currentExpression += value;
    }
    expressionDisplay.textContent = currentExpression.replace(/\bMath\./g, '');
    resultDisplay.textContent = '';
}
function calculateResult() {
    try {
        let expressionToEvaluate = currentExpression;
        expressionToEvaluate = expressionToEvaluate.replace(/(\d+\.?\d*)!/g, (match, p1) => {
            const num = parseFloat(p1);
            if (num < 0 || num % 1 !== 0) return 'Error';
            let factorial = 1;
            for (let i = num; i > 0; i--) {
                factorial *= i;
            }
            return factorial;
        });
        result = eval(expressionToEvaluate);
        if (isNaN(result) || !isFinite(result)) {
            resultDisplay.textContent = 'Error';
            result = 'Error';
        } else {
            resultDisplay.textContent = parseFloat(result.toFixed(10));
        }
    } catch (error) {
        resultDisplay.textContent = 'Error';
    } finally {
        currentExpression = resultDisplay.textContent === 'Error' ? '' : result.toString();
    }
}
function clearAll() {
    currentExpression = '';
    result = '';
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0';
}
