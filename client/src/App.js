import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, Switch } from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <nav>
                        <Link to='/'>Home</Link>
                        <Link to='/demo'>Demo</Link>
                    </nav>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className='content'>
                    <Switch>
                        <Route path='/' exact render={() => 'home'} />
                        <Route path='/demo' render={() => 'demo'} />
                    </Switch>
                </div>
                <footer>
                    &copy; 2018 - GeekHub JS
                </footer>
            </div>
        );
    }
}

export default App;
