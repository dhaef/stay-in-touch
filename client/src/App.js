import './App.css';
import { Account } from './components/cognito/account';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';

function App() {
  return (
    <BrowserRouter>
      <Account>
        <Router />
      </Account>
    </BrowserRouter>
  );
}

export default App;
