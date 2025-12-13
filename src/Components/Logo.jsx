import React from 'react';
import logo from '../assets/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div className='sm:ml-20 md:ml-5 -ml-3'>
            <Link to='/'>
            <img src={logo} alt="" className="inline w-[120px]" />
          </Link>
        </div>
    );
};

export default Logo;