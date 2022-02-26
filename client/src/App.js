import './App.css';
import { Account } from './components/cognito/account';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Account>
          <Router />
        </Account>
      </Elements>
    </BrowserRouter>
  );
}

export default App;
