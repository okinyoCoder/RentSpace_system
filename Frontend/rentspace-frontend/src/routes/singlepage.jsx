import Slider from "../components/Slider";
import "./singlepage.scss"

function SinglePage() {
    return (
        <div className="singlePage">
            <div className="detail">
                <div className="wrapper">
                    <Slider images=""/>
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>Apple Apartments</h1>
                                <div className="address">
                                    <img src="/pin.png" alt="" />
                                    <span>kiganjo,thika, kiambu</span>
                                </div>
                                <div className="price">
                                    ksh 200
                                </div>
                            </div>
                            <div className="user">
                                <img src="" alt="" />
                                <span>user.name</span>
                            </div>
                        </div>
                        <div className="bottom">
                            Lorem ipsum dolor sit amet, consectetur 
                            adipisicing elit. Aperiam eligendi amet nihil? 
                            Maiores porro perspiciatis esse, optio at 
                            reprehenderit recusandae vitae ratione doloremque 
                            nemo obcaecati, praesentium qui. Qui enim fugit
                            voluptas. Maxime repellat porro nulla modi?
                             Soluta cumque enim maxime animi velit iure dicta 
                             voluptatibus beatae voluptatum suscipit ratione, 
                             accusantium autem repellendus, nostrum eaque magni 
                             optio! Est perspiciatis ullam sequi perferendis 
                             cum eum, ad necessitatibus officia obcaecati modi 
                             dicta suscipit, voluptates nulla temporibus 
                             aperiam? Inventore assumenda aliquid vero ipsa? Ipsam earum, 
                             neque fugit, rem excepturi repellendus libero consequuntur, 
                             voluptates non deserunt veritatis! Voluptas modi architecto 
                             impedit itaque temporibus similique officia?
                        </div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <p className="title">General</p>
                    <div className="listVerticle">
                        <div className="feature">
                            <img src="" alt="" />
                            <div className="featureText">
                                <span>Property Rent</span>
                                <p>Payable by 10th</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="" alt="" />
                            <div className="featureText">
                                <span>Garbage</span>
                                <p>Renter is responsible</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="" alt="" />
                            <div className="featureText">
                                <span>Water</span>
                                <p>Renter is responsible</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="" alt="" />
                            <div className="featureText">
                                <span>Electricty</span>
                                <p>Renter is responsible</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Siezes</p>
                    <div className="listHorizontal">
                        <div className="sizes">
                            <div className="size">
                                <img src="size.png" alt="" />
                                <span>30ft</span>
                            </div>
                            <div className="size">
                                <img src="bath.png" alt="" />
                                <span>1 bathroom</span>
                            </div>
                            <div className="size">
                                <img src="bed.png" alt="" />
                                <span>3 bed</span>
                            </div>
                    </div>
                    </div>
                    <p className="title">Nearby Places</p>
                    <div className="listHorizontal"></div>
                    <p className="title">Location</p>
                    <div className="button">
                        <button><img src="" alt="" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePage