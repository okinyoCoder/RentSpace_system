import Card from '../components/Card'
import Filter from '../components/Filter'
import './listpage.scss'

function Listpage() {
    return (
        <div className="listpage">
            <div className="listContainer">
                <Filter />
                <Card />
            </div>
        </div>
    )
}

export default Listpage