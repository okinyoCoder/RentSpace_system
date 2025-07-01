import '../routes/homepage.scss'
import Works from '../components/Works.jsx'

function Homepage() {
    return (
        <div className="homepage">
            <div className="textContent">
                <div className="wrapper">
                    <h1 className='title'>Find <span> Perfect </span>
                      Place To Live Life
                    </h1> 
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Obcaecati dolorem tenetur, sunt eligendi nostrum accusamus a
                         quidem dicta inventore non? A accusantium autem temporibus 
                         explicabo, recusandae fugit exercitationem dolor inventore.
                    </p>                  
                </div>
                <div className="boxes">
                    <div className="box">
                        <img src="/src/assets/house.png" alt="" />
                        <div className="detail">
                            <h4>I'm looking for rental house</h4>
                            <p>Provide a rental house listing where tenants select
                                desired property to move into
                            </p>
                        </div>
                        <a href="">Get House</a>
                    </div>
                    <div className="box">
                        <img src="/src/assets/key.png" alt="" />
                        <div className="detail">
                            <h4>I want to rent my house</h4>
                            <p>Here's how to rent your house from setting rent to
                                screening tenants. How to rent your House
                            </p>
                        </div>
                        <a href="" className='land'>Rent House</a>                      
                    </div>
                </div>
                <Works />
            </div>
            <div className="imgContent">
                <img src="/src/assets/RentSpaceimg.png" alt="" />
            </div>
        </div>
    );
}

export default Homepage