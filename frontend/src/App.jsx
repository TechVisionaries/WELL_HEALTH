import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { MainContextProvider } from './context/main/main-context-provider';

const App = () => {

  return (
    <>
    <MainContextProvider>
      <ToastContainer />
      <Container className='mw-100 py-0 px-0' id="main" style={{position:'fixed', minHeight:'100vh', height:'100%', overflow:'auto', display:'flex', background:'#f8f7fa'}}>
        <Outlet />
      </Container>
    </MainContextProvider>
    </>
  );
};

export default App;