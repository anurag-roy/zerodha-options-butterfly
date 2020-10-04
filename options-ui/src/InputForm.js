import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import StockInputForm from "./StockInputForm";
import SelectedStock from "./SelectedStock";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import green from "@material-ui/core/colors/green";
import axios from "axios";

const InputForm = () => {
  const [state, setState] = useState("initial");

  // const [stockArray, setStockArray] = useState([]);

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();
  const [stockC, setStockC] = useState();

  const [entryPrice, setEntryPrice] = useState();

  // console.log("stockA: ", stockA);
  // console.log("stockB: ", stockB);

  // console.log("Stock Array: ", stockArray);

  // useEffect(() =>
  // {
  //   const newStockArray = [];
  //   if (stockA) newStockArray.push(stockA);
  //   if (stockB) newStockArray.push(stockB);
  //   if (stockC) newStockArray.push(stockC);
  //   setStockArray([...newStockArray]);
  // }, [stockA, stockB, stockC]);

  const proceedButton = () => {
    axios
      .post("http://localhost:5000/startButterfly", { stockA, stockB, stockC, entryPrice })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    setState("done");
  };

  if (state === "initial") {
    return (
      <div>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <StockInputForm label="A" tType="SELL" handleChange={setStockA} />
          </Grid>
          <Grid item>
            <StockInputForm label="B" tType="BUY" handleChange={setStockB} />
          </Grid>
          <Grid item>
            <StockInputForm label="C" tType="SELL" handleChange={setStockC} />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <h3>Entry Price:</h3>
          </Grid>
          <Grid item>
            <TextField
              id="entryPrice"
              label="Entry Price"
              variant="outlined"
              value={entryPrice}
              onChange={(event) => {
                setEntryPrice(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <SelectedStock input={"A"} data={stockA} />
          </Grid>
          <Grid item>
            <SelectedStock input={"B"} data={stockB} />
          </Grid>
          <Grid item>
            <SelectedStock input={"C"} data={stockC} />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              style={{ background: green[600], color: "white" }}
              onClick={proceedButton}
            >
              Proceed
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <div>Done!</div>;
  }
};

export default InputForm;
