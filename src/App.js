import React from 'react';
import './app.less';
import './App.css';
import Header from "./core/header/header";
import Footer from "./core/footer/footer";
import Main from "./core/main/main";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

function App() {
  return (
    <div className="App">
        <div className="header-container container-fluid">
            <div className="row">
                <div className="col-12 header-col">
                    <Header />
                </div>
            </div>
        </div>
        <div className="container-fluid">
            <Main />
        </div>
      <Footer />
    </div>
  );
}

export default App;
