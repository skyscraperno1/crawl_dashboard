import Table from "./table"
import SearchBar from "./searchBar"
import { useState } from "react"
function TableIndex({t}) {
  const [address, setAddress] = useState('')
  const handleChange = (val) => {
    setAddress(val)
  }
  return (
    <div className="text-text bg-bg w-full h-full pt-20">
      <SearchBar onChange={(val) => {handleChange(val)}} t={t}></SearchBar>
      <Table address={address} t={t}></Table>
    </div>
  )
}

export default TableIndex