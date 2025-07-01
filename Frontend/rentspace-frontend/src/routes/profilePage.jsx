import Chat from "../components/Chat";
import "./profile.scss"

function ProfilePage() {
    return (
        <div className="profilePage">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1>User Informatio</h1>
                        <button>Update Profie</button>
                    </div>
                    <div className="title">
                        <h1>Add Property</h1>
                        <button>Create property</button>
                    </div>
                    <div className="title">
                        <h1>User Informatio</h1>
                        <button>Update Profie</button>
                    </div>
                </div>
            </div>
            <div className="chatContainer">
                <div className="wrapper">
                    <Chat />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage