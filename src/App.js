import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import UserTableComponent from "./users-table";

export default function App() {
  return (
    <div className="container">
      <UserTableComponent />
    </div>
  );
}
