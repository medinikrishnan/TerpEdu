import React, {useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";

function StudentDashboard() {
  const { user_name } = useParams();
  const navigate = useNavigate(); // React Router hook for navigation
  const [userID, setUserID] = useState(localStorage.getItem("user_id"));
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Navigate to a new path
  const handleNavigation = (path) => {
    navigate(path);
  };

  const fetchDashboardData = async () => {
    setLoading(true); // Start loading when fetching data
    setError(""); // Reset error state before fetching
    try {
      const response = await fetch(`/student/dashboard/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      console.log("Dashboard data:", data);
      setEnrolledCourses(data.enrolled_courses || []);
      setAvailableCourses(data.available_courses || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false); // Stop loading after data is fetched or error occurred
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) {
      alert("Please select a course to add!");
      return;
    }
    try {
      const response = await fetch("/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID, course_id: selectedCourse }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add course");
      }
      alert("Course added successfully!");
      fetchDashboardData();
      setSelectedCourse("");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  const handleDropCourse = async () => {
    if (!selectedCourse) {
      alert("Please select a course to drop!");
      return;
    }
    try {
      const response = await fetch("/student/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID, course_id: selectedCourse }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to drop course");
      }
      alert("Course dropped successfully!");
      fetchDashboardData();
      setSelectedCourse("");
    } catch (error) {
      console.error("Error dropping course:", error);
      alert("Failed to drop course. Please try again.");
    }
  };

  const renderCourses = (courses) => {
    return courses.map((course) => (
      <li key={course.course_id}>
        {course.course_name} (Course ID: {course.course_id})
      </li>
    ));
  };

  return (
    <div style={{ padding: "20px" }}>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Open Sans', sans-serif;
            background-color: #f9f9f9;
          }

          .header {
            width: 100%;
            background-color: #D32F2F;
            color: white;
            padding: 15px 20px;
            font-size: 28px;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .navbar {
          display: flex;
          justify-content: space-around;
          background-color: #424242;
          color: white;
          padding: 8px;
          width: 100%;
          font-size: 14px;
          font-family: 'Open Sans', sans-serif;
        }

        .navbar span {
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .navbar span:hover {
          background-color: #616161;
        }


          .logo-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .logo-container img {
            max-width: 300px;
            height: auto;
          }

          .turtle-image {
            position: absolute;
            right: 0;
            bottom: 0;
            max-height: calc(100vh - 80px);
            max-width: 350px;
            opacity: 0.5;
          }

          .dashboard-container {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }

          .form-container {
            margin: 20px 0;
            text-align: center;
          }

          .courses-section h3 {
            font-size: 20px;
            margin-bottom: 10px;
          }

          .courses-section ul {
            padding-left: 20px;
            font-size: 18px;
          }

          .action-buttons {
            margin-top: 20px;
            display: flex;
            justify-content: center;
          }

          button {
            padding: 12px 20px;
            margin: 0 10px;
            background-color: #D32F2F;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          button:hover {
            background-color: #b71c1c;
          }

          select {
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            margin-right: 10px;
          }
        `}
      </style>

      <header className="header">
        <span>TerpEdu</span>
        <span>Student Dashboard</span>
        <span>Welcome, {user_name}</span>
      </header>
      <div className="navbar">
          <span onClick={() => handleNavigation('/inbox')}>Inbox</span>
          <span onClick={() => handleNavigation('/inst_announcements')}>Announcements</span>
          <span onClick={() => handleNavigation('/uploaded_materials_student')}>Uploaded materials</span>
          {/* <span onClick={() => handleNavigation('/view_enrolled_students')}>View enrolled students</span> */}
        </div>

      <div className="logo-container">
        <img src="/TerpEdu.png" alt="TerpEdu Logo" />
      </div>

      {loading ? (
        <p>Loading...</p> // Display loading text while data is being fetched
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p> // Display error message if any error occurs
      ) : (
        <div className="dashboard-container">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Student Dashboard
          </h2>
          <div className="courses-section">
            <h3>Enrolled Courses</h3>
            <ul>{renderCourses(enrolledCourses)}</ul>
          </div>
          <div className="courses-section">
            <h3>Available Courses</h3>
            <ul>{renderCourses(availableCourses)}</ul>
          </div>
          <div className="action-buttons">
            <select
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">Select a course to add</option>
              {availableCourses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCourse}>Add Course</button>

            <select
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">Select a course to drop</option>
              {enrolledCourses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
            <button onClick={handleDropCourse}>Drop Course</button>
          </div>
        </div>
      )}

      <img src="/turtle.png" alt="Turtle" className="turtle-image" />
    </div>
  );
}

export default StudentDashboard;
