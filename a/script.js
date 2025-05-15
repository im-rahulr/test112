document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const playButton = document.querySelector('.play-button') || document.getElementById('playButton');
  const homePage = document.querySelector('.home-page');
  const dashboardSection = document.querySelector('.dashboard-section');
  
  // Create a global finance data object for cross-page data sharing
  window.financeData = {
    balance: 75000, // Starting balance
    salary: 30000,
    expenses: 20000,
    savings: 0,
    
    // Methods to interact with data
    getBalance: function() {
      return this.balance;
    },
    
    updateBalance: function(newBalance) {
      this.balance = newBalance;
      // Update UI if we're on the dashboard page
      if (document.querySelector('.dashboard-section')) {
        updateBalanceDisplay();
      }
    },
    
    addIncome: function(amount) {
      this.balance += amount;
      // Update UI if we're on the dashboard page
      if (document.querySelector('.dashboard-section')) {
        updateBalanceDisplay();
      }
    },
    
    claimSalary: function() {
      this.balance += this.salary;
      // Update UI if we're on the dashboard page
      if (document.querySelector('.dashboard-section')) {
        updateBalanceDisplay();
      }
      return this.salary;
    },
    
    payExpenses: function() {
      if (this.balance >= this.expenses) {
        this.balance -= this.expenses;
        // Save the difference between salary and expenses
        const savingsAmount = this.salary - this.expenses;
        if (savingsAmount > 0) {
          this.savings += savingsAmount;
        }
        // Update UI if we're on the dashboard page
        if (document.querySelector('.dashboard-section')) {
          updateBalanceDisplay();
        }
        return true;
      }
      return false;
    },
    
    getSavings: function() {
      return this.savings;
    },
    
    updateSavings: function(newSavings) {
      this.savings = newSavings;
    }
  };
  
  // Initialize UI
  if (dashboardSection) {
    updateBalanceDisplay();
    updateMonthHeader();
  }
  
  // Play button click to show dashboard
  if (playButton) {
    playButton.addEventListener('click', function() {
      console.log('Play button clicked');
      if (dashboardSection) {
        showSection(dashboardSection);
        if (homePage) homePage.style.display = 'none';
      } else {
        // Fallback for when dashboard section might be identified differently
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
          showSection(dashboard);
          if (homePage) homePage.style.display = 'none';
        } else {
          console.error('Dashboard section not found');
        }
      }
    });
  } else {
    console.error('Play button not found');
  }
  
  // Month navigation
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');
  
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateMonthHeader();
    });
    
    nextMonthBtn.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateMonthHeader();
    });
  }
  
  // Claim salary button
  const claimSalaryBtn = document.querySelector('.claim-salary');
  
  if (claimSalaryBtn) {
    claimSalaryBtn.addEventListener('click', function() {
      const salary = window.financeData.claimSalary();
      alert(`Your salary of ₹${salary.toLocaleString()} has been credited to your account.`);
      this.disabled = true;
      updateBalanceDisplay();
    });
  }
  
  // Update current month header
  function updateMonthHeader() {
    const monthHeader = document.querySelector('.month-header');
    if (monthHeader) {
      monthHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
  }
  
  // Update balance display
  function updateBalanceDisplay() {
    const balanceDisplay = document.querySelector('.balance-display');
    if (balanceDisplay) {
      balanceDisplay.textContent = `₹${window.financeData.getBalance().toLocaleString()}`;
    }
  }
  
  // Balance button click to show breakdown
  const balanceBtn = document.querySelector('.balance-button');
  
  if (balanceBtn) {
    balanceBtn.addEventListener('click', function() {
      showFinancialBreakdown();
    });
  }
  
  // Financial breakdown function
  function showFinancialBreakdown() {
    alert(`Current Balance: ₹${window.financeData.getBalance().toLocaleString()}\nMonthly Salary: ₹${window.financeData.salary.toLocaleString()}\nMonthly Expenses: ₹${window.financeData.expenses.toLocaleString()}\nTotal Savings: ₹${window.financeData.getSavings().toLocaleString()}`);
  }
  
  // Show section with animation
  function showSection(section) {
    console.log('Showing section:', section);
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(function(s) {
      if (s !== section) {
        s.style.display = 'none';
      }
    });
    
    // Show and animate the selected section
    section.style.display = 'block';
    section.classList.add('fade-in');
    
    setTimeout(function() {
      section.classList.remove('fade-in');
    }, 500);
  }
}); 