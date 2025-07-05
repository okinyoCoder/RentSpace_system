import "./sidebar.scss"
import {Link} from 'react-router-dom';
import { 
    FaHouse, 
    FaHouzz, 
    FaPeopleRoof,
    FaCircleUser ,
 } from "react-icons/fa6";

function SideBar() {
    return (
        <div className="sidebar active">
            <div className="logoContainer active">
                <img src="" alt="" />
                <h2 className="title">RentSpace Finder</h2>
            </div>
            <div className="burgerContainer">
                <div className="burgerTrogger"></div>
                <div className="burgerMenu"></div>
            </div>
            <div className="profileContainer">
                <img src="" alt="" />
                <div className="profileContent">
                    <p className="name">Hello, John Doe</p>
                    <p>johndoe@gmail.com</p>
                </div>
            </div>
            <div className="navContainer">
                <ul>
                    <li>
                        <FaHouse className='icon'/>
                        <Link to="/dashboard" className="active">Dashboard</Link>
                    </li>
                    <li>
                        <FaHouzz className='icon'/>
                        <Link to="/dashboard/property">Property</Link>
                    </li>
                    <li>
                        <FaPeopleRoof className='icon'/>
                        <Link to="/dashboard/tenant">Tenant</Link>
                    </li>
                    <li>
                        <FaCircleUser className='icon'/>
                        <Link to="/dashboard/profile">Profile</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SideBar;