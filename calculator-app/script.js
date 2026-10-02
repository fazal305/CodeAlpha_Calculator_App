const expressionDisplay = document.querySelector("#expression-display");
const resultDisplay = document.querySelector("#result-display");
const calculatorButtons = document.querySelectorAll(".calculator-btn");

let currentExpression = "";
let calculationFinished = false;

calculatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleInput(button.dataset.value);
  });
});

document.addEventListener("keydown", (event) => {
  const allowedKeys = "0123456789+-*/.";

  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    handleInput(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    handleInput("=");
  }

  if (event.key === "Escape") {
    handleInput("C");
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    handleInput("DEL");
  }
});

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

function addNumber(numberValue) {
  if (calculationFinished) {
    currentExpression = "";
    calculationFinished = false;
  }

  currentExpression += numberValue;
  updateDisplay();
}

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

function calculateFinalResult() {
  if (currentExpression === "") {
    return;
  }

  if (isOperator(currentExpression.slice(-1))) {
    currentExpression = currentExpression.slice(0, -1);
  }

  const finalResult = calculateExpression(currentExpression);

  expressionDisplay.textContent = formatExpression(currentExpression);
  resultDisplay.textContent = finalResult;

  currentExpression = finalResult === "Error" ? "" : finalResult.toString();
  calculationFinished = true;
}

function updateDisplay() {
  expressionDisplay.textContent = formatExpression(currentExpression || "0");

  if (currentExpression === "" || isOperator(currentExpression.slice(-1))) {
    resultDisplay.textContent = formatExpression(currentExpression || "0");
    return;
  }

  resultDisplay.textContent = calculateExpression(currentExpression);
}

function calculateExpression(expressionValue) {
  try {
    if (!isSafeExpression(expressionValue)) {
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

function isSafeExpression(expressionValue) {
  if (!/^[0-9+\-*/.() ]+$/.test(expressionValue)) {
    return false;
  }

  if (/\/0(?!\.)/.test(expressionValue)) {
    return false;
  }

  return true;
}

function formatExpression(expressionValue) {
  return expressionValue.replaceAll("*", "×").replaceAll("/", "÷");
}

function clearCalculator() {
  currentExpression = "";
  calculationFinished = false;
  expressionDisplay.textContent = "0";
  resultDisplay.textContent = "0";
}

function deleteLastCharacter() {
  if (calculationFinished) {
    clearCalculator();
    return;
  }

  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function getCurrentNumber() {
  return currentExpression.split(/[+\-*/]/).pop();
}

function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}
