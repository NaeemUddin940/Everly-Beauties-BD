'use client'

import React from 'react'
import { FadeLoader } from 'react-spinners'

const Spinner = () => {
  return (
    <div className="flex z-[999] justify-center items-center">
      <FadeLoader color="#e91e63" height={10} width={4} margin={2} />
    </div>
  )
}

export default Spinner