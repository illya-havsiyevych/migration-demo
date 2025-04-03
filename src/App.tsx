import { Route, Routes } from 'react-router-dom';
import ChatPage from '@/pages/ChatPage';
import Layout from '@/components/Layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><ChatPage /></Layout>} />
    </Routes>
  );
}

export default App;
