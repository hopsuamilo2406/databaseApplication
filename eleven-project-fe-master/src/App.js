import {BrowserRouter} from "react-router-dom";
import "./App.css";
import AppFooter from "./Components/Footer";
import AppHeader from "./Components/Header";
import PageContent from "./Components/PageContent";
import {AppProvider} from "./context/AppContext";

function App() {

    return (
        <div className="App">
            <AppProvider>
                <BrowserRouter>
                    <AppHeader/>
                    <PageContent/>
                    <AppFooter/>
                </BrowserRouter>
            </AppProvider>
        </div>
    );
}

export default App;
