import "./card.scss"
import React from 'react';
import { Link } from 'react-router-dom';

function Card({ listing }) {
  return (
    <div className="card">
        <Link to="" className="imageContainer">
            <img src="" alt="" />
        </Link>
        <div className="textcontainer">
            <h2 className="title">
                <Link to=""></Link>
            </h2>
            <p className="location">
                <img src="/pin.png" alt="" />
                <span>kiganjo,Kiambu</span>
            </p>
            <p className="price">Ksh. 200</p>
            <div className="bottom">

            </div>
        </div>

    </div>
  );
}
export default Card