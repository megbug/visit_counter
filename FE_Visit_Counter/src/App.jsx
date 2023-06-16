import { useEffect, useState } from 'react'
import './App.css'

import axios from 'axios';

function App() {

    const [counts, setCounts] = useState([]);

    useEffect(() => {
        const id = setInterval(() => {                      // with setInterval the counts get delayed for 200ms 
            axios.get('http://localhost:5172/visited')      // axios gets data from api 
                .then((res) => { setCounts(res.data) });    // data is what's get send from the server.js in res.send
        }, 200)
        return () => {
            clearInterval(id);
        }
    }, [counts])

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

// setInterval verzögert den request um 200 ms, damit nur alle 200 ms refreshed wird in Verbindung mit dependency array 