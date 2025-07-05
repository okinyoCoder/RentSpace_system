import MainContent from "../components/MainContent";
import SideBar from "../components/SiderBar";
import "./landlordpage.scss"
import { Outlet} from 'react-router-dom';

function LandlordPage() {
    return (
        <div className="landlord">
            <SideBar />
            <Outlet />
        </div>
    );
}

export default LandlordPage