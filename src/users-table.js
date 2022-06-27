import * as React from "react";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const UserTableComponent = () => {
  const url =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const [allUserData, setAllUserData] = useState([]);
  const [list, setList] = useState([]);
  const [masterChecked, setMasterChecked] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [currId, setCurrId] = useState();
  const [edit, setEdit] = useState(false);
  const [pageCount, setpageCount] = useState(0);

  // fetching all Data
  const getAllUsers = async () => {
    try {
      const res = await axios.get(url);
      setAllUserData(res.data);
      setList(res.data.slice(0, 10));
      setpageCount(Math.ceil(res.data.length / 10));
    } catch (e) {
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Select/ UnSelect Table rows
  const onMasterCheck = (e) => {
    let tempList = [...list];
    tempList.map((user) => (user.selected = e.target.checked));
    setMasterChecked(e.target.checked);
    setList(tempList);
    let data = list.filter((e) => e.selected);
    setSelectedList(data);
  };

  // Update List Items state and Master Checkbox State
  const onItemCheck = (e, item) => {
    let tempList = [...list];
    tempList.map((user) => {
      if (user.id === item.id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    const totalItems = list.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;
    setMasterChecked(totalItems === totalCheckedItems);
    setList(tempList);
    let data = list.filter((e) => e.selected);
    setSelectedList(data);
  };

  // state update on edit icon clicked
  const handleEdit = (editRowId) => {
    setEdit(true);
    setCurrId(editRowId);
  };

  // state update when save icon clicked
  const handleSave = () => {
    setEdit(false);
  };

  // handle users delete users only on delete icon press
  const handleDelIcon = (rowId) => {
    let data = list.filter((item) => {
      return rowId !== item.id;
    });
    setList(data);
    setAllUserData(allUserData.filter((e) => rowId !== e.id));
  };

  // handle users delete only on checkbox selection
  const deleteSelectedRows = (selected) => {
    if (selectedList.length === list.length) {
      let data = allUserData.filter((e) => !e.selected);
      setAllUserData(data);
      setList(data.slice(0, 10));
      setpageCount(Math.ceil(data.length / 10));
      setMasterChecked(false);
      setSelectedList([]);
    } else {
      let data = list.filter((e) => !e.selected);
      setList(data);
      setAllUserData(allUserData.filter((e) => !e.selected));
      setSelectedList([]);
    }
  };

  // Editing the user  name
  const handleNameEdit = (nameEdit, rowId) => {
    const updateName = list.map((obj) =>
      obj.id === rowId ? { ...obj, name: nameEdit } : obj
    );
    setList(updateName);
    // console.log(updateName);
  };
  // Editing the user  email
  const handleEmailEdit = (emailEdit, rowId) => {
    const updateEmail = list.map((obj) =>
      obj.id === rowId ? { ...obj, email: emailEdit } : obj
    );
    setList(updateEmail);
    console.log(updateEmail);
  };

  // Editing the user role
  const handleRoleEdit = (roleEdit, rowId) => {
    const updatedRole = list.map((obj) =>
      obj.id === rowId ? { ...obj, role: roleEdit } : obj
    );
    setList(updatedRole);
  };

  //search function for searchby name, email, role
  const arraySearch = (userData, keyword) => {
    const searchTerm = keyword.toLowerCase();
    return userData.filter((value) => {
      return (
        value.name.toLowerCase().match(new RegExp(searchTerm, "g")) ||
        value.email.toLowerCase().match(new RegExp(searchTerm, "g")) ||
        value.role.toLowerCase().match(new RegExp(searchTerm, "g"))
      );
    });
  };

  //handle search
  const handleSearch = async (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      let filteredData = await arraySearch(allUserData, value);
      setAllUserData(filteredData);
      setList(allUserData.slice(0, 10));
      setpageCount(Math.ceil(allUserData.length / 10));
    } else {
      getAllUsers();
    }
  };

  // Page Selection
  const handlePageClick = (data) => {
    let currentPage = data.selected;
    let pagedata = allUserData.slice(currentPage * 10, currentPage * 10 + 10);
    setList(pagedata);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="input-group mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or role"
            aria-label="Enter Search Param"
            onChange={handleSearch}
          />
          <span className="input-group-text" id="basic-addon2">
            Search
          </span>
        </div>
        <br />
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={masterChecked}
                    id="mastercheck"
                    onChange={onMasterCheck}
                  />
                </th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((user) => (
                <tr
                  key={user.id}
                  className={user.selected ? "selected" : ""}
                  style={
                    user.selected ? { backgroundColor: "lightgrey" } : null
                  }
                >
                  <th scope="row">
                    <input
                      type="checkbox"
                      checked={
                        typeof user.selected === "boolean" ? user.selected : ""
                      }
                      className="form-check-input"
                      id="rowcheck{user.id}"
                      onChange={(e) => onItemCheck(e, user)}
                    />
                  </th>
                  {currId === user.id ? (
                    <>
                      <td
                        contentEditable={edit ? true : false}
                        suppressContentEditableWarning={true}
                        onInput={(e) =>
                          handleNameEdit(e.currentTarget.textContent, currId)
                        }
                        style={edit ? { backgroundColor: "darkgrey" } : null}
                      >
                        {user.name}
                      </td>
                      <td
                        contentEditable={edit ? true : false}
                        suppressContentEditableWarning={true}
                        onInput={(e) =>
                          handleEmailEdit(e.currentTarget.textContent, currId)
                        }
                        style={edit ? { backgroundColor: "darkgrey" } : null}
                      >
                        {user.email}
                      </td>
                      <td
                        contentEditable={edit ? true : false}
                        suppressContentEditableWarning={true}
                        onInput={(e) =>
                          handleRoleEdit(e.currentTarget.textContent, currId)
                        }
                        style={edit ? { backgroundColor: "darkgrey" } : null}
                      >
                        {user.role}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </>
                  )}
                  <td>
                    {edit && currId === user.id ? (
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleSave(user.id)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleEdit(user.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      key={user.id}
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDelIcon(user.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="btn btn-secondary p-2 "
              onClick={deleteSelectedRows}
            >
              {selectedList.length
                ? `Delete ${selectedList.length} User`
                : "No User Selected"}
            </button>

            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center  p-2 mb-2"}
              pageClassName={"page-item bg-secondary rounded-circle text-white"}
              pageLinkClassName={
                "page-link  bg-secondary rounded-circle text-white"
              }
              previousClassName={
                "page-item  bg-secondary rounded-circle text-white"
              }
              previousLinkClassName={
                "page-link  bg-secondary rounded-circle text-white"
              }
              nextClassName={
                "page-item  bg-secondary rounded-circle text-white"
              }
              nextLinkClassName={
                "page-link  bg-secondary rounded-circle text-white"
              }
              breakClassName={
                "page-item  bg-secondary rounded-circle text-white"
              }
              breakLinkClassName={
                "page-link  bg-secondary rounded-circle text-white"
              }
              activeClassName={"active "}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTableComponent;
