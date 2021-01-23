import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from "./Components/Home/Home"
import StockDetailPage from "./Components/StockDetailPage/StockDetailsPage"
import ErrorComponent from "./Components/ErrorComponent/ErrorComponent"
import { ToastProvider } from "react-toast-notifications"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path='/' component={Home} exact />
          <ToastProvider>
            <Switch>
              <Route path='/stocks/:stockName' component={StockDetailPage} exact />
              <Route component={ErrorComponent} />
            </Switch>
          </ToastProvider>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
