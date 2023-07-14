import Link from 'next/link'
import React from 'react'

type Props = {}

export default function HomeNav({}: Props) {
  return (<div className='text-white'><Link className="hover:bg-cp-color-2 bg-cp-color-1 text-black rounded-md p-2" href='/pen'>Start Coding</Link></div>
  )
}