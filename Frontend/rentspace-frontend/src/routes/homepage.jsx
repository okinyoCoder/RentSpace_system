import './homepage.jsx'
import Works from '../components/Works.jsx'

function Homepage() {
    return(
        <div className="homepage">
            <div className="textcontent">
                <h2>Find <span> Perfect </span>
                    Place To Live Life
                </h2>
                <div className="subcontent">
                    <div className="subcontent">
                        <img src="" alt="" />
                        <div className="subdetails">
                            <h3>I'm looking for rental house</h3>
                            <p>Provide a rental house listing where tenants select
                                desired property to move into
                            </p>
                        </div>
                        <button>Get House</button>
                    </div>
                    <div className="subcontent">
                        <img src="" alt="" />
                        <div className="subdetails">
                            <h3>I want to rent my house</h3>
                            <p>Here's how to rent your house from setting rent to
                                screening tenants. How to rent your House
                            </p>
                        </div>
                        <button>Rent House</button>                       
                    </div>
                </div>
                <Works />
            </div>
            <div className="imgcontent">
                <img src="/src/assets/p.2.jpg" alt="" />
            </div>
        </div>

    )
}

export default Homepage