document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const playButton = document.getElementById('playButton');
  const backButtons = document.querySelectorAll('.back-button');
  const dashboardOptions = document.querySelectorAll('.option');
  const sections = document.querySelectorAll('.section');
  const tabs = document.querySelectorAll('.tab');
  const calcTabs = document.querySelectorAll('.calc-tab');
  
  // Charts
  let spendingChart = null;
  let portfolioChart = null;
  
  // Play button click event
  playButton.addEventListener('click', function() {
    showSection('dashboard');
  });
  
  // Back buttons click events
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      showSection('dashboard');
    });
  });
  
  // Dashboard option click events
  dashboardOptions.forEach(option => {
    option.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      showSection(target);
      
      // Initialize charts when sections are shown
      if (target === 'income') {
        initSpendingChart();
      } else if (target === 'investment') {
        initPortfolioChart();
      }
    });
  });
  
  // Tab navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const parentElement = this.parentElement;
      const tabTarget = this.getAttribute('data-tab');
      
      // Remove active class from all tabs in the same container
      parentElement.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Find all content containers
      let contentContainers;
      if (parentElement.classList.contains('finance-tabs')) {
        contentContainers = document.querySelectorAll('#income .tab-content');
      } else if (parentElement.classList.contains('investment-tabs')) {
        contentContainers = document.querySelectorAll('#investment .tab-content');
      }
      
      // Hide all content
      if (contentContainers) {
        contentContainers.forEach(container => {
          container.classList.add('hidden');
        });
      }
      
      // Show the target content
      const targetContent = document.getElementById(tabTarget + '-content');
      if (targetContent) {
        targetContent.classList.remove('hidden');
        
        // Initialize charts if needed
        if (tabTarget === 'overview') {
          initSpendingChart();
        } else if (tabTarget === 'portfolio') {
          initPortfolioChart();
        }
      }
    });
  });
  
  // Calculator tabs
  calcTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const calcType = this.getAttribute('data-calc');
      
      // Remove active class from all calculator tabs
      document.querySelectorAll('.calc-tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all calculator content
      const calculatorContents = document.querySelectorAll('.calculator-content');
      calculatorContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // Show the target calculator
      const targetCalc = document.getElementById(calcType + '-calculator');
      if (targetCalc) {
        targetCalc.style.display = 'block';
      }
    });
  });
  
  // Calculate button click for SIP calculator
  const calculateBtn = document.querySelector('.calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      calculateSIP();
    });
  }
  
  // Budget planner save button
  const saveBudgetBtn = document.querySelector('.save-budget');
  if (saveBudgetBtn) {
    saveBudgetBtn.addEventListener('click', function() {
      saveBudgetPlan();
    });
  }
  
  // Add Funds to Savings Goal
  const addFundsBtns = document.querySelectorAll('.add-funds');
  addFundsBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const goalItem = this.closest('.goal-item');
      addFundsToGoal(goalItem);
    });
  });
  
  // Trade buttons click events
  const tradeBtns = document.querySelectorAll('.trade-btn');
  tradeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.classList.contains('buy') ? 'buy' : 'sell';
      const stockName = this.closest('.stock-card, .holding-item').querySelector('h3, h4').textContent;
      showTradeModal(stockName, action);
    });
  });
  
  // Period buttons for portfolio chart
  const periodBtns = document.querySelectorAll('.period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.period-btn').forEach(b => {
        b.classList.remove('active');
      });
      this.classList.add('active');
      
      const period = this.textContent;
      updatePortfolioChart(period);
    });
  });
  
  // Function to show a specific section
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Add animation class
      targetSection.style.animation = 'none';
      targetSection.offsetHeight; // Trigger reflow
      targetSection.style.animation = 'fadeIn 0.5s ease forwards';
    }
  }
  
  // Initialize spending chart
  function initSpendingChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;
    
    if (spendingChart) {
      spendingChart.destroy();
    }
    
    spendingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Income',
            data: [72000, 73000, 75000, 74000, 75000, 75000],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Expenses',
            data: [42000, 44000, 43000, 45000, 46000, 45000],
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Income vs Expenses Trend'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  // Initialize portfolio chart
  function initPortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;
    
    if (portfolioChart) {
      portfolioChart.destroy();
    }
    
    portfolioChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
          label: 'Portfolio Value',
          data: [540000, 541200, 543500, 544800, 542300, 543700, 545320],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '1 Week Performance'
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return '₹' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  // Update portfolio chart based on selected period
  function updatePortfolioChart(period) {
    if (!portfolioChart) return;
    
    let labels = [];
    let data = [];
    let title = '';
    
    switch(period) {
      case '1W':
        labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        data = [540000, 541200, 543500, 544800, 542300, 543700, 545320];
        title = '1 Week Performance';
        break;
      case '1M':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [540000, 545000, 547000, 545320];
        title = '1 Month Performance';
        break;
      case '3M':
        labels = ['Month 1', 'Month 2', 'Month 3'];
        data = [520000, 532000, 545320];
        title = '3 Month Performance';
        break;
      case '6M':
        labels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        data = [500000, 510000, 520000, 532000, 540000, 545320];
        title = '6 Month Performance';
        break;
      case '1Y':
        labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        data = [480000, 500000, 525000, 545320];
        title = '1 Year Performance';
        break;
      case 'All':
        labels = ['2020', '2021', '2022', '2023'];
        data = [400000, 450000, 500000, 545320];
        title = 'All Time Performance';
        break;
    }
    
    portfolioChart.data.labels = labels;
    portfolioChart.data.datasets[0].data = data;
    portfolioChart.options.plugins.title.text = title;
    portfolioChart.update();
  }
  
  // Calculate SIP returns
  function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
    const years = parseFloat(document.getElementById('investment-period').value) || 0;
    const expectedReturn = parseFloat(document.getElementById('expected-return').value) || 0;
    
    const months = years * 12;
    const monthlyRate = expectedReturn / 12 / 100;
    
    // SIP formula: M × (((1 + r)^n - 1) / r) × (1 + r)
    const amount = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    const investedAmount = monthlyInvestment * months;
    const estimatedReturns = amount - investedAmount;
    
    // Update results
    const resultElements = document.querySelectorAll('.result-value');
    resultElements[0].textContent = '₹' + Math.round(investedAmount).toLocaleString();
    resultElements[1].textContent = '₹' + Math.round(estimatedReturns).toLocaleString();
    resultElements[2].textContent = '₹' + Math.round(amount).toLocaleString();
  }
  
  // Save budget plan
  function saveBudgetPlan() {
    // In a real app, this would save to backend
    alert('Budget plan saved successfully!');
  }
  
  // Add funds to savings goal
  function addFundsToGoal(goalItem) {
    // In a real app, this would open a modal to add funds
    // For now, just simulate adding ₹10,000
    const goalInfo = goalItem.querySelector('.goal-info');
    const targetText = goalInfo.querySelector('p:nth-child(2)').textContent;
    const savedText = goalInfo.querySelector('p:nth-child(3)').textContent;
    
    const target = parseInt(targetText.replace(/[^\d]/g, ''));
    const currentSaved = parseInt(savedText.match(/₹([\d,]+)/)[1].replace(/,/g, ''));
    const newAmount = currentSaved + 10000;
    const newPercentage = Math.round((newAmount / target) * 100);
    
    // Update the text
    goalInfo.querySelector('p:nth-child(3)').textContent = `Saved: ₹${newAmount.toLocaleString()} (${newPercentage}%)`;
    
    // Update the progress bar
    goalItem.querySelector('.progress').style.width = `${newPercentage}%`;
    
    alert(`₹10,000 added to your goal. New balance: ₹${newAmount.toLocaleString()}`);
  }
  
  // Show trade modal
  function showTradeModal(stockName, action) {
    // In a real app, this would open a modal for trading
    alert(`${action.toUpperCase()} ${stockName} - Trading functionality would open here`);
  }
}); 