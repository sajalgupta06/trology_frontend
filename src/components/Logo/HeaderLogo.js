import React from 'react'
// import logoSrc from '../../assets/images/isuite logo_V1_white.png'

import './styles.scss'
import { Link } from 'react-router-dom'

const HeaderLogo = () => {
  return (
    <div className='header-logo'>
      <Link to='/'>
        {/* <img src={logoSrc} alt='logo' /> */}
      </Link>
    </div>
  )
}

export default HeaderLogo
