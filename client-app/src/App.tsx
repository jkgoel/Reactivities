import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function  App() {
  const [values, setValues] = useState([]);

  const fetchData = async () => {
      const response = await axios.get("https://localhost:5001/api/values");
      setValues(response.data);
    }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="App">
     <Header as='h2' icon='users' content='Reactivities' />

        <List bulleted>
          {
            values.map((v:any) => <List.Item key={v.id}>{ v.name}</List.Item>)
          }
        </List>
    </div>
  );
}

export default App;
