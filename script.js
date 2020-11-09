'use strict';
/////////////////////////////////////////////////
// BANKIST APP

// Data
/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//Create date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`
//Fin create date


const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();
        const displayDate = `${day}/${month}/${year}`

        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements_date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner.toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');;
    });
}

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((acc, mov) => acc + mov);
    labelBalance.textContent = `${account.balance} €`;

}

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov);

    const outcomes = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int);

    labelSumIn.textContent = `${incomes}€`;
    labelSumOut.textContent = `${Math.abs(outcomes)}€`;
    labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (currrentAcount) {
    //Display Movements
    displayMovements(currrentAcount);
    //Display balance
    calcDisplayBalance(currrentAcount);
    //Display summary
    calcDisplaySummary(currrentAcount);
};

//Variable global para la cuenta actual
let currrentAcount;
let timer;
//Find username
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    //Find username
    currrentAcount = accounts.find(acc => acc.username === inputLoginUsername.value);
    //  console.log(currrentAcount);
    if (currrentAcount?.pin === Number(inputLoginPin.value)) {
        //   console.log('login');
        //Display UI and Welcome Message;
        labelWelcome.textContent = `Welcome back, ${currrentAcount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;
        //Cleaning input fields
        //  inputLoginUsername.value = inputLoginPin.value = '';
        //  inputLoginPin.blur();
        if(timer) clearInterval(timer);
        timer = startLogOutTimer();

        updateUI(currrentAcount);

    }
});

//Set timers to log out
const startLogOutTimer = function () {
    const tic = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        //In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started'
            containerApp.style.opacity = 0;
        }
        
        time--;
    }
    //Set time to 5 minutes
    let time = 15;
    //Call the timer every second
    const timer = setInterval(tic, 1000);


    


    return timer;
}

//Transfers
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    if (receiverAcc &&
        amount > 0 &&
        currrentAcount.balance >= amount &&
        receiverAcc.username !== currrentAcount.username
    ) {
        //Doing transfer
        currrentAcount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        currrentAcount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString())
        //  console.log(currrentAcount);
        updateUI(currrentAcount);
        clearInterval(timer);
        timer = startLogOutTimer();

    }
    inputTransferAmount.value = inputTransferTo.value = '';
});


//Close account
btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (currrentAcount.username === inputCloseUsername.value &&
        Number(inputClosePin.value) === currrentAcount.pin) {
        const index = accounts.findIndex(
            acc => acc.username === currrentAcount.username);
        //Delete account
        accounts.splice(index, 1);
        //Hide UI
        containerApp.style.opacity = 0;

    }
    inputCloseUsername.value = inputClosePin.value = '';

})


//Request loan
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (amount > 0 &&
        currrentAcount.movements.some(
            mov => mov >= amount * 0.1)
    ) {
        //Add movement
        currrentAcount.movements.push(amount);
        currrentAcount.movementsDates.push(new Date().toISOString());
        updateUI(currrentAcount);
        clearInterval(timer);
        timer = startLogOutTimer();

    }
    inputLoanAmount.value = '';

});


//Sort movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currrentAcount, !sorted);
    sorted = !sorted;
});

createUsernames(accounts);


/////////Timers and Numbers;

console.log(Number.parseInt('111px', 2))

console.log(Number.isInteger(22.0));


//Timers
setTimeout(() => console.log('Here is your pizza'), 3000);