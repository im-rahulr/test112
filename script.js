document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const playButton = document.getElementById('playButton');
  const backButtons = document.querySelectorAll('.back-button');
  const dashboardOptions = document.querySelectorAll('.option');
  const sections = document.querySelectorAll('.section');
  const tabs = document.querySelectorAll('.tab');
  const calcTabs = document.querySelectorAll('.calc-tab');
  const marketStocksContainer = document.querySelector('#market-content .stocks-container');
  const stockDetailsModal = document.getElementById('stock-details-modal');
  const modalCloseBtns = document.querySelectorAll('.close-modal');
  const addGoalBtn = document.querySelector('.add-goal-btn');
  const addGoalModal = document.getElementById('add-goal-modal');
  const addGoalForm = document.getElementById('add-goal-form');
  const balanceDisplaySpan = document.querySelector('.user-balance span');
  const transactionTableBody = document.querySelector('#transaction-table tbody');
  
  // App State
  let currentUserBalance = 245320;
  let transactions = [];
  let userPortfolio = {
    'HDFC Bank': { shares: 50, avgPrice: 1520, name: 'HDFC Bank' },
    'Reliance Industries': { shares: 35, avgPrice: 2750, name: 'Reliance Industries' },
    'Infosys': { shares: 45, avgPrice: 1480, name: 'Infosys' },
  };
  let userGoals = [
    { name: 'Emergency Fund', icon: 'shield-alt', targetAmount: 300000, currentSavings: 150000, targetDate: '2024-12-31' },
    { name: 'New Car', icon: 'car', targetAmount: 700000, currentSavings: 210000, targetDate: '2025-06-30' }
  ];
  
  // Charts
  let spendingChart = null;
  let portfolioChart = null;
  let stockChart = null;
  
  // Language translations
  const translations = {
    en: {
      balance: "Balance",
      dashboard: "Dashboard",
      income: "Income",
      article: "Article",
      investment: "Investment",
      news: "News",
      goals: "Goals",
      transactions: "Transaction Log",
      letsPlay: "Let's play!",
      backToDashboard: "Back to Dashboard",
      monthlyIncome: "Monthly Income",
      monthlyExpenses: "Monthly Expenses",
      savings: "Savings",
      expenseBreakdown: "Expense Breakdown",
      housing: "Housing",
      food: "Food",
      transportation: "Transportation",
      entertainment: "Entertainment",
      others: "Others",
      monthlySpendingTrends: "Monthly Spending Trends",
      yourSavingsGoals: "Your Savings Goals",
      addNewGoal: "Add New Goal",
      target: "Target",
      saved: "Saved",
      addFunds: "Add Funds",
      edit: "Edit",
      financialCalculators: "Financial Calculators",
      sipCalculator: "SIP Calculator",
      monthlyInvestment: "Monthly Investment",
      investmentPeriod: "Investment Period",
      expectedReturn: "Expected Return",
      calculate: "Calculate",
      investedAmount: "Invested Amount",
      estimatedReturns: "Estimated Returns",
      totalValue: "Total Value"
    },
    hi: {
      balance: "बैलेंस",
      dashboard: "डैशबोर्ड",
      income: "आय",
      article: "लेख",
      investment: "निवेश",
      news: "समाचार",
      goals: "लक्ष्य",
      transactions: "लेनदेन लॉग",
      letsPlay: "चलो खेलें!",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      monthlyIncome: "मासिक आय",
      monthlyExpenses: "मासिक खर्च",
      savings: "बचत",
      expenseBreakdown: "खर्च का विवरण",
      housing: "आवास",
      food: "भोजन",
      transportation: "परिवहन",
      entertainment: "मनोरंजन",
      others: "अन्य",
      monthlySpendingTrends: "मासिक खर्च के रुझान",
      yourSavingsGoals: "आपके बचत लक्ष्य",
      addNewGoal: "नया लक्ष्य जोड़ें",
      target: "लक्ष्य",
      saved: "बचाया",
      addFunds: "धन जोड़ें",
      edit: "संपादित करें",
      financialCalculators: "वित्तीय कैलकुलेटर",
      sipCalculator: "एसआईपी कैलकुलेटर",
      monthlyInvestment: "मासिक निवेश",
      investmentPeriod: "निवेश अवधि",
      expectedReturn: "अपेक्षित रिटर्न",
      calculate: "गणना करें",
      investedAmount: "निवेशित राशि",
      estimatedReturns: "अनुमानित रिटर्न",
      totalValue: "कुल मूल्य"
    },
    kn: {
      balance: "ಬ್ಯಾಲೆನ್ಸ್",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      income: "ಆದಾಯ",
      article: "ಲೇಖನ",
      investment: "ಹೂಡಿಕೆ",
      news: "ಸುದ್ದಿ",
      goals: "ಗುರಿಗಳು",
      transactions: "ವಹಿವಾಟು ಲಾಗ್",
      letsPlay: "ಆಡೋಣ!",
      backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
      monthlyIncome: "ಮಾಸಿಕ ಆದಾಯ",
      monthlyExpenses: "ಮಾಸಿಕ ಖರ್ಚು",
      savings: "ಉಳಿತಾಯ",
      expenseBreakdown: "ಖರ್ಚು ವಿಭಜನೆ",
      housing: "ವಸತಿ",
      food: "ಆಹಾರ",
      transportation: "ಸಾರಿಗೆ",
      entertainment: "ಮನರಂಜನೆ",
      others: "ಇತರರು",
      monthlySpendingTrends: "ಮಾಸಿಕ ಖರ್ಚು ಪ್ರವೃತ್ತಿಗಳು",
      yourSavingsGoals: "ನಿಮ್ಮ ಉಳಿತಾಯ ಗುರಿಗಳು",
      addNewGoal: "ಹೊಸ ಗುರಿ ಸೇರಿಸಿ",
      target: "ಗುರಿ",
      saved: "ಉಳಿಸಲಾಗಿದೆ",
      addFunds: "ಹಣ ಸೇರಿಸಿ",
      edit: "ಸಂಪಾದಿಸಿ",
      financialCalculators: "ಹಣಕಾಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
      sipCalculator: "ಎಸ್‌ಐಪಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      monthlyInvestment: "ಮಾಸಿಕ ಹೂಡಿಕೆ",
      investmentPeriod: "ಹೂಡಿಕೆ ಅವಧಿ",
      expectedReturn: "ನಿರೀಕ್ಷಿತ ಆದಾಯ",
      calculate: "ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
      investedAmount: "ಹೂಡಿಕೆ ಮಾಡಿದ ಮೊತ್ತ",
      estimatedReturns: "ಅಂದಾಜು ಆದಾಯ",
      totalValue: "ಒಟ್ಟು ಮೌಲ್ಯ"
    }
  };
  
  // Month navigation and financial updates
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Initialize finance data
  const financeData = {
    salary: 75000,
    expenses: {
      housing: 15750,
      food: 11250,
      transportation: 6750,
      entertainment: 4500,
      others: 6750
    },
    savings: 30000,
    stockImpact: 0
  };
  
  // Add these variables at the top with other state variables
  const monthlyIncome = 75000; // Fixed monthly income
  let monthlyExpenses = 45000; // Fixed monthly expenses
  let incomeCollected = false;
  let expensesPaid = false;
  
  // Initial UI Updates & Data Setup
  function initializeApp() {
    updateBalanceDisplay();
    renderPortfolioHoldings(); 
    renderGoals();
    renderMarketStocks();
    addTransaction('Initial Balance', 'User starting account balance', 0, true);
    // Example transactions - these will now correctly use the balance from userPortfolio for stock value
    const hdfcInitialValue = (userPortfolio['HDFC Bank']?.shares || 0) * (userPortfolio['HDFC Bank']?.avgPrice || 0);
    const relianceInitialValue = (userPortfolio['Reliance Industries']?.shares || 0) * (userPortfolio['Reliance Industries']?.avgPrice || 0);
    const infyInitialValue = (userPortfolio['Infosys']?.shares || 0) * (userPortfolio['Infosys']?.avgPrice || 0);
    currentUserBalance -= (hdfcInitialValue + relianceInitialValue + infyInitialValue); // Adjust initial balance to reflect portfolio cost
    addTransaction('Portfolio Setup', 'Cost of initial HDFC Bank shares', -hdfcInitialValue, true);
    addTransaction('Portfolio Setup', 'Cost of initial Reliance Industries shares', -relianceInitialValue, true);
    addTransaction('Portfolio Setup', 'Cost of initial Infosys shares', -infyInitialValue, true);

    addTransaction('Salary Deposit', 'Monthly Salary', 75000, true); // Example income
    currentUserBalance += 75000; // Manually adjust for this initial income after portfolio deduction

    renderTransactionLog(); 
    updateBalanceDisplay(); // Final balance update after all initial setup
  }
  
  initializeApp();
  
  // Event Listeners
  playButton.addEventListener('click', () => showSection('dashboard'));
  
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentSectionId = this.closest('.section').id;
      if (stockDetailsModal.style.display === 'flex') {
        closeModal(stockDetailsModal);
        // No section change, just close modal. Assumes user is in 'investment' section.
      } else if ([ 'income', 'article', 'investment', 'news', 'goals', 'transactions'].includes(currentSectionId)){
        showSection('dashboard');
      } else {
        showSection('dashboard'); 
      }
    });
  });
  
  dashboardOptions.forEach(option => {
    option.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      showSection(target);
      if (target === 'income') initSpendingChart();
      else if (target === 'investment') {
        initPortfolioChart(); 
        renderPortfolioHoldings(); 
        renderMarketStocks(); 
      }
      else if (target === 'transactions') renderTransactionLog();
      else if (target === 'goals') renderGoals(); 
    });
  });
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const parentElement = this.parentElement;
      const tabTarget = this.getAttribute('data-tab');
      parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const contentContainerSelector = parentElement.classList.contains('finance-tabs') ? '#income .tab-content' : '#investment .tab-content';
      document.querySelectorAll(contentContainerSelector).forEach(c => c.classList.add('hidden'));
      const targetContent = document.getElementById(tabTarget + '-content');
      if (targetContent) {
        targetContent.classList.remove('hidden');
        if (tabTarget === 'overview') initSpendingChart();
        else if (tabTarget === 'portfolio') { initPortfolioChart(); renderPortfolioHoldings(); }
        else if (tabTarget === 'market') renderMarketStocks();
      }
    });
  });
  
  calcTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const calcType = this.getAttribute('data-calc');
      this.parentElement.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      this.closest('.calculators').querySelectorAll('.calculator-content').forEach(c => c.style.display = 'none');
      const targetCalc = document.getElementById(calcType + '-calculator');
      if (targetCalc) targetCalc.style.display = 'block';
    });
  });
  
  document.querySelector('.calculate-btn')?.addEventListener('click', calculateSIP);

  // Event delegation for dynamically created stock cards in market view
  if(marketStocksContainer){
    marketStocksContainer.addEventListener('click', function(e){
        const target = e.target;
        const stockCard = target.closest('.stock-card.interactive');
        if (!stockCard) return;

        const stockName = stockCard.querySelector('h3').textContent;

        if(target.closest('.trade-btn')){
            const action = target.closest('.trade-btn').classList.contains('buy') ? 'buy' : 'sell';
            const stockPrice = parseFloat(target.closest('.trade-btn').getAttribute('data-price'));
            openTradeModal(stockName, action, stockPrice);
        } else if (target.closest('.details-btn')){
            showStockDetails(stockName);
        } else {
            // Click on card itself (not buttons)
            showStockDetails(stockName);
        }
    });
  }

  modalCloseBtns.forEach(btn => btn.addEventListener('click', function() { closeModal(this.closest('.modal')); }));
  addGoalBtn?.addEventListener('click', () => { 
    addGoalForm.reset(); 
    addGoalModal.removeAttribute('data-editing-goal-name'); 
    openModal(addGoalModal);
  });
  addGoalForm?.addEventListener('submit', handleGoalFormSubmit);

  // Core Functions: Navigation, Balance, Transactions
  function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.animation = 'none';
      targetSection.offsetHeight; 
      targetSection.style.animation = 'fadeIn 0.5s ease forwards';
    }
  }
  
  function updateBalanceDisplay() {
    const balanceAmount = document.getElementById('balance-amount');
    if (balanceAmount) {
      balanceAmount.textContent = `₹${currentUserBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
  }
  
  function addTransaction(type, description, amount, isInitial = false) {
    let newBalanceAfterTx = currentUserBalance + amount;
    if (isInitial && type === 'Initial Balance') {
        newBalanceAfterTx = currentUserBalance; // Initial balance doesn't change itself from a zero transaction
    } else if (isInitial) {
        // For other initial transactions, this will be the balance *after* this specific setup transaction
        // The global currentUserBalance is managed by initializeApp for setup items.
    } 

    transactions.push({
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'}),
      type,
      description,
      amount, 
      balanceAfter: newBalanceAfterTx 
    });
    
    if (!isInitial) {
        updateBalanceDisplay();
    }
    // Always render the log if the transaction log page is active or if it's an initial setup
    if (document.getElementById('transactions')?.classList.contains('active') || isInitial) {
        renderTransactionLog(); 
    }
  }
  
  function renderTransactionLog() {
    if (!transactionTableBody) return;
    transactionTableBody.innerHTML = ''; 
    [...transactions].reverse().forEach(tx => {
      const row = transactionTableBody.insertRow();
      row.insertCell().textContent = `${tx.date} ${tx.time}`;
      row.insertCell().textContent = tx.type;
      row.insertCell().textContent = tx.description;
      const amountCell = row.insertCell();
      amountCell.textContent = `${tx.amount < 0 ? '-' : '+'}₹${Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      amountCell.className = tx.amount < 0 ? 'amount-debit' : 'amount-credit';
      row.insertCell().textContent = `₹${tx.balanceAfter.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    });
  }
  
  // Stock Trading & Portfolio
  function openTradeModal(stockName, action, price) {
    const quantity = parseInt(prompt(`Enter quantity to ${action} ${stockName} at ₹${price.toFixed(2)}:`, "10"));
    if (isNaN(quantity) || quantity <= 0) {
      alert('Invalid quantity.');
      return;
    }
    if (action === 'buy') buyStock(stockName, quantity, price);
    else if (action === 'sell') sellStock(stockName, quantity, price);
  }
  
  function buyStock(stockName, quantity, pricePerShare) {
    const totalCost = quantity * pricePerShare;
    if (currentUserBalance < totalCost) {
      alert('Insufficient balance to buy shares.');
      return;
    }
    currentUserBalance -= totalCost; // Update balance
    addTransaction('Stock Purchase', `Bought ${quantity} ${stockName} @ ₹${pricePerShare.toFixed(2)}`, -totalCost);
    const stockData = getMockMarketData()[stockName] || {name: stockName}; // Get full stock data if possible
    if (userPortfolio[stockName]) {
      const oldShares = userPortfolio[stockName].shares;
      const oldAvgPrice = userPortfolio[stockName].avgPrice;
      userPortfolio[stockName].shares += quantity;
      userPortfolio[stockName].avgPrice = ((oldShares * oldAvgPrice) + (quantity * pricePerShare)) / userPortfolio[stockName].shares;
    } else {
      userPortfolio[stockName] = { shares: quantity, avgPrice: pricePerShare, name: stockData.name };
    }
    alert(`Successfully bought ${quantity} shares of ${stockName}.`);
    renderPortfolioHoldings();
    if (portfolioChart) updatePortfolioChart(document.querySelector('#portfolio-content .chart-period .period-btn.active')?.textContent || '1W');
  }
  
  function sellStock(stockName, quantity, pricePerShare) {
    if (!userPortfolio[stockName] || userPortfolio[stockName].shares < quantity) {
      alert('Not enough shares to sell.');
      return;
    }
    const totalProceeds = quantity * pricePerShare;
    currentUserBalance += totalProceeds; // Update balance
    addTransaction('Stock Sale', `Sold ${quantity} ${stockName} @ ₹${pricePerShare.toFixed(2)}`, totalProceeds);
    userPortfolio[stockName].shares -= quantity;
    if (userPortfolio[stockName].shares === 0) {
      delete userPortfolio[stockName];
    }
    alert(`Successfully sold ${quantity} shares of ${stockName}.`);
    renderPortfolioHoldings();
    if (portfolioChart) updatePortfolioChart(document.querySelector('#portfolio-content .chart-period .period-btn.active')?.textContent || '1W');
  }
  
  function renderPortfolioHoldings() {
    const portfolioHoldingsContainer = document.querySelector('#portfolio-content .portfolio-holdings');
    if (!portfolioHoldingsContainer) return;
    let holdingsHTML = '<h3>Your Holdings</h3>';
    let currentTotalPortfolioValue = 0;
    let totalInvestedValue = 0;
    const currentMarketPrices = getMarketDataForPortfolio();

    for (const stockName in userPortfolio) {
        const holding = userPortfolio[stockName];
        const currentPrice = currentMarketPrices[stockName] ? currentMarketPrices[stockName].price : holding.avgPrice;
        const currentValue = holding.shares * currentPrice;
        const investedValue = holding.shares * holding.avgPrice;
        currentTotalPortfolioValue += currentValue;
        totalInvestedValue += investedValue;
        const profitLoss = currentValue - investedValue;
        const profitLossPercent = (investedValue > 0) ? (profitLoss / investedValue) * 100 : 0;
        holdingsHTML += `
            <div class="holding-item" data-stock-name="${stockName}">
                <div class="holding-info"><h4>${holding.name}</h4><p>${holding.shares} shares @ ₹${holding.avgPrice.toFixed(2)}</p></div>
                <div class="holding-value"><p class="current-value">₹${currentValue.toLocaleString(undefined, {mf:2,xf:2})}</p><p class="profit ${profitLoss >= 0 ? 'increase' : 'decrease'}">${profitLoss >= 0 ? '+' : ''}₹${Math.abs(profitLoss).toLocaleString(undefined,{mf:2,xf:2})} (${profitLossPercent.toFixed(2)}%)</p></div>
                <div class="holding-actions"><button class="trade-btn buy" data-price="${currentPrice}">Buy More</button><button class="trade-btn sell" data-price="${currentPrice}">Sell</button></div>
            </div>`;
    }
    if(Object.keys(userPortfolio).length === 0) holdingsHTML += '<p>You have no holdings in your portfolio.</p>';
    portfolioHoldingsContainer.innerHTML = holdingsHTML;

    const summaryCards = document.querySelectorAll('#portfolio-content .portfolio-summary .summary-card p.value');
    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = `₹${currentTotalPortfolioValue.toLocaleString(undefined,{mf:2,xf:2})}`;
        const randomFluctuation = (Math.random() - 0.5) * 0.02 * currentTotalPortfolioValue;
        summaryCards[1].textContent = `${randomFluctuation >=0 ? '+':'-'}₹${Math.abs(randomFluctuation).toLocaleString(undefined,{mf:2,xf:2})} (${(currentTotalPortfolioValue > 0 ? (randomFluctuation/currentTotalPortfolioValue*100) : 0).toFixed(2)}%)`;
        summaryCards[1].className = `value ${randomFluctuation >= 0 ? 'increase' : 'decrease'}`;
        const overallReturn = currentTotalPortfolioValue - totalInvestedValue;
        summaryCards[2].textContent = `${overallReturn >=0 ? '+':'-'}₹${Math.abs(overallReturn).toLocaleString(undefined,{mf:2,xf:2})} (${(totalInvestedValue > 0 ? (overallReturn/totalInvestedValue*100):0).toFixed(2)}%)`;
        summaryCards[2].className = `value ${overallReturn >= 0 ? 'increase' : 'decrease'}`;
    }
    // Add event listeners to portfolio trade buttons using delegation on parent
    portfolioHoldingsContainer.addEventListener('click', function(e){
        if(e.target.classList.contains('trade-btn')){
            const action = e.target.classList.contains('buy') ? 'buy' : 'sell';
            const stockName = e.target.closest('.holding-item').getAttribute('data-stock-name');
            const stockPrice = parseFloat(e.target.getAttribute('data-price'));
            openTradeModal(stockName, action, stockPrice);
        }
    });
}

function getMarketDataForPortfolio() { 
    const marketData = getMockMarketData();
    let portfolioStockData = {};
    for(const stockKey in marketData){ portfolioStockData[marketData[stockKey].name] = marketData[stockKey]; }
    for (const stockName in userPortfolio) {
        if (!portfolioStockData[stockName]) {
            portfolioStockData[stockName] = { name: stockName, price: userPortfolio[stockName].avgPrice, changePercent: 0 };
        }
    }
    return portfolioStockData;
}

function renderMarketStocks() {
    if (!marketStocksContainer) return;
    marketStocksContainer.innerHTML = ''; 
    const marketData = getMockMarketData();
    for (const stockKey in marketData) {
        const stock = marketData[stockKey];
        const stockCard = document.createElement('div');
        stockCard.className = 'stock-card interactive';
        stockCard.innerHTML = `
            <div class="stock-info"><h3>${stock.name}</h3><p class="stock-price">₹${stock.price.toFixed(2)}</p></div>
            <div class="stock-change ${stock.changePercent >= 0 ? 'increase' : 'decrease'}"><span>${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(1)}%</span></div>
            <div class="stock-actions"><button class="trade-btn buy" data-price="${stock.price}">Buy</button><button class="trade-btn sell" data-price="${stock.price}">Sell</button><button class="details-btn"><i class="fas fa-info-circle"></i></button></div>`;
        marketStocksContainer.appendChild(stockCard);
    }
}
  // Charting Functions
  function initSpendingChart() {
    const ctx = document.getElementById('spendingChart'); if (!ctx) return;
    if (spendingChart) spendingChart.destroy();
    spendingChart = new Chart(ctx, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Income', data: [75000,78000,70000,80000,72000,77000], borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.1)', tension: 0.4, fill: true }, { label: 'Expenses', data: [45000,42000,50000,40000,48000,46000], borderColor: '#F44336', backgroundColor: 'rgba(244,67,54,0.1)', tension: 0.4, fill: true }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Income vs Expenses (Last 6 Months)' }}, scales: { y: { beginAtZero: false, ticks: { callback: value => '₹' + value.toLocaleString() }}} }});
  }

  function initPortfolioChart() {
    const ctx = document.getElementById('portfolioChart'); if (!ctx) return;
    if (portfolioChart) portfolioChart.destroy();
    portfolioChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [{ label: 'Portfolio Value', data: [], borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.1)', tension: 0.4, fill: true }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Portfolio Performance' }}, scales: { y: { ticks: { callback: value => '₹' + value.toLocaleString() }}} }});
    updatePortfolioChart(document.querySelector('#portfolio-content .chart-period .period-btn.active')?.textContent || '1W');
  }

  function updatePortfolioChart(period) {
    if (!portfolioChart) return;
    let labels = []; let data = []; let titleText = '';
    const currentPFValue = getCurrentPortfolioValue();
    let historyPoints = [];
    let days = 7;
    if (period === '1M') days = 30; else if (period === '3M') days = 90; else if (period === '6M') days = 180; else if (period === '1Y') days = 365; else if (period === 'All') days = 365 * 2; // Max 2 years back for mock

    let val = currentPFValue;
    for (let i = 0; i < days; i++) {
        if(i > 0) val /= (1 + (Math.random() * 0.01 - 0.005)); // Small daily fluctuation for history
        historyPoints.unshift(Math.max(0, val)); // Ensure no negative value
        if (days <= 30) labels.unshift(i === 0 ? 'Today' : `${i}d ago`);
        else if (days <= 365) labels.unshift(i === 0 ? 'Today' : `${Math.floor(i/7)}w ago`);
        else labels.unshift(i === 0 ? 'Today' : `${Math.floor(i/30)}m ago`);
    }
    // Simplify labels for longer periods
    if (days > 30) labels = labels.filter((_,idx) => idx % Math.floor(days/10) === 0 || idx === labels.length-1); // Show about 10 labels + today
    if (days > 30) historyPoints = historyPoints.filter((_,idx) => idx % Math.floor(days/10) === 0 || idx === historyPoints.length-1);
    data = historyPoints;
    titleText = `${period} Performance`;
    
    portfolioChart.data.labels = labels;
    portfolioChart.data.datasets[0].data = data;
    portfolioChart.options.plugins.title.text = titleText;
    portfolioChart.update();
  }

  function getCurrentPortfolioValue() {
    let total = 0;
    const currentMarketPrices = getMarketDataForPortfolio();
    for (const stockName in userPortfolio) {
        const holding = userPortfolio[stockName];
        const currentPrice = currentMarketPrices[stockName] ? currentMarketPrices[stockName].price : holding.avgPrice;
        total += holding.shares * currentPrice;
    }
    return total;
  }
  
  // SIP & Budget (no balance impact currently)
  function calculateSIP() { const mi=parseFloat(document.getElementById('monthly-investment').value)||0, y=parseFloat(document.getElementById('investment-period').value)||0, er=parseFloat(document.getElementById('expected-return').value)||0, m=y*12, mr=er/12/100, amt=mi*((Math.pow(1+mr,m)-1)/mr)*(1+mr), ia=mi*m, esr=amt-ia; const res=document.querySelectorAll('.result-value'); res[0].textContent='₹'+Math.round(ia).toLocaleString(); res[1].textContent='₹'+Math.round(esr).toLocaleString(); res[2].textContent='₹'+Math.round(amt).toLocaleString(); }

  // Stock Details Modal & Chart
  function showStockDetails(stockName) {
    const modal = stockDetailsModal; if (!modal) return;
    const allStockData = getMockMarketData();
    const stock = allStockData[stockName] || userPortfolio[stockName] || { name: stockName, code: 'NSE: UNKNOWN', price: 1000, changePercent: 0 }; 
    const price = stock.price || (userPortfolio[stockName] ? userPortfolio[stockName].avgPrice : 1000);

    modal.querySelector('#stock-name').textContent = stock.name || stockName;
    modal.querySelector('#stock-code').textContent = stock.code || 'NSE: UNKNOWN';
    modal.querySelector('#stock-current-price').textContent = `₹${price.toFixed(2)}`;
    const priceChangeEl = modal.querySelector('#stock-price-change');
    const changeVal = price * ((stock.changePercent || 0) / 100);
    priceChangeEl.textContent = `${changeVal >= 0 ? '+' : ''}₹${Math.abs(changeVal).toFixed(2)} (${(stock.changePercent || 0).toFixed(2)}%)`;
    priceChangeEl.className = (stock.changePercent || 0) >= 0 ? 'increase' : 'decrease';
    
    modal.querySelector('#stock-market-cap').textContent = stock.marketCap || getRandomFinancial('marketCap');
    modal.querySelector('#stock-pe').textContent = (stock.pe || getRandomFinancial('pe')).toString();
    modal.querySelector('#stock-eps').textContent = `₹${(stock.eps || getRandomFinancial('eps')).toString()}`;
    modal.querySelector('#stock-dividend').textContent = `${(stock.dividend || getRandomFinancial('dividend')).toString()}%`;
    modal.querySelector('#stock-52-high').textContent = `₹${(stock.high52 || getRandomFinancial('high52')).toString()}`;
    modal.querySelector('#stock-52-low').textContent = `₹${(stock.low52 || getRandomFinancial('low52')).toString()}`;
    modal.querySelector('#stock-volume').textContent = stock.volume || getRandomFinancial('volume').toString();
    modal.querySelector('#stock-avg-volume').textContent = stock.avgVolume || getRandomFinancial('avgVolume').toString();

    ['2022', '2021', '2020'].forEach(year => {
      modal.querySelector(`#revenue-${year}`).textContent = getRandomFinancial('revenue');
      modal.querySelector(`#profit-${year}`).textContent = getRandomFinancial('profit');
      modal.querySelector(`#eps-${year}`).textContent = getRandomFinancial('eps');
      modal.querySelector(`#de-${year}`).textContent = getRandomFinancial('de');
    });
    initStockDetailChart(stockName, price); 
    openModal(modal);
    modal.querySelector('.stock-actions-footer .buy').onclick = () => openTradeModal(stockName, 'buy', price);
    modal.querySelector('.stock-actions-footer .sell').onclick = () => openTradeModal(stockName, 'sell', price);
  }

  function getMockMarketData() { 
    return {
      'HDFC Bank': { name: 'HDFC Bank', price: 1570.25, changePercent: 0.5, code: 'NSE:HDFCBANK', marketCap: '₹8.80L Cr', pe: 22.9, eps: 68.55, dividend: 1.22, high52: 1790.00, low52: 1330.50, volume: '48.2 L', avgVolume: '40.1 L' },
      'Reliance Industries': { name: 'Reliance Industries', price: 2855.60, changePercent: 1.2, code: 'NSE:RELIANCE', marketCap: '₹19.25L Cr', pe: 31.8, eps: 90.10, dividend: 0.75, high52: 2980.00, low52: 2300.00, volume: '65.0 L', avgVolume: '60.5 L' },
      'Infosys': { name: 'Infosys', price: 1450.80, changePercent: -0.8, code: 'NSE:INFY', marketCap: '₹6.15L Cr', pe: 25.0, eps: 58.00, dividend: 1.85, high52: 1600.50, low52: 1250.00, volume: '35.5 L', avgVolume: '33.0 L' },
      'Tata Consultancy': { name: 'Tata Consultancy', price: 3480.00, changePercent: 0.9, code: 'NSE:TCS', marketCap: '₹12.75L Cr', pe: 28.9, eps: 120.80, dividend: 2.25, high52: 3720.00, low52: 3100.00, volume: '28.0 L', avgVolume: '25.5 L' },
      'ICICI Bank': { name: 'ICICI Bank', price: 950.75, changePercent: 1.1, code: 'NSE:ICICIBANK', marketCap: '₹6.70L Cr', pe: 20.5, eps: 46.30, dividend: 1.0, high52: 1000.00, low52: 700.00, volume: '55.0 L', avgVolume: '50.0 L' },
    };
  }

  function getRandomFinancial(type) {
    switch(type) {
      case 'revenue': return `₹${(Math.random()*40000+15000).toFixed(0)} Cr`; case 'profit': return `₹${(Math.random()*7000+1500).toFixed(0)} Cr`;
      case 'eps': return (Math.random()*80+25).toFixed(2); case 'de': return (Math.random()*1.2+0.2).toFixed(2);
      case 'marketCap': return `₹${(Math.random()*800000+200000).toFixed(0)} Cr`; case 'pe': return (Math.random()*25+12).toFixed(1);
      case 'dividend': return (Math.random()*2.5+0.8).toFixed(2); case 'high52': return (Math.random()*1500+1200).toFixed(2);
      case 'low52': return (Math.random()*1000+600).toFixed(2); case 'volume': return `${(Math.random()*80+15).toFixed(1)} L`;
      case 'avgVolume': return `${(Math.random()*70+25).toFixed(1)} L`; default: return 'N/A';
    }
  }

  function initStockDetailChart(stockName, currentPrice) { 
    const ctx = document.getElementById('stockChart'); if (!ctx) return;
    if (stockChart) stockChart.destroy();
    let price = currentPrice || 1000; const labels = []; const data = [];
    let historicPrice = price;
    for (let i = 29; i >= 0; i--) { 
      labels.unshift(i === 0 ? 'Today' : `${i}d`); 
      if (i < 29) historicPrice /= (1 + (Math.random() * 0.04 - 0.02));
      data.unshift(Math.max(0, historicPrice)); 
    }
    data[29] = price; // Ensure today's price is accurate
    stockChart = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: stockName+' Price', data, borderColor: '#2196F3', backgroundColor: 'rgba(33,150,243,0.1)', tension: 0.1, fill: true, pointRadius:1, borderWidth:1.5 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${ctx.raw.toFixed(2)}` }}}, scales: { x: { display:true, ticks:{ autoSkip:true, maxTicksLimit:10 }}, y: { display:true, ticks:{ callback: val => `₹${val.toLocaleString()}` }}} , interaction:{ intersect:false, mode:'index'}}});
  }

  // Goals Management
  function handleGoalFormSubmit(e) {
    e.preventDefault();
    const editingGoalName = addGoalModal.getAttribute('data-editing-goal-name');
    const goalName = document.getElementById('goal-name').value.trim();
    const icon = document.getElementById('goal-icon').value;
    const target = parseFloat(document.getElementById('goal-amount').value);
    const current = parseFloat(document.getElementById('goal-current').value) || 0;
    const date = document.getElementById('goal-date').value;
    if (!goalName || isNaN(target) || target <= 0 || !date || current < 0 || current > target) {
      alert('Invalid goal data. Check amounts and ensure name/date are set.'); return;
    }
    const existingGoal = userGoals.find(g => g.name.toLowerCase() === goalName.toLowerCase());
    if (editingGoalName) { // Editing
        if (existingGoal && existingGoal.name !== editingGoalName) { alert('Goal name already exists.'); return; }
        const goalIdx = userGoals.findIndex(g => g.name === editingGoalName);
        if (goalIdx !== -1) userGoals[goalIdx] = { name: goalName, icon, targetAmount: target, currentSavings: current, targetDate: date };
    } else { // Adding new
        if (existingGoal) { alert('Goal name already exists.'); return; }
        userGoals.push({ name: goalName, icon, targetAmount: target, currentSavings: current, targetDate: date });
    }
    renderGoals(); closeModal(addGoalModal);
  }

  function renderGoals() {
    const container = document.querySelector('#goals .goals-list'); if (!container) return;
    container.innerHTML = '';
    userGoals.forEach(goal => {
      const progress = Math.min(100, (goal.currentSavings / goal.targetAmount * 100)).toFixed(0);
      const dateStr = new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('en-US', {y:'numeric',m:'long',d:'numeric'});
      const el = document.createElement('div'); el.className = 'goal-item'; el.dataset.goalName = goal.name;
      el.innerHTML = `
        <div class="goal-icon"><i class="fas fa-${goal.icon || 'bullseye'}"></i></div>
        <div class="goal-details"><h4>${goal.name}</h4><p class="goal-target">Target: ₹${goal.targetAmount.toLocaleString()}</p>
          <div class="goal-progress-container"><div class="goal-progress-bar"><div class="goal-progress" style="width:${progress}%;"></div></div><span class="goal-progress-text">₹${goal.currentSavings.toLocaleString()} saved (${progress}%)</span></div>
          <p class="goal-date">Target: ${dateStr}</p></div>
        <div class="goal-actions"><button class="add-funds-to-goal-btn"><i class="fas fa-plus"></i> Add</button><button class="goal-edit-btn"><i class="fas fa-edit"></i></button><button class="goal-delete-btn"><i class="fas fa-trash"></i></button></div>`;
      container.appendChild(el);
    });
    // Add event listeners using delegation on parent container
    container.addEventListener('click', function(e){
        const target = e.target.closest('button');
        if(!target) return;
        const goalItem = target.closest('.goal-item');
        const goalName = goalItem.dataset.goalName;

        if(target.classList.contains('add-funds-to-goal-btn')) handleAddFundsToGoalClick(goalName);
        else if(target.classList.contains('goal-edit-btn')) handleEditGoalClick(goalName);
        else if(target.classList.contains('goal-delete-btn')) handleDeleteGoalClick(goalName);
    });
  }
  
  function handleAddFundsToGoalClick(goalName) {
    const amountText = prompt(`Amount to add to "${goalName}":`); if (amountText === null) return;
    const amount = parseFloat(amountText);
    if (isNaN(amount) || amount <= 0) { alert('Invalid amount.'); return; }
    if (currentUserBalance < amount) { alert('Insufficient balance.'); return; }
    const goal = userGoals.find(g => g.name === goalName);
    if (goal) {
      goal.currentSavings = Math.min(goal.targetAmount, goal.currentSavings + amount);
      addTransaction('Goal Saving', `Added to ${goalName}`, -amount);
      renderGoals();
    } else alert('Goal not found.');
  }

  function handleEditGoalClick(goalName) {
    const goal = userGoals.find(g => g.name === goalName);
    if (goal) {
      addGoalForm.querySelector('#goal-name').value = goal.name;
      addGoalForm.querySelector('#goal-icon').value = goal.icon;
      addGoalForm.querySelector('#goal-amount').value = goal.targetAmount;
      addGoalForm.querySelector('#goal-current').value = goal.currentSavings;
      addGoalForm.querySelector('#goal-date').value = goal.targetDate; 
      addGoalModal.setAttribute('data-editing-goal-name', goal.name);
      openModal(addGoalModal);
    }
  }

  function handleDeleteGoalClick(goalName) {
    if (confirm(`Delete goal "${goalName}"?`)) {
      userGoals = userGoals.filter(g => g.name !== goalName);
      renderGoals();
    }
  }

  // Modal Utilities
  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    const handler = e => { if (e.target === modal) closeModal(modal); };
    modal.internalWindowClickHandler = handler; // Store for removal
    window.addEventListener('click', handler);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    if (modal.internalWindowClickHandler) {
      window.removeEventListener('click', modal.internalWindowClickHandler);
      delete modal.internalWindowClickHandler;
    }
  }

  // Function to change language
  function changeLanguage(lang) {
    // Store selected language in localStorage
    localStorage.setItem('selectedLanguage', lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      }
    });

    // Update all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    // Special handling for balance label (do not overwrite amount)
    const balanceLabel = document.querySelector('.user-balance [data-translate="balance"]');
    if (balanceLabel) {
      balanceLabel.textContent = translations[lang].balance;
    }

    // Update back buttons
    document.querySelectorAll('.back-button').forEach(btn => {
      btn.textContent = translations[lang].backToDashboard;
    });

    // Update section titles
    document.querySelector('#dashboard h2').textContent = translations[lang].dashboard;
    document.querySelector('#income h2').textContent = translations[lang].income;
    document.querySelector('#article h2').textContent = translations[lang].article;
    document.querySelector('#investment h2').textContent = translations[lang].investment;
    document.querySelector('#news h2').textContent = translations[lang].news;
    document.querySelector('#goals h2').textContent = translations[lang].goals;
    document.querySelector('#transactions h2').textContent = translations[lang].transactions;
  }

  // Initialize language and attach event listeners after DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLanguage);

    // Add click event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        changeLanguage(btn.dataset.lang);
      });
    });
  });

  // Update month display
  function updateMonthDisplay() {
    const monthDisplay = document.getElementById('currentMonthDisplay');
    if (monthDisplay) {
      monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
  }

  // Calculate total expenses
  function calculateTotalExpenses() {
    return Object.values(financeData.expenses).reduce((sum, expense) => sum + expense, 0);
  }

  // Update financial data for next month
  function updateFinancialData() {
    // Update salary with a small random increase (0-5%)
    
   //inanceData.salary = Math.round(financeData.salary * salaryIncrease);

    // Update expenses with small random changes (-2% to +2%)
    Object.keys(financeData.expenses).forEach(category => {
      const change = 0.98 + (Math.random() * 0.04);
      financeData.expenses[category] = Math.round(financeData.expenses[category] * change);
    });

    // Update savings
    const totalExpenses = calculateTotalExpenses();
    financeData.savings = financeData.salary - totalExpenses;

    // Update UI
    updateFinancialDisplay();
  }

  // Update financial display
  function updateFinancialDisplay() {
    // Update income card
    const incomeAmount = document.querySelector('.income-card:nth-child(1) .amount');
    if (incomeAmount) {
      incomeAmount.textContent = `₹${financeData.salary.toLocaleString()}`;
    }

    // Update expenses card
    const expensesAmount = document.querySelector('.income-card:nth-child(2) .amount');
    if (expensesAmount) {
      expensesAmount.textContent = `₹${calculateTotalExpenses().toLocaleString()}`;
    }

    // Update savings card
    const savingsAmount = document.querySelector('.income-card:nth-child(3) .amount');
    if (savingsAmount) {
      savingsAmount.textContent = `₹${financeData.savings.toLocaleString()}`;
    }

    // Update expense breakdown
    Object.entries(financeData.expenses).forEach(([category, amount], index) => {
      const expenseItem = document.querySelector(`.expense-item:nth-child(${index + 1})`);
      if (expenseItem) {
        const progressBar = expenseItem.querySelector('.progress');
        const amountSpan = expenseItem.querySelector('span:last-child');
        const percentage = (amount / calculateTotalExpenses()) * 100;
        
        progressBar.style.width = `${percentage}%`;
        amountSpan.textContent = `₹${amount.toLocaleString()}`;
      }
    });
  }

  // Add these functions after the existing functions
  function collectMonthlyIncome() {
    if (!incomeCollected) {
      currentUserBalance += monthlyIncome;
      addTransaction('Monthly Income', 'Salary deposit', monthlyIncome);
      incomeCollected = true;
      updateBalanceDisplay();
      
      // Update the income card display
      const incomeAmount = document.querySelector('.income-card:nth-child(1) .amount');
      if (incomeAmount) {
        incomeAmount.textContent = `₹${monthlyIncome.toLocaleString()}`;
      }
      
      alert('Monthly income collected successfully!');
    } else {
      alert('You have already collected this month\'s income.');
    }
  }

  function payMonthlyExpenses() {
    if (!expensesPaid) {
      if (currentUserBalance >= monthlyExpenses) {
        currentUserBalance -= monthlyExpenses;
        addTransaction('Monthly Expenses', 'Monthly expenses payment', -monthlyExpenses);
        expensesPaid = true;
        updateBalanceDisplay();
        
        // Update the expenses card display
        const expensesAmount = document.querySelector('.income-card:nth-child(2) .amount');
        if (expensesAmount) {
          expensesAmount.textContent = `₹${monthlyExpenses.toLocaleString()}`;
        }
        
        // Update savings display
        const savingsAmount = document.querySelector('.income-card:nth-child(3) .amount');
        if (savingsAmount) {
          const savings = monthlyIncome - monthlyExpenses;
          savingsAmount.textContent = `₹${savings.toLocaleString()}`;
        }
        
        alert('Monthly expenses paid successfully!');
      } else {
        alert('Insufficient balance to pay monthly expenses.');
      }
    } else {
      alert('You have already paid this month\'s expenses.');
    }
  }

  // Modify the nextMonthBtn click handler
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      if (!expensesPaid) {
        alert('Please pay your monthly expenses before moving to the next month.');
        return;
      }

      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      
      // Reset monthly flags
      incomeCollected = false;
      expensesPaid = false;
      
      updateMonthDisplay();
      
      // Disable button if we've reached the maximum month (current month)
      const now = new Date();
      if (currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
        nextMonthBtn.disabled = true;
      }
    });
  }

  // Initialize display
  updateMonthDisplay();
  updateFinancialDisplay();

  // Add this in the DOMContentLoaded event listener section
  document.getElementById('collectIncomeBtn')?.addEventListener('click', collectMonthlyIncome);
  document.getElementById('payExpensesBtn')?.addEventListener('click', payMonthlyExpenses);
}); 