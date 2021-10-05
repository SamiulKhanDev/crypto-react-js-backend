const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    credentials: true,
  })
);
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");


dotenv.config();
const geData = async () => {
  try {
    const res = await axios.get(process.env.BASE_URL);
    return res;
    // console.log(res);
  } catch (error) {
    console.log(error.message);
  }
};
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

const getAParticulerCoin= async(coinId) => { 
  try {
      const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}&ids=${coinId}&interval=1d,30d&convert=INR&per-page=100&page=1`;
      const res = await axios.get(url);
      return res;
  } catch (error) {
    console.log(error.message);
  }
}

app.get("/", async (req, res) => {
    const coins = await geData();
    // console.log(coins);
    
    try {
        
      res.json(coins.data);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/:coinId", async (req, res) => { 
    const coinId = req.params.coinId.toUpperCase();
    const coin = await getAParticulerCoin(coinId);


    try {    
        res.json(coin.data)
    } catch (error) { 
        res.json({ "error": error.message });
    }
})

app.get("/favicon.ico", (req, res) => { 

})

app.listen(port, () => {
  console.log("server is up");
});
