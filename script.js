/* eslint-disable no-alert */

// Wrap in IIFE to keep the 'global' namespace clean
// and hide internal state
(() => {
  let balance = 0;
  let loan = 0;
  let pay = 0;
  let selected = 0;

  class Laptop {
    constructor(name, image, description, price, ...features) {
      this.name = name;
      this.image = image;
      this.description = description;
      this.price = price;
      this.features = features;
    }
  }

  const laptops = [
    new Laptop('HT ElootBook 820 G3',
      'laptop1.png',
      'Please buy this computer, my children are starving. Might smell of cheese on Fridays that falls on odd dates',
      5000,
      'Delicious cheese smell',
      'Will not kill you',
      'Slightly better than not having a computer'),
    new Laptop('MucusSoft ShrewFace 2',
      'laptop2.png',
      'The newest in Shrew Power Generation. Does not require a battery or to be plugged in. The Shrew will demand a yearly human sacrifice',
      10000,
      'No battery',
      'Will not run out of power',
      'Human Sacrifice'),
    new Laptop('Lonovo TrunkPad T540p',
      'laptop3.png',
      'Banish unsightly clutter with this attractive storage solution. Keeping everything out of sight and dust-free, this blue metal storage box has a generous capacity and will blend in seamlessly with any decor.',
      4000,
      'Copper accents',
      'Handy for storing bedding',
      'Not a laptop'),
    new Laptop('Drill Larditude E6540',
      'laptop4.png',
      'This laptop emits a faint smell of burning pork fat. Comes with built in drill and safety goggles',
      1000,
      'Handry drill action',
      'Replaces a scent candle',
      'Not a trunk'),
  ];

  // Elements to update on change
  const elements = {
    loanButton: document.getElementById('loan-button'),
    bankButton: document.getElementById('bank-button'),
    payLoanButton: document.getElementById('pay-loan-button'),
    workButton: document.getElementById('work-button'),
    balanceCell: document.getElementById('balance-cell'),
    loanRow: document.getElementById('loan-row'),
    loanCell: document.getElementById('loan-cell'),
    payCell: document.getElementById('pay-cell'),
    featurelist: document.getElementById('feature-list'),
    image: document.getElementById('image'),
    name: document.getElementById('name'),
    description: document.getElementById('description'),
    price: document.getElementById('price'),
    buybutton: document.getElementById('buy'),
    laptopSelect: document.getElementById('laptops'),
    payLoan: document.getElementById('pay-loan-button'),
  };

  // function to update elements after changes to the state.
  // could be called in a getter/setter of the state properties
  // instead of sprinkling calls in the event handlers.
  function updateUI() {
    // Update balance
    elements.balanceCell.firstChild.nodeValue = `${balance} kr`;

    // Update loan
    // hide the loan row in the bank box and repay button if no loan
    if (loan > 0) {
      elements.loanRow.hidden = false;
      elements.payLoan.style = 'display: inline-block';
      elements.payLoanButton.hidden = false;
      elements.loanCell.firstChild.nodeValue = `${loan} kr`;
    } else {
      elements.loanRow.hidden = true;
      elements.payLoan.style = 'display: none;';
      elements.payLoanButton.hidden = true;
    }

    // Update pay cell
    elements.payCell.firstChild.nodeValue = `${pay} kr`;

    // Update laptop feature list
    while (elements.featurelist.firstChild) {
      elements.featurelist.removeChild(elements.featurelist.firstChild);
    }
    laptops[selected].features.forEach((text) => {
      const elem = document.createElement('p');
      elem.appendChild(document.createTextNode(text));
      elements.featurelist.appendChild(elem);
    });
    // Update laptop main box
    elements.image.src = laptops[selected].image;
    elements.name.firstChild.nodeValue = laptops[selected].name;
    elements.description.firstChild.nodeValue = laptops[selected].description;
    elements.price.firstChild.nodeValue = `${laptops[selected].price} DKK`;
  }

  // Handle clicks on loan application button
  function applyLoan() {
    if (loan !== 0) {
      window.alert('You already have a loan');
    } else {
      const inputAmount = window.prompt('Loan amount', '');
      const amount = Number.parseInt(inputAmount, 10);

      if (amount) { // input is a number
        if (amount > balance * 2) {
          window.alert('Loan amount cannot exceed 2 x your bank balance');
        } else {
          loan = amount;
          balance += loan;
        }
      } else {
        window.alert('Please input a number');
      }

      updateUI();
    }
  }
  // Handle clicks on bank button
  function transferPay() {
    // subtract 10%, will be 0 if loan = 0;
    const loanAmount = Math.min(pay * 0.1, loan);
    pay -= loanAmount;
    loan -= loanAmount;

    balance += pay;
    pay = 0;

    updateUI();
  }

  // Handle clicks on repay loan button
  function payLoan() {
    const amount = Math.min(pay, loan);
    pay -= amount;
    loan -= amount;

    updateUI();
  }

  // Handle clicks on the work button
  function work() {
    pay += 100;

    updateUI();
  }

  // Handle clicks on the buy button
  function buy() {
    if (balance >= laptops[selected].price) {
      balance -= laptops[selected].price;
      alert(`You are now the proud owner of a ${laptops[selected].name}!`);
    } else {
      alert('You\'re too poor to buy this laptop');
    }
    updateUI();
  }

  // handle value change from the laptop select
  function updateSelected() {
    selected = Number.parseInt(elements.laptopSelect.value, 10);
    updateUI();
  }

  // wire events to handlers
  function wireEvents() {
    elements.loanButton.addEventListener('click', applyLoan);
    elements.bankButton.addEventListener('click', transferPay);
    elements.payLoanButton.addEventListener('click', payLoan);
    elements.workButton.addEventListener('click', work);
    elements.laptopSelect.addEventListener('change', updateSelected);
    elements.buybutton.addEventListener('click', buy);
  }

  // "onLoad"
  function init() {
    // Add laptops to the select list
    laptops.forEach((laptop, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.appendChild(document.createTextNode(laptop.name));
      elements.laptopSelect.appendChild(option);
    });

    wireEvents();
    updateUI();
  }

  init();
})();
