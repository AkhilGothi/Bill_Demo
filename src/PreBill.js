import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const PreBill = (props) => {
  const [cusname, setCusName] = useState("");


  const [getAllLocalData, setGetAllLocalData] = useState(
    JSON.parse(localStorage.getItem("dataList")).map((e) => e)
  );
  const [dataFromStorage, setDataFromStorage] = useState(
    JSON.parse(localStorage.getItem("dataList")).map((e) => e)
  );

  const getDataFromLocalStorage = () => { 
    let namekey = JSON.parse(localStorage.getItem("dataList"));
    if (namekey.length > 0) {
      let data = namekey.filter((x) => x.name === cusname);
      setDataFromStorage(data);
    } else {
      alert("No Data Found");
    }
  };

     
  const deleteBill = (it) => {
    let tempData = [...getAllLocalData];
    tempData.splice(it, 1);
    setGetAllLocalData([...tempData])
    localStorage.setItem("dataList", JSON.stringify(tempData));
    let tempData2 = [...dataFromStorage];
    tempData2.splice(it, 1);
    setDataFromStorage([...tempData]);
  };

  const editAction = (singleObj) => {
    localStorage.setItem('edit',JSON.stringify(singleObj)) 
  }

  return (
    <>
      <style>
        {`
      table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
      `}
      </style>
      <Link to="/add">
        <Button
          className="btn btn-info center m-lg-5"
        >
          Add New Bill
        </Button>
      </Link>
      <InputGroup className="mb-3">
        {/* {console.log(dataFromStorage)} */}
        <InputGroup.Text>Name:</InputGroup.Text>
        <Form.Control
          aria-label="Name:"
          placeholder="Client's Name"
          value={cusname}
          onChange={(e) => setCusName(e.target.value)}
          required
        />
        <button
          type="button"
          disabled={!cusname}
          className="btn btn-success"
          onClick={getDataFromLocalStorage}
        >
          Search
        </button>
      </InputGroup>
      <table>
        <thead>
          <tr>
            <th>Bill Number</th>
            <th>Bill Name</th>
            <th>Bill Date</th>
            <th>GST</th>
            <th>Total Item</th>
            <th>Sub Total</th>
            <th>Total Payable</th>
          </tr>
        </thead>
        <tbody>
          {dataFromStorage?.map((data, i) => (
            <tr key={i}>
              <td>{data.number}</td>
              <td>{data.name}</td>
              <td>{data.date}</td> 
              <td>{data.tgst}</td>
              <td>{data?.itemLists?.length}</td>
              <td>{data.tsubTotal}</td>
              <td>{Math.round(data.tpayAmount? data.tpayAmount : data.ttotal)}</td> 
              <Button
                className="btn btn-danger m-2"
                onClick={() => {
                  deleteBill(i);
                }}
              >
                Delete
              </Button>
              
              <Link to="/edit" params={{ testvalue: data }}>
              <Button
                className="btn btn-primary"
                onClick={() => {
                  editAction(data);
                }}
              >
                Edit
              </Button>
              </Link>
          
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PreBill;

