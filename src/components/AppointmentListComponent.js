import { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const AppointmentList = () => {
    const history = useHistory();
    const [appointments, setAppointments] = useState([]);
  
    const cancelAppointment = (id) => {
      history.push(`...${id}`);
      //ovde treba da se doda putanja za stranicu sa otkazivanjem
      //ili dodati direktno funcionalnost otkazivanja kako god je lakse
    };
  
    useEffect(() => {
      let ignore = false;
      const fetchProfile = async () => {
        try {
          let response = await fetch(
            `http://localhost:8082/api/reservations/ready`,
            {
              headers: authHeader(),
            }
          );
          if (response.ok) {
            let userData = await response.json();
            console.log(userData);
            if (!ignore) {
              setAppointments(userData);
            }
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error:", error);
          setAppointments([]); // Handle error by setting currentUser to null
        }
      };
      fetchProfile();
      return () => {
        ignore = true;
      };
    }, []);
  
    return (
      <div>
        <h4>
          Scheduled appointments for equipment that has not yet been collected
        </h4>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Total Sum</th>
              <th>Starting Date</th>
              <th>Duration (min)</th>
              <th>Equipment (quantity)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment?.id}>
                <td>{appointment?.id}</td>
                <td>{appointment?.totalSum}</td>
                <td>{appointment?.startingDate}</td>
                <td>{appointment?.durationMinutes}</td>
                <td>{appointment?.items.map((item) => <p>{item?.equipmentName} ({item?.quantity})</p>)}</td>
                <td>
                  <button
                    onClick={() => {
                      cancelAppointment(appointment?.id);
                    }}
                    class="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AppointmentList;