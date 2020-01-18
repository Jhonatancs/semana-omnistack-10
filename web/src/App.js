import React, { useState, useEffect } from 'react';
import api from './services/api';

/**
 * 3 conceitos do react
 * - componente : é um bloco isolado de HTML, CSS e JS que nao interfere na restante da aplicação
 * - propriedade: são informações que o componente pai passa para o compronente filho (parametros, basicamente)
 * - estado: são informações mantidas pelo componente
 */
import './globals.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {

  const [devs, setDevs] = useState([]);
  
  useEffect(() => {
    async function loadDevs(){
      const response = await api.get('/devs');
      setDevs(response.data);
    }

    loadDevs();
  },[]);

  async function handleAddDev(data){
    
    const response = await api.post('/devs',data);
    setDevs([...devs,response.data]);
  }

  return (
    <div id="app">

      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>

      </main>
    </div>
  );
}

export default App;
