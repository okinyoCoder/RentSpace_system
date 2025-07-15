import './filter.scss';

function Filter({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'minPrice' || name === 'maxPrice' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      county: '',
      property: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{filters.county || 'All Locations'}</b>
      </h1>

      <div className="top">
        <div className="item">
          <label htmlFor="county">Location</label>
          <input
            type="text"
            id="county"
            name="county"
            value={filters.county}
            onChange={handleChange}
            placeholder="e.g. Nairobi"
          />
        </div>
      </div>

      <div className="bottom">
        <div className="item">
          <label htmlFor="property">Property Type</label>
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
            <option value="one_bedroom">One Bedroom</option>
            <option value="two_bedroom">Two Bedroom</option>
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
            placeholder="e.g. 5000"
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
            placeholder="e.g. 20000"
          />
        </div>
      </div>

      <div className="actions item">
        <button className="clear-btn" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Filter;
