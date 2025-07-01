import '../components/works.scss'

function Works() {
    return(
        <div className="workboxes">
            <div className="top act">
                <h2>
                    How it works?
                </h2>
                <p>
                    How does Rentspace Finder works?
                    This works by connecting tenants to their desired real estate.
                    As a results, landlords are able to get tenants and tenants are 
                    able to choose from a pool of real estate
                </p>
            </div>
            <div className="bottom dist">
                <div className="colum">
                    <img src="/src/assets/searchPro.png" alt="" />
                    <h4>Search Property</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                        Illo nulla doloribus quidem itaque earum non incidunt eos, iure ipsam?
                        Saepe, nisi. Cum amet veritatis maxime.</p>
                    <a href="">Know More</a>
                </div>
                <div className="colum columblue">
                    <img src="/src/assets/tenant.png" alt="" />
                    <h4>Choose Property</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Esse ducimus pariatur alias accusamus minima, maiores repellendus vero provident.
                        Nisi suscipit illum vitae exercitationem unde cupiditate!</p>
                    <a href="">Know More</a>
                </div>
                <div className="colum">
                    <img src="/src/assets/landlord.png" alt="" />
                    <h4>Rent Property</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                       Odio repellat fugit nulla sint possimus quibusdam et voluptates doloribus? 
                       Quasi quaerat ipsum, ea consectetur expedita eveniet?</p>
                    <a href="">Know More</a>
                </div>
            </div>
        </div>
    );
}

export default Works