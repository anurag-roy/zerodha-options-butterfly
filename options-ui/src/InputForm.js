import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import StockInputForm from "./StockInputForm";
import SelectedStock from "./SelectedStock";
import DataStreamer from "./DataStreamer";
import { Button } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import axios from "axios";

const InputForm = () => {
  const [state, setState] = useState("initial");

  const [stockArray, setStockArray] = useState([]);

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();
  const [stockC, setStockC] = useState();
  const [stockD, setStockD] = useState();
  const [stockE, setStockE] = useState();
  const [stockF, setStockF] = useState();
  const [stockG, setStockG] = useState();
  const [stockH, setStockH] = useState();

  // console.log("stockA: ", stockA);
  // console.log("stockB: ", stockB);

  console.log("Stock Array: ", stockArray);

  useEffect(() => {
    const newStockArray = [];
    if (stockA) newStockArray.push(stockA);
    if (stockB) newStockArray.push(stockB);
    if (stockC) newStockArray.push(stockC);
    if (stockD) newStockArray.push(stockD);
    if (stockE) newStockArray.push(stockE);
    if (stockF) newStockArray.push(stockF);
    if (stockG) newStockArray.push(stockG);
    if (stockH) newStockArray.push(stockH);
    setStockArray([...newStockArray]);
  }, [stockA, stockB, stockC, stockD, stockE, stockF, stockG, stockH]);

  const proceedButton = () => {
    axios
      .post("http://localhost:5000/placeOrder", stockArray)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    setState("done");
  };

  if (state === "initial") {
    return (
      <div>
        <Grid container direction="row" spacing={5}>
          <Grid item>
            <DataStreamer />
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" spacing={5}>
          <Grid item>
            <StockInputForm label="A" handleChange={setStockA} />
          </Grid>
          <Grid item>
            <StockInputForm label="B" handleChange={setStockB} />
          </Grid>
          <Grid item>
            <StockInputForm label="C" handleChange={setStockC} />
          </Grid>
          <Grid item>
            <StockInputForm label="D" handleChange={setStockD} />
          </Grid>
          <Grid item>
            <StockInputForm label="E" handleChange={setStockE} />
          </Grid>
          <Grid item>
            <StockInputForm label="F" handleChange={setStockF} />
          </Grid>
          <Grid item>
            <StockInputForm label="G" handleChange={setStockG} />
          </Grid>
          <Grid item>
            <StockInputForm label="H" handleChange={setStockH} />
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
          <Grid item>
            <SelectedStock input={"D"} data={stockD} />
          </Grid>
          <Grid item>
            <SelectedStock input={"E"} data={stockE} />
          </Grid>
          <Grid item>
            <SelectedStock input={"F"} data={stockF} />
          </Grid>
          <Grid item>
            <SelectedStock input={"G"} data={stockG} />
          </Grid>
          <Grid item>
            <SelectedStock input={"H"} data={stockH} />
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
