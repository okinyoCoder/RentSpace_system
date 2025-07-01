import { useState } from "react";
import "./chat.scss"

function Chat() {
    const [chat,setChat] = useState(null)
    return (
        <div className="chat">
            <div className="messages">
                <h1>Messages</h1>
                <div className="message">
                    <img src="" alt="" />
                    <span>John Doe</span>
                    <p>Lorem ipsum dolor...
                    </p>
                </div>
                <div className="message">
                    <img src="" alt="" />
                    <span>John Doe</span>
                    <p>Lorem ipsum dolor...
                    </p>
                </div>
                <div className="message">
                    <img src="" alt="" />
                    <span>John Doe</span>
                    <p>Lorem ipsum dolor...
                    </p>
                </div>
            </div>
            {chat && (<div className="chatBox">
                <div className="top">
                    <div className="user">
                        <img src="user.img" alt="" />
                        john Doe
                    </div>
                    <div className="close" onClick={()=>setChat(null)}>X</div>
                </div>
                <div className="center">
                    <div className="chatMessage">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <span>1 Hour ago</span>
                    </div>
                    <div className="chatMessage">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <span>1 Hour ago</span>
                    </div>
                    <div className="chatMessage own">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <span>1 Hour ago</span>
                    </div>
                    <div className="chatMessage">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <span>1 Hour ago</span>
                    </div>
                    <div className="chatMessage own">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        </p>
                        <span>1 Hour ago</span>
                    </div>
                </div>
                <div className="bottom">
                    <textarea name="" id=""></textarea>
                    <button>Send</button>
                </div>
            </div>)}
        </div>
    );
}

export default Chat