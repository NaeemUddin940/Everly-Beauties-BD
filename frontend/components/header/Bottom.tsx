import React from 'react'
import SearchInput from './SearchInput'

import Navigation from './Navigation'
import Container from '../common/Container'

function Bottom() {
  return (
    <div className='sm-shadow bg-white'>
    <Container className='px-0'>
      <div className='md:hidden py-2'>
        <SearchInput/>
      </div>
      <div className='hidden md:block'>
        <Navigation/>
      </div>
    </Container>
    </div>
  )
}

export default Bottom