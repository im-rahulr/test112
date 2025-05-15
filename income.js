document.addEventListener('DOMContentLoaded', function() {
  // Get tab elements
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const balanceButton = document.querySelector('.balance-btn');
  const expensesButton = document.querySelector('.expenses-btn');
  const addIncomeForm = document.querySelector('#add-income-form');
  const addSavingsForm = document.querySelector('#add-savings-form');
  const payExpensesButton = document.querySelector('#pay-expenses-btn');
  
  console.log('Income page initialized');
  
  // Initialize financial data from global object or use defaults
  let balance, salary, expenses, savings;
  
  if (window.financeData) {
    balance = window.financeData.getBalance();
    salary = window.financeData.salary;
    expenses = window.financeData.expenses;
    savings = window.financeData.getSavings();
    console.log('Finance data synced from global', { balance, salary, expenses, savings });
  } else {
    balance = 75000;
    salary = 30000;
    expenses = 20000;
    savings = 0;
    console.log('Using default finance data');
  }
  
  // Income history for the chart
  const incomeHistory = [
    { month: 'Jan', amount: 28500 },
    { month: 'Feb', amount: 29000 },
    { month: 'Mar', amount: 29500 },
    { month: 'Apr', amount: 30000 },
    { month: 'May', amount: 30000 },
    { month: 'Jun', amount: 30000 }
  ];
  
  // Track if expenses have been paid for this month
  let expensesPaid = false;
  
  // Check if expenses were already paid
  if (payExpensesButton && payExpensesButton.classList.contains('disabled')) {
    expensesPaid = true;
  }
  
  // Initialize UI with data
  updateBalanceDisplay();
  updateSavingsDisplay();
  updateExpensesDisplay();
  
  // Initialize Income Chart
  initIncomeChart();
  
  // Tab switching functionality
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      console.log('Tab clicked:', tabId);
      
      // Remove active class from all tabs and panes
      tabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding pane
      this.classList.add('active');
      const tabPane = document.querySelector(`.tab-pane[data-tab="${tabId}"]`);
      if (tabPane) {
        tabPane.classList.add('active');
      } else {
        console.error(`Tab pane with data-tab="${tabId}" not found`);
      }
    });
  });
  
  // Balance button click - show financial breakdown
  if (balanceButton) {
    balanceButton.addEventListener('click', function() {
      showFinancialBreakdown();
    });
  } else {
    console.error('Balance button not found');
  }
  
  // Expenses button click - switch to expenses tab
  if (expensesButton) {
    expensesButton.addEventListener('click', function() {
      // Find and click the expenses tab
      const expensesTab = document.querySelector('.tab[data-tab="expenses"]');
      if (expensesTab) {
        expensesTab.click();
      }
    });
  }
  
  // Update balance display
  function updateBalanceDisplay() {
    const balanceDisplay = document.querySelector('.balance-amount');
    if (balanceDisplay) {
      balanceDisplay.textContent = `₹${balance.toLocaleString()}`;
    } else {
      console.error('Balance display element not found');
    }
    
    // Update global finance data if available
    if (window.financeData) {
      window.financeData.updateBalance(balance);
    }
  }
  
  // Update savings display
  function updateSavingsDisplay() {
    const savingsDisplay = document.querySelector('.savings-amount');
    if (savingsDisplay) {
      savingsDisplay.textContent = `₹${savings.toLocaleString()}`;
    } else {
      console.error('Savings display element not found');
    }
    
    // Update global finance data if available
    if (window.financeData) {
      window.financeData.updateSavings(savings);
    }
  }
  
  // Update expenses display
  function updateExpensesDisplay() {
    const expensesTotal = document.querySelector('.expenses-total');
    if (expensesTotal) {
      expensesTotal.textContent = `₹${expenses.toLocaleString()}`;
    }
  }
  
  // Show financial breakdown
  function showFinancialBreakdown() {
    alert(`Current Balance: ₹${balance.toLocaleString()}\nMonthly Salary: ₹${salary.toLocaleString()}\nMonthly Expenses: ₹${expenses.toLocaleString()}\nTotal Savings: ₹${savings.toLocaleString()}`);
  }
  
  // Add Income Form Submission
  if (addIncomeForm) {
    addIncomeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const incomeSource = document.querySelector('#income-source');
      const incomeAmount = document.querySelector('#income-amount');
      
      if (!incomeSource || !incomeAmount) {
        console.error('Income form fields not found');
        return;
      }
      
      const source = incomeSource.value;
      const amount = parseFloat(incomeAmount.value);
      
      if (source && !isNaN(amount) && amount > 0) {
        console.log('Adding income:', source, amount);
        // Add to balance
        balance += amount;
        updateBalanceDisplay();
        
        // Add to income list
        const incomeList = document.querySelector('.income-list');
        if (incomeList) {
          const listItem = document.createElement('div');
          listItem.className = 'income-item';
          listItem.innerHTML = `
            <div class="income-details">
              <h4>${source}</h4>
              <p>Added just now</p>
            </div>
            <div class="income-amount">₹${amount.toLocaleString()}</div>
          `;
          incomeList.appendChild(listItem);
        }
        
        // Reset form
        this.reset();
        
        // Update chart
        incomeHistory.push({ month: 'Extra', amount: amount });
        updateIncomeChart();
        
        alert(`₹${amount.toLocaleString()} from ${source} has been added to your account.`);
      } else {
        alert('Please enter a valid income source and amount.');
      }
    });
  } else {
    console.error('Add income form not found');
  }
  
  // Add Savings Goal Form Submission
  if (addSavingsForm) {
    addSavingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const goalName = document.querySelector('#goal-name');
      const goalAmount = document.querySelector('#goal-amount');
      
      if (!goalName || !goalAmount) {
        console.error('Savings goal form fields not found');
        return;
      }
      
      const name = goalName.value;
      const amount = parseFloat(goalAmount.value);
      
      if (name && !isNaN(amount) && amount > 0) {
        console.log('Adding savings goal:', name, amount);
        // Calculate how much would come from current balance
        const amountFromBalance = Math.min(balance, amount);
        
        if (amountFromBalance > 0) {
          // Deduct from balance and add to savings
          balance -= amountFromBalance;
          savings += amountFromBalance;
          
          // Update displays
          updateBalanceDisplay();
          updateSavingsDisplay();
          
          // Add to goals list
          const goalsList = document.querySelector('.goals-list');
          if (goalsList) {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            goalItem.innerHTML = `
              <div class="goal-details">
                <h4>${name}</h4>
                <p>Target: ₹${amount.toLocaleString()}</p>
              </div>
              <div class="goal-status">
                <div class="goal-progress">
                  <div class="progress-bar" style="width: ${Math.min((amountFromBalance / amount) * 100, 100)}%"></div>
                </div>
                <p>₹${amountFromBalance.toLocaleString()} of ₹${amount.toLocaleString()}</p>
              </div>
            `;
            goalsList.appendChild(goalItem);
          }
          
          // Reset form
          this.reset();
          
          alert(`Savings goal "${name}" created with ₹${amountFromBalance.toLocaleString()} allocated.`);
        } else {
          alert("You don't have enough balance to allocate to this savings goal.");
        }
      } else {
        alert('Please enter a valid goal name and amount.');
      }
    });
  } else {
    console.error('Add savings form not found');
  }
  
  // Pay Expenses Button Click
  if (payExpensesButton) {
    payExpensesButton.addEventListener('click', function() {
      console.log('Pay expenses button clicked, expensesPaid:', expensesPaid);
      if (expensesPaid) {
        alert("You've already paid your expenses for this month.");
        return;
      }
      
      if (balance >= expenses) {
        // Deduct expenses from balance
        balance -= expenses;
        
        // Calculate savings (difference between salary and expenses)
        const monthlySavings = salary - expenses;
        
        // Add to savings if positive
        if (monthlySavings > 0) {
          savings += monthlySavings;
          updateSavingsDisplay();
        }
        
        // Update balance display
        updateBalanceDisplay();
        
        // Mark expenses as paid
        expensesPaid = true;
        
        // Disable the button
        this.disabled = true;
        this.classList.add('disabled');
        
        alert(`Expenses of ₹${expenses.toLocaleString()} paid. ₹${monthlySavings.toLocaleString()} added to savings.`);
        
        // If global finance data is available, also update it
        if (window.financeData) {
          window.financeData.updateSavings(savings);
        }
      } else {
        alert(`Insufficient funds! You need ₹${(expenses - balance).toLocaleString()} more to pay your expenses.`);
      }
    });
  } else {
    console.error('Pay expenses button not found');
  }
  
  // Reset expenses status for next month
  function resetExpensesStatus() {
    expensesPaid = false;
    if (payExpensesButton) {
      payExpensesButton.disabled = false;
      payExpensesButton.classList.remove('disabled');
    }
  }
  
  // Initialize Income Chart
  function initIncomeChart() {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) {
      console.error('Income chart canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const chartHeight = canvas.height;
    const chartWidth = canvas.width;
    
    // Draw the chart
    drawIncomeChart(ctx, chartWidth, chartHeight);
  }
  
  // Update Income Chart
  function updateIncomeChart() {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) {
      console.error('Income chart canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the chart
    drawIncomeChart(ctx, canvas.width, canvas.height);
  }
  
  // Draw the Income Chart
  function drawIncomeChart(ctx, width, height) {
    const padding = 40; // padding for labels
    const barWidth = 30;
    const chartInnerWidth = width - (padding * 2);
    const chartInnerHeight = height - (padding * 2);
    
    // Find the maximum income amount for scaling
    const maxIncome = Math.max(...incomeHistory.map(entry => entry.amount)) * 1.1; // 10% extra space at top
    
    // Only show the last 6 entries if there are more
    const displayData = incomeHistory.slice(-6);
    
    // Draw the axes
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw y-axis labels and horizontal grid lines
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#888";
    ctx.font = "10px Arial";
    
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (chartInnerHeight / 5));
      const value = Math.round((i * maxIncome) / 5);
      
      ctx.fillText(value.toLocaleString(), padding - 5, y);
      
      // Draw grid line
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw the bars
    const barSpacing = chartInnerWidth / displayData.length;
    
    ctx.fillStyle = "#4CAF50";
    displayData.forEach((entry, index) => {
      const x = padding + ((index + 0.5) * barSpacing) - (barWidth / 2);
      const barHeight = (entry.amount / maxIncome) * chartInnerHeight;
      const y = height - padding - barHeight;
      
      // Bar
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // X-axis label (month)
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(entry.month, x + (barWidth / 2), height - padding + 5);
      
      // Reset fill style for next bar
      ctx.fillStyle = "#4CAF50";
    });
    
    // Draw the title
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("Income History", width / 2, 10);
  }
}); 