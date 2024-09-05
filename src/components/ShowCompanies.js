import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import authService from "../services/auth.service";
import authHeader from "../services/auth-header";




const ShowCompanies = () => {

    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    const [loggedIn, setLoggedIn] = useState(authService.getCurrentUser());
    const [searchParams, setSearchParams] = useState({
        name:"",
        city:"",
        minScore:"",
        maxDistance:"",
        sortBy: "name",
        sortOrder: "asc"
    });


    const showCompany = (id) => {
        history.push(`/api/companies/${id}`);
    };

    const rateCompany = async (company) => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/ratings/canUserRate/${company.id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
  
        if (response.ok) {
          const data = await response.json(); 
          console.log("Data received:", data);
          if (data){
            history.push(`/rateCompany`, {company});
          }else{
            alert("You are not allowed to rate this company.")
          }
          
        } else {
          throw new Error("Failed to fetch data!");
        }
      } catch (error) {
        console.error("Error:", error.message);
        
      }
    };



    const handleInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const queryParams = new URLSearchParams({
          name: searchParams.name,
          location: searchParams.city,
          minScore: searchParams.minScore,
          maxDistance: searchParams.maxDistance,
          sortBy: searchParams.sortBy,
          sortDirection: searchParams.sortOrder, 
        }).toString();


        
        try {
            const response = await fetch(
              `http://localhost:8082/api/companies/searchByNameOrLocation?${queryParams}`,
              {
                method: "GET",
                headers: authHeader()
              }
            );
       
            if (response.ok) {
              const data = await response.json(); 
              console.log("Data received:", data);
              setCompanies(data);
            } else {
              throw new Error("Failed to fetch data!");
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        };


    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: "20px" }}>
            <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Search and Filter</h2>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                style={{ width: '50%' }}
              />
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
                style={{ width: '50%' }}
              />
            </div>
            <div>
              <label htmlFor="minScore">Min Score:</label>
              <input
                type="number"
                id="minScore"
                name="minScore"
                value={searchParams.minScore}
                onChange={handleInputChange}
                style={{ width: '50%' }}
              />
            </div>
            {loggedIn && (
              <div>
                <label htmlFor="maxDistance">Max Distance:</label>
                <input
                  type="number"
                  id="maxDistance"
                  name="maxDistance"
                  value={searchParams.maxDistance}
                  onChange={handleInputChange}
                  style={{ width: '50%' }}
                />
              </div>
            )}
     
            <div>
              <label htmlFor="sortBy">Sort By:</label>
              <select
                id="sortBy"
                name="sortBy"
                value={searchParams.sortBy}
                onChange={handleInputChange}
              >
                <option value="name">Name</option>
                <option value="location.city">City</option>
                <option value="averageScore">Average Score</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder">Sort Order:</label>
              <select
                id="sortOrder"
                name="sortOrder"
                value={searchParams.sortOrder}
                onChange={handleInputChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>Search</button>
          </div>
          <div style={{ flex: 2 }}>
            <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Results</h2>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Company name</th>
                  <th>City</th>
                  <th>Company description</th>
                  {loggedIn && (<th>Distance (km)</th>)}
                  <th>Average score</th>
                  <th>Details</th>
                  {loggedIn && (<th>Rating</th>)}
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company?.id}>
                    <td>{company?.name}</td>
                    <td>{company?.city}</td>
                    <td>{company?.description}</td>
                    {loggedIn && (<td>{(Math.round((company?.distance) * 100) / 100).toFixed(2)}</td>)}
                    <td>{company?.averageScore}</td>
                    <td>
                      <button
                        onClick={() => {
                          showCompany(company?.id);
                        }}
                        className="btn btn-primary"
                      >
                        Show
                      </button>
                    </td>
                    <td>
                      {loggedIn && (
                        <button className="btn btn-primary"
                          onClick={() => {
                            rateCompany(company);
                          }}
                        >
                          Rate
                        </button>
                      )}
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
};

export default ShowCompanies;