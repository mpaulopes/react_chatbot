import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => (
    <nav>
      <div className="nav-wrapper container">
        <Link to={"/"} className="brand-logo">Guru Health</Link>
        <ul id="nav-mobiel" className="right hide-on-med-and-down">
          <li><Link to={'/shop'}>Shop</Link></li>
          <li><Link to={'/about'}>About us</Link></li>
        </ul>
      </div>
    </nav>
  )

export default Header;