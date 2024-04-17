import Table from "./table"
import SearchBar from "./searchBar"
import { useState } from "react"
import { debounce } from "../../utils"
function TableIndex({t}) {
  const [address, setAddress] = useState('')
  const handleChange = debounce((val) => {
    setAddress(val)
  }, 200)
  return (
    <div className="text-text bg-bg w-full h-full pt-20">
      <SearchBar onChange={(val) => {handleChange(val)}} t={t}></SearchBar>
      <Table address={address} t={t}></Table>
    </div>
  )
}

export default TableIndex