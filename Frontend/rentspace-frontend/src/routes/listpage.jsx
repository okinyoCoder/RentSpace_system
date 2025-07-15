import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Filter from '../components/Filter';
import './listpage.scss';
import { propertyApi } from '../api/api'; 

function Listpage() {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({
        county: '',
        property: '',
        minPrice: '',
        maxPrice: '',
    });

    const fetchListings = async () => {
        try {
            const response = await propertyApi.get('listings/', { params: { ...filters } });
            setListings(response.data);
        } catch (err) {
            console.error('Failed to fetch listings:', err);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [filters]);

    return (
        <div className="listpage">
            <div className="listContainer">
                <Filter filters={filters} setFilters={setFilters} />
                {listings.length === 0 ? (
                    <p>No listings found.</p>
                ) : (
                    listings.map((listing) => (
                        <Card key={listing.id} listing={listing} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Listpage;
