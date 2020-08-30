/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

const StockInputForm = ({ label, handleChange }) => {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("NIFTY");
  const [data, setData] = useState([]);
  const [strikePrice, setStrikePrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [iType, setIType] = useState("CE");
  const [tType, setTType] = useState("SELL");
  const [quantity, setQuantity] = useState(75);

  useEffect(() => {
    axios.get("http://localhost:5000/mapper/names").then((result) => {
      setNames(result.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/mapper/byName", { params: { name: name } }).then((result) => {
      setData(result.data);
      setExpiry("");
      setIType("CE");
      setStrikePrice("");
      setTType("SELL");
      setQuantity(75);
    });
  }, [name]);

  useEffect(() => {
    const x = data.find((d) => d.tradingsymbol === `${name}${expiry}${strikePrice}${iType}`);
    if (x && quantity && quantity !== 0) {
      handleChange({
        ...x,
        transactionType: tType,
        product: "NRML",
        quantity: parseInt(quantity),
      });
    }
  }, [data, name, expiry, strikePrice, iType, tType, quantity, handleChange]);

  const mapToStrikePrice = (stockArray) => {
    if (stockArray === []) return [];

    let spSet = new Set();
    stockArray.forEach((s) => {
      spSet.add(s.strike.toString());
    });
    return [...spSet];
  };

  const mapToExpiry = (stockArray, name, strikePrice) => {
    if (stockArray === []) return [];

    let expirySet = new Set();
    stockArray
      .filter((s) => s.strike == strikePrice)
      .forEach((s) => {
        const ts = s.tradingsymbol;
        const tsTrimmed = ts.substr(0, ts.lastIndexOf(strikePrice));
        const expiry = tsTrimmed.slice(name.length);
        if (expiry) expirySet.add(expiry);
      });
    return [...expirySet];
  };

  return (
    <Grid container direction="row" justify="flex-start" spacing={3}>
      <Grid item>
        <h3>Stock {label}:</h3>
      </Grid>
      <Grid item>
        <Autocomplete
          id={`${label}-name-input`}
          value={name}
          onChange={(event, newValue) => {
            //console.log("Value for Name:", newValue);
            setName(newValue);
          }}
          options={names}
          style={{ width: 250 }}
          renderInput={(params) => <TextField {...params} variant="outlined" label="Name" />}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id={`${label}-sp-input`}
          value={strikePrice}
          onChange={(event, newValue) => {
            //console.log(newValue);
            setStrikePrice(newValue);
          }}
          options={mapToStrikePrice(data)}
          style={{ width: 150 }}
          renderInput={(params) => <TextField {...params} variant="outlined" label="Price" />}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id={`${label}-expiry-input`}
          value={expiry}
          onChange={(event, newValue) => {
            //console.log(newValue);
            setExpiry(newValue);
          }}
          options={mapToExpiry(data, name, strikePrice)}
          style={{ width: 200 }}
          renderInput={(params) => <TextField {...params} variant="outlined" label="Expiry" />}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id={`${label}-instrument-type-input`}
          value={iType}
          onChange={(event, newValue) => {
            //console.log(newValue);
            setIType(newValue);
          }}
          options={["CE", "PE"]}
          renderInput={(params) => <TextField {...params} variant="outlined" label="I-Type" />}
        />
      </Grid>
      <Grid item>
        <TextField
          id={`quantity-${label}`}
          label="Quantity"
          variant="outlined"
          value={quantity}
          onChange={(event) => {
            //console.log(event.target.value);
            setQuantity(event.target.value);
          }}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id={`${label}-transaction-type-input`}
          value={tType}
          onChange={(event, newValue) => {
            //console.log(newValue);
            setTType(newValue);
          }}
          options={["BUY", "SELL"]}
          style={{ width: 150 }}
          renderInput={(params) => <TextField {...params} variant="outlined" label="T-Type" />}
        />
      </Grid>
    </Grid>
  );
};

export default StockInputForm;
