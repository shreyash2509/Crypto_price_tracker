document.addEventListener('DOMContentLoaded', () => {
  fetch('/tickers')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#ticker-table tbody');
      tableBody.innerHTML = '';

      data.forEach(ticker => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = ticker.rank;
        row.appendChild(rankCell);

        const platformCell = document.createElement('td');
        platformCell.textContent = ticker.platform;
        row.appendChild(platformCell);

        const lastTradedPriceCell = document.createElement('td');
        lastTradedPriceCell.textContent = ticker.lastTradedPrice;
        row.appendChild(lastTradedPriceCell);

        const buySellPriceCell = document.createElement('td');
        buySellPriceCell.textContent = ticker.buySellPrice;
        row.appendChild(buySellPriceCell);

        const differenceCell = document.createElement('td');
        differenceCell.textContent = ticker.difference;
        row.appendChild(differenceCell);

        const savingsCell = document.createElement('td');
        savingsCell.textContent = ticker.savings;
        row.appendChild(savingsCell);

        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Error fetching tickers data:', err);
    });
});
