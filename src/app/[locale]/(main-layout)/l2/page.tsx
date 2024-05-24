'use client'
import dynamic from 'next/dynamic'
import TableA from "./_components/table"


function dashborad() {
    return (
       
            <TableA />
        
    )
}
export default dynamic(() => Promise.resolve(dashborad), {
    ssr: false
  })