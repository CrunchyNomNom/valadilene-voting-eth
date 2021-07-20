import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import "./index.css";
import App from "./App";
import Deploy from "./deploy";
import Vote from "./vote";
import NavBar from "./NavBar";
import { StoreProvider } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
        <BrowserRouter>
        <NavBar />
        <Switch>
            <Route exact strict path='/deploy' component={Deploy} />
            <Route exact strict path='/:id' component={Vote} />
            <Route exact strict path='/' component={App} />
        </Switch>
        </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
