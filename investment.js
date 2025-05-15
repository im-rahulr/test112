document.addEventListener('DOMContentLoaded', function() {
  console.log('Investment page initialized');
  
  // Initialize chart when the page loads
  initStockChart();
  
  // Get elements
  const stockCards = document.querySelectorAll('.stock-card');
  const stockView = document.querySelector('.stock-view');
  const stockListView = document.querySelector('.stock-list-view');
  const backNav = document.querySelector('.back-nav');
  const timeOptions = document.querySelectorAll('.time-option');
  let buyButton = document.querySelector('.buy-button');
  
  // Make sure cash display is created on page load
  updateCashDisplay();
  
  // Add time option event listeners
  timeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      timeOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Update chart with selected time period
      initStockChart(this.textContent);
    });
  });
  
  if (!stockView || !stockListView) {
    console.error('Stock view or stock list view not found');
  }
  
  if (!buyButton) {
    console.error('Buy button not found');
  }
  
  // Portfolio data
  let portfolio = {
    cash: 0, // Will be synced with user's balance
    holdings: []
  };
  
  // Stock data
  const stocks = {
    "ICICI Bank": {
      ticker: "ICICIBANK",
      price: 324.00,
      change: "+23.05",
      changePercent: "7.23",
      closingPrice: 300.00,
      weekHigh: 340.00,
      weekLow: 280.00,
      articlesAnalyzed: 300,
      sentiment: "Positive",
      volatility: "Medium",
      quantity: 0 // How many stocks the user owns
    },
    "HDFC Bank": {
      ticker: "HDFCBANK",
      price: 1562.45,
      change: "+23.20",
      changePercent: "1.5",
      closingPrice: 1539.25,
      weekHigh: 1650.00,
      weekLow: 1450.00,
      articlesAnalyzed: 275,
      sentiment: "Positive",
      volatility: "Low",
      quantity: 0
    },
    "Reliance Industries": {
      ticker: "RELIANCE",
      price: 2834.20,
      change: "+21.95",
      changePercent: "0.8",
      closingPrice: 2812.25,
      weekHigh: 2900.00,
      weekLow: 2700.00,
      articlesAnalyzed: 320,
      sentiment: "Positive",
      volatility: "Medium",
      quantity: 0
    },
    "Infosys": {
      ticker: "INFY",
      price: 1467.75,
      change: "-8.80",
      changePercent: "0.6",
      closingPrice: 1476.55,
      weekHigh: 1550.00,
      weekLow: 1400.00,
      articlesAnalyzed: 210,
      sentiment: "Neutral",
      volatility: "Medium",
      quantity: 0
    },
    "Tata Consultancy": {
      ticker: "TCS",
      price: 3456.90,
      change: "+40.15",
      changePercent: "1.2",
      closingPrice: 3416.75,
      weekHigh: 3500.00,
      weekLow: 3300.00,
      articlesAnalyzed: 290,
      sentiment: "Positive",
      volatility: "Low",
      quantity: 0
    }
  };
  
  // Current selected stock
  let currentStock = "ICICI Bank";
  
  // Sync with user's balance if available
  if (window.financeData) {
    portfolio.cash = window.financeData.getBalance();
    console.log('Synced balance from global finance data:', portfolio.cash);
    updateCashDisplay();
  } else {
    // Default balance for standalone operation
    portfolio.cash = 75000;
    console.log('Using default balance:', portfolio.cash);
    updateCashDisplay();
  }
  
  // Function to update cash display in UI
  function updateCashDisplay() {
    let cashDisplay = document.querySelector('.cash-display');
    
    if (!cashDisplay) {
      cashDisplay = document.createElement('div');
      cashDisplay.className = 'cash-display';
      
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer) {
        cashDisplay.innerHTML = `<p>Available Cash: <span>₹${portfolio.cash.toLocaleString()}</span></p>`;
        searchContainer.appendChild(cashDisplay);
      } else {
        console.error('Search container not found for cash display');
      }
    } else {
      const cashSpan = cashDisplay.querySelector('span');
      if (cashSpan) {
        cashSpan.textContent = `₹${portfolio.cash.toLocaleString()}`;
      } else {
        cashDisplay.innerHTML = `<p>Available Cash: <span>₹${portfolio.cash.toLocaleString()}</span></p>`;
      }
    }
    
    // Also update in other pages if possible
    if (window.financeData) {
      window.financeData.updateBalance(portfolio.cash);
    }
  }
  
  // When first loading, show the stock detail view by default (like in the image)
  if (stockView && stockListView) {
    stockView.style.display = 'flex';
    stockListView.style.display = 'none';
  }
  
  // Add Buy/Sell Toggle button
  function setupBuySellControls() {
    if (document.querySelector('.action-toggle')) {
      console.log('Buy/Sell controls already set up');
      return;
    }
    
    buyButton = document.querySelector('.buy-button');
    if (!buyButton) {
      console.error('Buy button not found for setup');
      return;
    }
    
    console.log('Setting up buy/sell controls');
    
    const buySellWrapper = document.createElement('div');
    buySellWrapper.className = 'buy-sell-wrapper';
    
    const actionToggle = document.createElement('div');
    actionToggle.className = 'action-toggle';
    actionToggle.innerHTML = `
      <button class="action-btn buy active">BUY</button>
      <button class="action-btn sell">SELL</button>
    `;
    
    // Add quantity input
    const quantityInput = document.createElement('div');
    quantityInput.className = 'quantity-input';
    quantityInput.innerHTML = `
      <label>Quantity</label>
      <div class="quantity-controls">
        <button class="qty-btn minus">-</button>
        <input type="number" min="1" value="1" class="qty-value">
        <button class="qty-btn plus">+</button>
      </div>
      <p class="total-value">Total: ₹324.00</p>
    `;
    
    // Store the original buy button parent and next sibling for reference
    const buyButtonParent = buyButton.parentNode;
    const originalNextSibling = buyButton.nextSibling;
    
    // Replace buy button with new controls
    if (buyButtonParent) {
      buyButtonParent.replaceChild(buySellWrapper, buyButton);
      buySellWrapper.appendChild(actionToggle);
      buySellWrapper.appendChild(quantityInput);
      buySellWrapper.appendChild(buyButton);
    } else {
      console.error('Buy button parent not found');
      return;
    }
    
    // Add Holdings button in header
    const stockHeader = document.querySelector('.stock-header');
    const headerMore = stockHeader ? stockHeader.querySelector('.more-options') : null;
    
    if (stockHeader && headerMore) {
      const holdingsBtn = document.createElement('button');
      holdingsBtn.className = 'holdings-btn';
      holdingsBtn.innerHTML = '<i class="fas fa-briefcase"></i>';
      
      // Insert before the more options button
      stockHeader.insertBefore(holdingsBtn, headerMore);
      
      // Holdings button click event
      holdingsBtn.addEventListener('click', function() {
        showHoldings();
      });
    } else {
      console.error('Stock header or more options button not found');
    }
    
    // Add the action type data attribute to the buy button
    buyButton.setAttribute('data-action', 'buy');
    
    // Add event listener to toggle buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        actionButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update button text and data-action
        const action = this.classList.contains('buy') ? 'buy' : 'sell';
        buyButton.textContent = action.toUpperCase();
        buyButton.setAttribute('data-action', action);
        
        // Update button color
        if (action === 'buy') {
          buyButton.classList.remove('sell-button');
          buyButton.classList.add('buy-button');
        } else {
          buyButton.classList.remove('buy-button');
          buyButton.classList.add('sell-button');
        }
        
        // Update available quantity for sell
        updateQuantityMax();
      });
    });
    
    // Quantity controls
    const qtyInput = document.querySelector('.qty-value');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    
    if (qtyInput && minusBtn && plusBtn) {
      minusBtn.addEventListener('click', function() {
        let val = parseInt(qtyInput.value);
        if (val > 1) {
          qtyInput.value = val - 1;
          updateTotalValue();
        }
      });
      
      plusBtn.addEventListener('click', function() {
        let val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
        updateTotalValue();
      });
      
      qtyInput.addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
        
        // If selling, don't allow more than owned quantity
        if (buyButton.getAttribute('data-action') === 'sell') {
          const maxQty = stocks[currentStock].quantity;
          if (parseInt(this.value) > maxQty) this.value = maxQty;
        }
        
        updateTotalValue();
      });
    } else {
      console.error('Quantity controls not found');
    }
    
    // Update total on initial load
    updateTotalValue();
  }
  
  // Setup buy/sell controls initially
  setupBuySellControls();
  
  // Buy button click event
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.classList.contains('buy-button') || e.target.classList.contains('sell-button'))) {
      const action = e.target.getAttribute('data-action') || 'buy';
      const qtyInput = document.querySelector('.qty-value');
      
      if (!qtyInput) {
        console.error('Quantity input not found');
        return;
      }
      
      const quantity = parseInt(qtyInput.value);
      const stock = stocks[currentStock];
      
      if (action === 'buy') {
        const totalCost = quantity * stock.price;
        
        if (portfolio.cash >= totalCost) {
          // Execute buy
          portfolio.cash -= totalCost;
          
          // Add or update holdings
          stock.quantity += quantity;
          
          // If not in holdings, add it
          if (!portfolio.holdings.includes(currentStock)) {
            portfolio.holdings.push(currentStock);
          }
          
          updateCashDisplay();
          updateQuantityMax();
          
          alert(`Successfully purchased ${quantity} shares of ${currentStock} for ₹${totalCost.toLocaleString()}`);
        } else {
          alert(`Insufficient funds! You need ₹${(totalCost - portfolio.cash).toLocaleString()} more to complete this purchase.`);
        }
      } else {
        // Execute sell
        if (stock.quantity >= quantity) {
          const totalValue = quantity * stock.price;
          
          portfolio.cash += totalValue;
          stock.quantity -= quantity;
          
          // If sold all, remove from holdings
          if (stock.quantity === 0) {
            const index = portfolio.holdings.indexOf(currentStock);
            if (index > -1) {
              portfolio.holdings.splice(index, 1);
            }
          }
          
          updateCashDisplay();
          updateQuantityMax();
          
          alert(`Successfully sold ${quantity} shares of ${currentStock} for ₹${totalValue.toLocaleString()}`);
        } else {
          alert(`You don't have enough shares to sell! You only own ${stock.quantity} shares.`);
        }
      }
    }
  });
  
  // Function to show holdings popup
  function showHoldings() {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.holdings-popup');
    if (existingPopup) {
      existingPopup.remove();
      return;
    }
    
    const holdingsPopup = document.createElement('div');
    holdingsPopup.className = 'holdings-popup';
    
    let holdingsHTML = '<h3>Your Portfolio</h3>';
    
    if (portfolio.holdings.length === 0) {
      holdingsHTML += '<p class="no-holdings">You don\'t own any stocks yet.</p>';
    } else {
      holdingsHTML += '<div class="holdings-list">';
      
      let totalValue = 0;
      portfolio.holdings.forEach(stockName => {
        const stock = stocks[stockName];
        const value = stock.quantity * stock.price;
        totalValue += value;
        
        holdingsHTML += `
          <div class="holding-item">
            <div class="holding-info">
              <h4>${stockName} (${stock.ticker})</h4>
              <p>${stock.quantity} shares @ ₹${stock.price.toLocaleString()}</p>
            </div>
            <div class="holding-value">
              <p>₹${value.toLocaleString()}</p>
            </div>
          </div>
        `;
      });
      
      holdingsHTML += '</div>';
      holdingsHTML += `<div class="portfolio-summary">
        <div class="summary-item">
          <p>Cash</p>
          <p>₹${portfolio.cash.toLocaleString()}</p>
        </div>
        <div class="summary-item">
          <p>Investments</p>
          <p>₹${totalValue.toLocaleString()}</p>
        </div>
        <div class="summary-item total">
          <p>Total Value</p>
          <p>₹${(portfolio.cash + totalValue).toLocaleString()}</p>
        </div>
      </div>`;
    }
    
    holdingsHTML += '<button class="close-popup">Close</button>';
    
    holdingsPopup.innerHTML = holdingsHTML;
    const investmentPage = document.querySelector('.investment-page');
    if (investmentPage) {
      investmentPage.appendChild(holdingsPopup);
      
      // Close button event
      const closeBtn = document.querySelector('.close-popup');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          holdingsPopup.remove();
        });
      }
    } else {
      console.error('Investment page container not found');
    }
  }
  
  // Add click event handlers to stock cards
  stockCards.forEach(card => {
    card.addEventListener('click', function() {
      const stockName = this.querySelector('h3').textContent;
      currentStock = stockName;
      
      // Update stock view with selected stock details
      updateStockView(stockName);
      
      // Show stock details view
      stockView.style.display = 'flex';
      stockListView.style.display = 'none';
    });
  });
  
  // Back navigation - show list view when back button is clicked
  if (backNav) {
    backNav.addEventListener('click', function(e) {
      e.preventDefault();
      stockView.style.display = 'none';
      stockListView.style.display = 'block';
    });
  }
  
  // Function to update stock view with selected stock details
  function updateStockView(stockName) {
    if (!stocks[stockName]) {
      console.error('Stock data not found for:', stockName);
      return;
    }
    
    const stock = stocks[stockName];
    
    // Update stock name and ticker
    document.querySelector('.stock-header h2').textContent = stockName + ' Ltd.';
    document.querySelector('.stock-name h2').textContent = stock.ticker;
    document.querySelector('.stock-name p').textContent = stockName + ' Ltd';
    
    // Update price information
    document.querySelector('.price-info h1').textContent = '₹ ' + stock.price.toFixed(2);
    
    const priceChange = document.querySelector('.price-change');
    priceChange.textContent = stock.change + ' (' + stock.changePercent + '%)';
    
    // Add positive or negative class based on price change
    if (parseFloat(stock.change) >= 0) {
      priceChange.classList.add('positive');
      priceChange.classList.remove('negative');
    } else {
      priceChange.classList.add('negative');
      priceChange.classList.remove('positive');
    }
    
    // Update price details
    document.querySelector('.price-details .price-item:nth-child(1) .value').textContent = '₹ ' + stock.closingPrice.toFixed(2);
    document.querySelector('.price-details .price-item:nth-child(2) .value').textContent = '₹ ' + stock.weekHigh.toFixed(2);
    document.querySelector('.price-details .price-item:nth-child(3) .value').textContent = stock.articlesAnalyzed;
    document.querySelector('.price-details .price-item:nth-child(4) .value').textContent = '₹ ' + stock.price.toFixed(2);
    document.querySelector('.price-details .price-item:nth-child(5) .value').textContent = '₹ ' + stock.weekLow.toFixed(2);
    
    const sentimentElement = document.querySelector('.price-details .price-item:nth-child(6) .value');
    sentimentElement.textContent = stock.sentiment;
    
    // Update sentiment class
    sentimentElement.className = 'value';
    if (stock.sentiment === 'Positive') {
      sentimentElement.classList.add('sentiment-positive');
    } else if (stock.sentiment === 'Negative') {
      sentimentElement.classList.add('sentiment-negative');
    } else {
      sentimentElement.classList.add('sentiment-neutral');
    }
    
    // Update chart with default time period (1D)
    const activeTimeOption = document.querySelector('.time-option.active');
    const timePeriod = activeTimeOption ? activeTimeOption.textContent : '1D';
    initStockChart(timePeriod);
    
    // Update total value in quantity input if it exists
    const totalValue = document.querySelector('.total-value');
    const qtyInput = document.querySelector('.qty-value');
    if (totalValue && qtyInput) {
      const qty = parseInt(qtyInput.value) || 1;
      totalValue.textContent = 'Total: ₹' + (stock.price * qty).toFixed(2);
    }
  }
  
  // Function to update total value
  function updateTotalValue() {
    const qtyInput = document.querySelector('.qty-value');
    const totalValueElem = document.querySelector('.total-value');
    
    if (!qtyInput || !totalValueElem) {
      console.error('Quantity input or total value element not found');
      return;
    }
    
    const qty = parseInt(qtyInput.value);
    const price = stocks[currentStock].price;
    const total = qty * price;
    totalValueElem.textContent = `Total: ₹${total.toLocaleString()}`;
  }
  
  // Function to update max quantity for sell actions
  function updateQuantityMax() {
    const actionToggle = document.querySelector('.action-toggle');
    if (!actionToggle) {
      console.error('Action toggle not found');
      return;
    }
    
    const buyButton = document.querySelector('.buy-button, .sell-button');
    if (!buyButton) {
      console.error('Buy/sell button not found');
      return;
    }
    
    const action = buyButton.getAttribute('data-action');
    
    if (action === 'sell') {
      const maxQty = stocks[currentStock].quantity;
      const qtyInput = document.querySelector('.qty-value');
      
      if (!qtyInput) {
        console.error('Quantity input not found');
        return;
      }
      
      if (maxQty === 0) {
        qtyInput.value = 0;
        qtyInput.disabled = true;
        buyButton.disabled = true;
        buyButton.style.opacity = 0.5;
      } else {
        qtyInput.disabled = false;
        buyButton.disabled = false;
        buyButton.style.opacity = 1;
        
        if (parseInt(qtyInput.value) > maxQty) {
          qtyInput.value = maxQty;
        }
      }
      
      updateTotalValue();
    } else {
      // Buy action
      const qtyInput = document.querySelector('.qty-value');
      
      if (!qtyInput) {
        console.error('Quantity input not found');
        return;
      }
      
      qtyInput.disabled = false;
      buyButton.disabled = false;
      buyButton.style.opacity = 1;
      
      // Ensure we can afford at least 1 share
      if (portfolio.cash < stocks[currentStock].price) {
        buyButton.disabled = true;
        buyButton.style.opacity = 0.5;
      }
    }
  }
  
  // Function to initialize the stock chart
  function initStockChart(timePeriod = '1D') {
    const ctx = document.getElementById('stockChart');
    
    if (!ctx) {
      console.error('Stock chart canvas element not found');
      return;
    }
    
    // Generate random data for demonstration
    const generateChartData = (period) => {
      const basePrice = stocks[currentStock].price - stocks[currentStock].change;
      let dataPoints = [];
      let labels = [];
      
      switch(period) {
        case '1D':
          // Hourly data for 1 day
          for (let i = 9; i <= 16; i++) {
            const hour = i > 12 ? (i - 12) + 'PM' : i + 'AM';
            labels.push(hour);
            
            // Random fluctuation around the base price
            const fluctuation = (Math.random() - 0.3) * 10;
            dataPoints.push(basePrice + fluctuation);
          }
          // Ensure the last point matches the current price
          dataPoints.push(stocks[currentStock].price);
          labels.push('4PM');
          break;
          
        case '1W':
          // Daily data for 1 week
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
          days.forEach(day => {
            labels.push(day);
            const fluctuation = (Math.random() - 0.3) * 15;
            dataPoints.push(basePrice + fluctuation);
          });
          // Ensure the last point matches the current price
          dataPoints[dataPoints.length - 1] = stocks[currentStock].price;
          break;
          
        case '1M':
          // Weekly data for 1 month
          for (let i = 1; i <= 4; i++) {
            labels.push('Week ' + i);
            const fluctuation = (Math.random() - 0.3) * 20;
            dataPoints.push(basePrice + fluctuation);
          }
          // Ensure the last point matches the current price
          dataPoints[dataPoints.length - 1] = stocks[currentStock].price;
          break;
          
        default:
          // Default to 1D
          for (let i = 9; i <= 16; i++) {
            const hour = i > 12 ? (i - 12) + 'PM' : i + 'AM';
            labels.push(hour);
            const fluctuation = (Math.random() - 0.3) * 10;
            dataPoints.push(basePrice + fluctuation);
          }
          // Ensure the last point matches the current price
          dataPoints.push(stocks[currentStock].price);
          labels.push('4PM');
      }
      
      return { labels, dataPoints };
    };
    
    const { labels, dataPoints } = generateChartData(timePeriod);
    
    // Calculate gradient colors
    const isPositive = stocks[currentStock].change > 0;
    const gradientColor = isPositive ? '#4CAF50' : '#f44336';
    const lineColor = isPositive ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)';
    
    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.height);
    gradient.addColorStop(0, isPositive ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    
    // Create or update chart
    if (window.stockChart) {
      window.stockChart.data.labels = labels;
      window.stockChart.data.datasets[0].data = dataPoints;
      window.stockChart.data.datasets[0].borderColor = lineColor;
      window.stockChart.data.datasets[0].backgroundColor = gradient;
      window.stockChart.update();
    } else {
      window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: stocks[currentStock].ticker,
            data: dataPoints,
            borderColor: lineColor,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: lineColor,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            tension: 0.3,
            fill: true,
            backgroundColor: gradient
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1e1e1e',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#333',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return '₹ ' + context.raw.toFixed(2);
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                color: '#666',
                font: {
                  size: 10
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: '#666',
                font: {
                  size: 10
                },
                callback: function(value) {
                  return '₹ ' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }
  }

  // Stock impact calculation based on news sentiment
  function calculateStockImpact(sentiment) {
    // Convert sentiment to a number between -1 and 1
    let sentimentValue;
    switch(sentiment.toLowerCase()) {
      case 'positive':
        sentimentValue = 1;
        break;
      case 'negative':
        sentimentValue = -1;
        break;
      case 'neutral':
        sentimentValue = 0;
        break;
      default:
        sentimentValue = 0;
    }

    // Calculate impact percentage (-5% to +5%)
    const impactPercentage = sentimentValue * (Math.random() * 5);
    return impactPercentage;
  }

  // Update stock prices based on news impact
  function updateStockPrices() {
    const stocks = {
      'HDFC Bank': { price: 1520, sentiment: 'positive' },
      'Reliance Industries': { price: 2750, sentiment: 'neutral' },
      'Infosys': { price: 1480, sentiment: 'negative' }
    };

    Object.entries(stocks).forEach(([stockName, data]) => {
      const impact = calculateStockImpact(data.sentiment);
      const newPrice = data.price * (1 + (impact / 100));
      
      // Update the stock price in the UI
      const stockElement = document.querySelector(`[data-stock="${stockName}"]`);
      if (stockElement) {
        const priceElement = stockElement.querySelector('.stock-price');
        const changeElement = stockElement.querySelector('.stock-change');
        
        if (priceElement && changeElement) {
          const oldPrice = parseFloat(priceElement.textContent.replace('₹', '').replace(',', ''));
          const priceChange = newPrice - oldPrice;
          const changePercentage = (priceChange / oldPrice) * 100;
          
          priceElement.textContent = `₹${newPrice.toFixed(2)}`;
          changeElement.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${changePercentage.toFixed(2)}%)`;
          changeElement.className = `stock-change ${priceChange >= 0 ? 'positive' : 'negative'}`;
        }
      }
    });
  }

  // Initialize stock updates
  document.addEventListener('DOMContentLoaded', function() {
    // Update stock prices every 5 seconds
    setInterval(updateStockPrices, 5000);
    
    // Initial update
    updateStockPrices();
  });
}); 