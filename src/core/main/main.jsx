import React from 'react';
import {BrowserRouter as Router, Switch, Route,} from "react-router-dom";
import Home from '../../pages/home/home';
import Inventory from '../../pages/inventory/inventory';

class Main extends React.Component {
    render() {
        return(
            <div className="main-container">
            <Router>
                <Switch>
                    <Route exact path="/Home">
                        <Home />
                    </Route>
                    <Route exact path="/Inventory">
                        <Inventory  />
                    </Route>
                </Switch>
            </Router>
            </div>
        );
    };
}

export default Main;
