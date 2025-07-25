import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/HomePage';
import JsonFormatterPage from './Pages/JSONFormatterPage';
import NotFound from './Pages/NotFound';
import XMLFormatterPage from './Pages/XMLFormatterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/json-formatter' element={<JsonFormatterPage />} />
        <Route path='/xml-formatter' element={<XMLFormatterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
