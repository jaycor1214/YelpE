
import './App.css';
import AppRoutes from "./Components/AppRoutes"
import GlobalState from "../src/Resources/GlobalState"



function App() {
  
  return (
    <GlobalState>
      <div className="App">
        <AppRoutes/>
      </div>
    </GlobalState>
 
    
  
  );
}

export default App;
