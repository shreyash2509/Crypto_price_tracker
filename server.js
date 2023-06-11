const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tickers', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const tickerSchema = new mongoose.Schema({
  platform: String,
  lastTradedPrice: Number,
  buySellPrice: String,
  difference: String,
  savings: String
});

const Ticker = mongoose.model('Ticker', tickerSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
function fetchAndSaveTickers() {
  axios.get('https://api.wazirx.com/api/v2/tickers')
    .then(response => {
      const tickersData = response.data;
      const tickers = Object.keys(tickersData).map(key => {
        const tickerData = tickersData[key];
        return {
          platform: key,
          lastTradedPrice: tickerData.last,
          buySellPrice: `${tickerData.buy} / ${tickerData.sell}`,
          difference: tickerData.volume,
          savings: tickerData.base_unit
        };
      });

      Ticker.deleteMany({})
        .then(() => {
          Ticker.insertMany(tickers)
            .then(() => {
              // console.log('Tickers data updated to MongoDB');
            })
            .catch(err => {
              console.error('Error saving tickers data:', err);
            });
        })
        .catch(err => {
          console.error('Error deleting previous tickers data:', err);
        });
    })
    .catch(err => {
      console.error('Error fetching tickers data:', err);
    });
}

fetchAndSaveTickers();

setInterval(fetchAndSaveTickers, 1000);

app.get('/fetch-tickers', (req, res) => {
  axios.get('https://api.wazirx.com/api/v2/tickers')
    .then(response => {
      const tickersData = response.data;

      const tickers = Object.keys(tickersData).map(key => {
        const tickerData = tickersData[key];
        return {
          platform: key,
          lastTradedPrice: tickerData.last,
          buySellPrice: `${tickerData.buy} / ${tickerData.sell}`,
          difference: tickerData.volume,
          savings: tickerData.base_unit
        };
      });

      Ticker.deleteMany({})
        .then(() => {
          Ticker.insertMany(tickers)
            .then(savedTickers => {
              console.log('Tickers data saved to MongoDB');
              res.send('Tickers data saved to MongoDB');
            })
            .catch(err => {
              console.error('Error saving tickers data:', err);
              res.status(500).send('Internal Server Error');
            });
        })
        .catch(err => {
          console.error('Error deleting previous tickers data:', err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch(err => {
      console.error('Error fetching tickers data:', err);
      res.status(500).send('Internal Server Error');
    });
});
app.get('/', (req, res) => {
  Ticker.find({})
    .then(tickers => {
      console.log('Retrieved tickers');
      res.render('index', { tickers });
    })
    .catch(err => {
      console.error('Error retrieving tickers:', err);
      res.render('index', { tickers: [] });
    });
});
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
