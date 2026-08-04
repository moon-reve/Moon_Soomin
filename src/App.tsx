import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SelectionHeader from './components/layout/SelectionHeader';
import SiteHeader from './components/layout/SiteHeader';
import HomePage from './pages/HomePage';
import StrategistPage from './pages/StrategistPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <SelectionHeader />
              <HomePage />
            </>
          )}
        />
        <Route
          path="/strategist"
          element={(
            <>
              <SiteHeader />
              <StrategistPage />
            </>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}
