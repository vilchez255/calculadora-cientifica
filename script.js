// Se declaran las variables globales para el display y la expresión
const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
let currentExpression = '';
let result = '';

// Lógica para el logo rebotando
const logo = document.getElementById('bouncing-logo');
let x = 0;
let y = 0;
// Velocidad inicial y dirección aleatoria
let dx = (Math.random() > 0.5 ? 1 : -1);
let dy = (Math.random() > 0.5 ? 1 : -1);
const speed = 2; // Velocidad del logo
let logoWidth;
let logoHeight;

// Función para iniciar la animación una vez que el logo cargue
function startAnimation() {
    logoWidth = logo.offsetWidth;
    logoHeight = logo.offsetHeight;
    // Inicia el bucle de animación si las dimensiones son válidas
    if (logoWidth > 0 && logoHeight > 0) {
        animateBouncingLogo();
    }
}

// Se asegura de que el logo se haya cargado para obtener sus dimensiones
if (logo.complete) {
    startAnimation();
} else {
    logo.onload = startAnimation;
}

/**
 * Bucle de animación para el logo que rebota.
 */
function animateBouncingLogo() {
    // Obtenemos las dimensiones de la ventana en tiempo real
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Actualizamos la posición del logo
    x += dx * speed;
    y += dy * speed;

    // Comprobamos si el logo choca con los bordes horizontales y revertimos la dirección
    if (x + logoWidth >= viewportWidth || x <= 0) {
        dx *= -1;
        // Corregimos la posición para evitar que se quede atascado
        x = Math.max(0, Math.min(x, viewportWidth - logoWidth));
    }

    // Comprobamos si el logo choca con los bordes verticales y revertimos la dirección
    if (y + logoHeight >= viewportHeight || y <= 0) {
        dy *= -1;
        // Corregimos la posición para evitar que se quede atascado
        y = Math.max(0, Math.min(y, viewportHeight - logoHeight));
    }

    // Actualizamos la posición del logo en la página
    logo.style.left = `${x}px`;
    logo.style.top = `${y}px`;

    // Solicitamos el siguiente fotograma de la animación
    requestAnimationFrame(animateBouncingLogo);
}

/**
 * Agrega el valor del botón a la expresión actual y actualiza el display.
 * @param {string} value El valor del botón presionado (número, operador, función).
 */
function appendToExpression(value) {
    // Manejo especial para factorial para que se muestre de forma correcta
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

    expressionDisplay.textContent = currentExpression.replace(/\bMath\./g, ''); // No mostrar "Math."
    // Limpia el resultado si se empieza una nueva operación
    resultDisplay.textContent = '';
}

/**
 * Evalúa la expresión actual y muestra el resultado.
 */
function calculateResult() {
    try {
        let expressionToEvaluate = currentExpression;

        // Reemplazar la representación del factorial por una función
        expressionToEvaluate = expressionToEvaluate.replace(/(\d+\.?\d*)!/g, (match, p1) => {
            const num = parseFloat(p1);
            if (num < 0 || num % 1 !== 0) return 'Error'; // Factorial solo para enteros no negativos
            let factorial = 1;
            for (let i = num; i > 0; i--) {
                factorial *= i;
            }
            return factorial;
        });

        // Evalúa la expresión y redondea el resultado a 10 decimales para evitar imprecisiones
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
        // Guarda el resultado como la nueva expresión para futuras operaciones
        currentExpression = resultDisplay.textContent === 'Error' ? '' : result.toString();
    }
}

/**
 * Limpia la expresión y el resultado, reiniciando la calculadora.
 */
function clearAll() {
    currentExpression = '';
    result = '';
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0';
}