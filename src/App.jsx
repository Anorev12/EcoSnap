import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import History from './History';
import TipsandFacts from './TipsandFacts';
import Settings from './Settings';
import Profile from './Profile';
import Scanner from './Scanner';

export default function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/tipsandfacts" element={<TipsandFacts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scanner" element={<Scanner />} />

      </Routes>
    </BrowserRouter>
    </>
  );
}