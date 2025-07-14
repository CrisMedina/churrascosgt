import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom';

import './App.css'

export default function App() {
  return (
    <div>
      <h1>ChurrascosGT</h1>
      <nav>
        <ul>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/guarniciones">Guarniciones</Link></li>
          <li><Link to="/combos">Combos</Link></li>
          <li><Link to="/dulces">Dulces</Link></li>
        </ul>
      </nav>
    </div>
  );
}
