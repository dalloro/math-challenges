import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TestPage } from './pages/TestPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { AdminGuard } from './components/AdminGuard';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route 
          path="/admin" 
          element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          } 
        />
      </Routes>
    </Router>
  );
}
