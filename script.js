/* 
   ELEMENTS
 */
const expressionDisplay = document.querySelector("#expression-display");
const resultDisplay = document.querySelector("#result-display");
const calculatorButtons = document.querySelectorAll(".calculator-btn");

let currentExpression = "";
let calculationFinished = false;

/* 
   BUTTON CLICKS
 */
calculatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleInput(button.dataset.value);
  });
});

/* 
   KEYBOARD SUPPORT
 */
document.addEventListener("keydown", (event) => {
  const allowedKeys = "0123456789+-*/.";

  if (allowedKeys.includes(event.key)) {
    handleInput(event.key);
  }

  if (event.key === "Enter") {
    handleInput("=");
  }

  if (event.key === "Escape") {
    handleInput("C");
  }

  if (event.key === "Backspace") {
    handleInput("DEL");
  }
});

/* 
   INPUT HANDLER
 */
function handleInput(inputValue) {
  if (inputValue === "C") {
    clearCalculator();
    return;
  }

  if (inputValue === "DEL") {
    deleteLastCharacter();
    return;
  }

  if (inputValue === "=") {
    calculateFinalResult();
    return;
  }

  if (isOperator(inputValue)) {
    addOperator(inputValue);
    return;
  }

  if (inputValue === ".") {
    addDecimalPoint();
    return;
  }

  addNumber(inputValue);
}

/* 
   ADD NUMBER
 */
function addNumber(numberValue) {
  if (calculationFinished) {
    currentExpression = "";
    calculationFinished = false;
  }

  currentExpression += numberValue;
  updateDisplay();
}

/* 
   ADD OPERATOR
 */
function addOperator(operatorValue) {
  if (currentExpression === "") {
    return;
  }

  if (calculationFinished) {
    calculationFinished = false;
  }

  const lastCharacter = currentExpression.slice(-1);

  if (isOperator(lastCharacter)) {
    currentExpression = currentExpression.slice(0, -1) + operatorValue;
  } else {
    currentExpression += operatorValue;
  }

  updateDisplay();
}

/* 
   ADD DECIMAL
 */
function addDecimalPoint() {
  if (calculationFinished) {
    currentExpression = "";
    calculationFinished = false;
  }

  const currentNumber = getCurrentNumber();

  if (currentNumber.includes(".")) {
    return;
  }

  if (currentExpression === "" || isOperator(currentExpression.slice(-1))) {
    currentExpression += "0.";
  } else {
    currentExpression += ".";
  }

  updateDisplay();
}

/* 
   FINAL CALCULATION
 */
function calculateFinalResult() {
  if (currentExpression === "") {
    return;
  }

  if (isOperator(currentExpression.slice(-1))) {
    currentExpression = currentExpression.slice(0, -1);
  }

  const finalResult = calculateExpression(currentExpression);

  expressionDisplay.textContent = currentExpression;
  resultDisplay.textContent = finalResult;

  currentExpression = finalResult === "Error" ? "" : finalResult.toString();
  calculationFinished = true;
}

/* 
   LIVE RESULT
 */
function updateDisplay() {
  expressionDisplay.textContent = currentExpression || "0";

  if (currentExpression === "" || isOperator(currentExpression.slice(-1))) {
    resultDisplay.textContent = currentExpression || "0";
    return;
  }

  resultDisplay.textContent = calculateExpression(currentExpression);
}

/* 
   CALCULATE EXPRESSION
 */
function calculateExpression(expressionValue) {
  try {
    if (/\/0(?!\.)/.test(expressionValue)) {
      return "Error";
    }

    const calculatedValue = Function(
      `"use strict"; return (${expressionValue})`,
    )();

    if (!Number.isFinite(calculatedValue)) {
      return "Error";
    }

    return Number(calculatedValue.toFixed(8));
  } catch {
    return "Error";
  }
}

/* 
   CLEAR
 */
function clearCalculator() {
  currentExpression = "";
  calculationFinished = false;
  expressionDisplay.textContent = "0";
  resultDisplay.textContent = "0";
}

/* 
   DELETE LAST CHARACTER
 */
function deleteLastCharacter() {
  if (calculationFinished) {
    clearCalculator();
    return;
  }

  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

/* 
   CURRENT NUMBER
 */
function getCurrentNumber() {
  return currentExpression.split(/[+\-*/]/).pop();
}

/* 
   OPERATOR CHECK
 */
function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}
