import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from "./Components/Home/Home"
import StockDetailPage from "./Components/StockDetailPage/StockDetailsPage"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/stocks/:stockName' component={StockDetailPage} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
