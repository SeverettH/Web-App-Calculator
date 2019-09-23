class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.readyToReset = false;
    this.clear()
  }

  clear() { // Sets current & present operands to empty strings as a way to clear them
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined //Resets operation by deassociating it from any past operation
  }

  delete()  {// Get very last index of string and chop it off - Deleting it
    this.currentOperand = this.currentOperand.toString().slice(0,-1)
  }

  appendNumber(number)  {
    if (number === '.' && this.currentOperand.includes('.')) return //Checks to see if '.' is currently present, if it is then it will not allow you to append with an additional '.'
    this.currentOperand = this.currentOperand.toString() + number.toString()//Converts to string because JS will try to add 1 + 1 = 2 instead of 1 + 1 = 11 which is our intended goal
  }

  chooseOperation(operation) {
    if(this.currentOperand === '') return
    if(this.previousOperand !== '') {//We require a previous & current operand in order to move forward with performing a computation
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute()  {
    let computation
    const prev = parseFloat(this.previousOperand)//converting string to number
    const current = parseFloat(this.currentOperand)//Allowing artihmetic computations to occur properly
    if(isNaN(prev)  ||  isNaN(current)) return// If not a number we dont want to perform any operation
    switch(this.operation)  {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
      return
    }
    this.readyToReset = true;
    this.currentOperand = computation//Result of operation performed on current and previous operand
    this.operation = undefined
    this.previousOperand = ''
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if(this.operation != null){
    this.previousOperandTextElement.innerText =//Concatanation of operand and operation display, example: '25 +'
    `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
  } else {
      this.previousOperandTextElement.innerText = ''
  }
  }


  getDisplayNumber(number)  {
    const stringNumber = number.toString()//convert to string so we can split it with '.' in it
    const integerDigits = parseFloat(stringNumber.split('.')[0])//Parse what comes before the decimal place '.'
    const decimalDigits = stringNumber.split('.')[1]//Parse what comes after the decimal place '.'
    let integerDisplay
    if(isNaN(integerDigits))  {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {//Pass a string with language sensitive representation of our number, ie using ','
        maximumFractionDigits: 0//Ensures there are no decimal places occuring after this value
      })
    }
    if (decimalDigits != null)  {//If user has decimal digits we will return them following the integer and '.'
      return  `${integerDisplay}.${decimalDigits}`
    } else {//If user does not have any decimal digits
      return integerDisplay
    }
  }
}



const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButtons = document.querySelector('[data-equals]')
const deleteButtons = document.querySelector('[data-delete]')
const allClearButtons = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if(calculator.previousOperand === "" &&
        calculator.currentOperand !== "" &&
        calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButtons.addEventListener('click', button =>  {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButtons.addEventListener('click', button =>  {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButtons.addEventListener('click', button =>  {
  calculator.delete()
  calculator.updateDisplay()
})
