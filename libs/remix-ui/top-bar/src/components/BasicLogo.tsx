import React from 'react'

interface BasicLogoProps {
  classList?: string
  solid?: boolean
}

function BasicLogo({ classList = '', solid = true }: BasicLogoProps) {
  const size = solid ? '100%' : '3rem'
  return <img className={classList} src="assets/img/creditchain-logo.svg" style={{ width: size, height: size, objectFit: 'contain' }} alt="CreditChain" data-id="verticalIconsHomeIcon"></img>
}

export default BasicLogo
