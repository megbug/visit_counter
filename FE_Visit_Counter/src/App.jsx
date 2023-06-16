import { useEffect, useState } from 'react'
import './App.css'

import axios from 'axios';

function App() {

  const [counts, setCounts] = useState([]);

    ({ data }) => setCounts(data);
    (res) => {
        let data = res.data;
        return setCounts(data);

    }
    res => {
        let { data } = res;
        return setCounts(data)
    }


  useEffect(() => {
    axios.get('http://localhost:5172/visited')
        // axios.get('http://localhost:5172/visited')
        //     .then(({ data }) => setCounts(data))
    const id = setInterval(() => { }, 200)
    return () => {
      clearInterval(id);
    }
  }, [])

  return (
    <>
      <p>Schön, dass Sie hier sind</p>
      <h1>Counter</h1>
      {counts.map((item) => {
        return (
          <p>{item.name} : {item.count}</p>
        )
      })}
    </>
  )
}

export default App
