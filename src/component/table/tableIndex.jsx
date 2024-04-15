import Table from "./table"
import SearchBar from "./searchBar"
function tableIndex() {
  return (
    <div className="text-text bg-bg w-full h-full pt-20">
      <SearchBar></SearchBar>
      <Table></Table>
    </div>
  )
}

export default tableIndex