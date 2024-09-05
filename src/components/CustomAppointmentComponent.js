import { useState } from "react";
import authHeader from "../services/auth-header";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import TimeComponent from "./TimeComponent";
import { format, parse } from "date-fns";

const CustomAppointmentComponent = () => {
  const history = useHistory();
  const [date, setDate] = useState();
  const { id } = useParams();
  const [raw, setRaw] = useState([]);
  const [appointments, setAppointments] = useState([]);

  function formatDateSlots(dataArray) {
    return dataArray.map((item) => {
      try {
        // Parse the date string into a Date object
        const parsedDate = parse(
          item.dateSlot,
          "EEE MMM dd HH:mm:ss 'CET' yyyy",
          new Date()
        );
        // Format the date as "January 8, 2025 at 9:20:00 AM"
        const formattedDate = format(
          parsedDate,
          "MMMM d, yyyy 'at' h:mm:ss aaa"
        );
        // Return a new object with the formatted date
        return { ...item, dateSlot: formattedDate };
      } catch (error) {
        console.error("Error formatting date:", error);
        // Return the item unchanged in case of an error
        return item;
      }
    });
  }

  const handleSubmit = async () => {
    const queryParams = new URLSearchParams({
      dateString: date,
      companyId: id,
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:8082/api/reservations/showAvailableAppointmentsOnDate?${queryParams}`,
        {
          method: "GET",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Data received:", data);
        setRaw(data);
        const formatedData = formatDateSlots(data);
        setAppointments(formatedData);
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  function mapEquipment(data) {
    // Using Object.entries to convert object to an array of [key, value] pairs
    return Object.entries(data).map(([equipmentId, quantity]) => ({
      equipmentId: parseInt(equipmentId, 10), // Ensure equipmentId is an integer
      quantity: parseInt(quantity, 10), // Ensure quantity is an integer
    }));
  }

  const createReservation = async (index) => {
    const reservedItems = JSON.parse(localStorage.getItem(`company_${id}`));
    console.log(reservedItems.selectedEquipment);
    const formatedEquipment = mapEquipment(reservedItems.selectedEquipment);
    console.log(formatedEquipment);
    const response = await fetch(
      "http://localhost:8082/api/reservations/create-by-extraordinary-appointment",
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          selectedDateTime: raw[index].dateSlot,
          reservationItems: formatedEquipment,
          availableAdminId: raw[index].availableAdminId,
        }),
      }
    );

    if (response.ok) {
      localStorage.removeItem(`company_${id}`);
      alert("Success!");
      history.push('/showAppointments')
    } else {
      console.error("ERROR!");
    }
  };

  return (
    <div>
      <h2 style={{ padding: "20px" }} className="text-center">Custom Appointment</h2>
      <input
        type="date"
        id="date"
        name="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <button className="btn btn-primary ml-3" onClick={handleSubmit}>Show Available Appointments</button>
      <h4 className="mt-5">Select Custom Appointment:</h4>
      <div className="appointmentsContainer">
        {appointments.map((app, index) => (
          <div key={index} className="appointmentsCard">
            <ul>
              <div>
                <p><b>Date and Time:</b> {app.dateSlot} </p>
                <p><b>Duration(in minutes):</b> 60</p>
                <button
                  className="btn btn-primary mt-1"
                  onClick={() => {
                    createReservation(index);
                  }}
                >
                  {" "}
                  Select
                </button>
              </div>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomAppointmentComponent;
