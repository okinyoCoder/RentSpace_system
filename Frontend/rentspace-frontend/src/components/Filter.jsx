import './filter.scss';

function Filter({ filters, setFilters }) {
    const handleChange = e => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="filter">
            <h1>Search results for <b>{filters.county || 'All locations'}</b></h1>

            <div className="top">
                <div className="item">
                    <label htmlFor="county">Location</label>
                    <input
                        type="text"
                        id="county"
                        name="county"
                        value={filters.county}
                        onChange={handleChange}
                        placeholder="County Location"
                    />
                </div>
            </div>

            <div className="bottom">
                <div className="item">
                    <label htmlFor="property">Property</label>
                    <select
                        name="property"
                        id="property"
                        value={filters.property}
                        onChange={handleChange}
                    >
                        <option value="">Any</option>
                        <option value="single_room">Single Room</option>
                        <option value="double_room">Double Room</option>
                        <option value="bedsitter">Bedsitter</option>
                        <option value="oneBedroom">One Bedroom</option>
                        <option value="twoBedroom">Two Bedrooms</option>
                        <option value="bungalow">Bungalow</option>
                    </select>
                </div>

                <div className="item">
                    <label htmlFor="minPrice">Min Price</label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="Any"
                    />
                </div>

                <div className="item">
                    <label htmlFor="maxPrice">Max Price</label>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="Any"
                    />
                </div>
            </div>
        </div>
    );
}

export default Filter;