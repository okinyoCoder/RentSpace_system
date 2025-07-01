import "./filter.scss"

function Filter() {
    return (
        <div className="filter">
            <h1>Search result for <b>**LOCATION NAME**</b></h1>
            <div className="top">
                <div className="item">
                    <label htmlFor="county">Location</label>
                    <input type="text" id="county" name="county" placeholder="County Location" />
                </div>
            </div>
            <div className="bottom">
                <div className="item">
                    <label htmlFor="property">Property</label>
                    <select name="property" id="property">
                        <option value="">Any</option>
                        <option value="single_room">Single Room</option>
                        <option value="double_room">Double Room</option>
                        <option value="bedSitter">Bedsitter</option>
                        <option value="oneBedroom">Onebed Room</option>
                        <option value="twoBedroom">Two Bedrooms</option>
                        <option value="bungalor">Bungalor</option>
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="minPrice">Min Price</label>
                    <input type="number" id="county" name="county" placeholder="any" />
                </div>
                <div className="item">
                    <label htmlFor="maxPrice">Max Price</label>
                    <input type="number" id="maxPrice" name="county" placeholder="any" />
                </div>
                <button>
                    <img src="/src/assets/search.png" alt="" />
                </button>
            </div>
        </div>
    );
}

export default Filter