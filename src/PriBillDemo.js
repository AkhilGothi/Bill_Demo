import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const PreBillDemo = (props) => {
  const [cusname, setCusName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editObjId, setEditObjId] = useState('');

  const [totalPayable, setTotalPayable] = useState();
  const [sub, setSub] = useState(0);
  const [ttl, setTtl] = useState(0);
  const [rund, setRund] = useState(0);
  const [gt, setGt] = useState(0);
  const [discountObj, setDiscountObj] = useState({});

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

  const onCalculatedTotal = () => {
    let subTotal = 0;
    let total = 0;
    getAllLocalData.forEach((ele, i) => {
      subTotal = subTotal + ele.subtotal;
      total = total + ele.total;
    });
    setSub(subTotal);
    setTtl(total);
    setTotalPayable(Number(total) - Number(discountObj?.disValue));
    setRund((Math.round(total) - total).toFixed(2));
    setGt((total - subTotal).toFixed(2));
  };

  const setFormData = (value, name, dataId, arrInd) => {
    let ind = getAllLocalData.findIndex(x => x.id === dataId);
    if(ind !== -1){
      getAllLocalData[ind][name] = value;
      setGetAllLocalData([...getAllLocalData]);
      if (name === "price" || name === "quantity") {
        getAllLocalData[ind]["subtotal"] =
          getAllLocalData[ind]["price"] * getAllLocalData[ind]["quantity"];
        setGetAllLocalData([...getAllLocalData]);
        onCalculatedTotal();
      }
      if (name === "price" || name === "quantity" || name === "gst") {
        getAllLocalData[ind]["total"] =
          getAllLocalData[ind]["price"] * getAllLocalData[ind]["quantity"] +
          (getAllLocalData[ind]["price"] *
            getAllLocalData[ind]["quantity"] *
            getAllLocalData[ind]["gst"]) /
          100;
        setGetAllLocalData([...getAllLocalData]);
        onCalculatedTotal();
      } 
    }
    dataFromStorage[arrInd][name] = value;
    setDataFromStorage([...dataFromStorage]);
    if (name === "price" || name === "quantity") {
      dataFromStorage[arrInd]["subtotal"] =
        dataFromStorage[arrInd]["price"] * dataFromStorage[arrInd]["quantity"];
      setDataFromStorage([...dataFromStorage]);
      onCalculatedTotal();
    }
    if (name === "price" || name === "quantity" || name === "gst") {
      dataFromStorage[arrInd]["total"] =
        dataFromStorage[arrInd]["price"] * dataFromStorage[arrInd]["quantity"] +
        (dataFromStorage[arrInd]["price"] *
          dataFromStorage[arrInd]["quantity"] *
          dataFromStorage[arrInd]["gst"]) /
        100;
      setDataFromStorage([...dataFromStorage]);
      onCalculatedTotal();
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
    setIsEdit(true);
    setEditObjId(singleObj.id);
  }

  const submitEditData = () => {
    setIsEdit(false);
    setEditObjId('');
    localStorage.setItem("dataList", JSON.stringify(getAllLocalData));
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
          onClick={props.AddNewBill}
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
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>GST</th>
            <th>Sub-total</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {dataFromStorage?.map((data, i) => (
            <tr key={i}>
              <td>{data.number}</td>
              <td>{data.name}</td>
              <td>{data.date}</td>
              <td>
                {isEdit && editObjId === data.id
                  ? <input
                    className="btn btn-light col-sm-10"
                    type="text"
                    placeholder="Item"
                    value={data.item}
                    onChange={(e) => setFormData(e.target.value, "item", data.id, i)}
                  ></input>
                  :
                  data.item
                }
              </td>
              <td>
                {isEdit && editObjId === data.id
                  ?
                  <input
                    className="btn btn-light col-sm-5"
                    size="4"
                    type="number"
                    placeholder="Quantity"
                    value={Math.abs(data?.quantity)}
                    onChange={(e) => setFormData(e.target.value, "quantity", data.id, i)}
                  ></input>
                  :
                  data.quantity
                }
              </td>
              <td>
                {isEdit && editObjId === data.id
                  ?
                  <input
                    className="btn btn-light col-sm-5"
                    type="number"
                    placeholder="Price"
                    value={Math.abs(data?.price)}
                    onChange={(e) => setFormData(e.target.value, "price", data.id, i)}
                  ></input>
                  :
                  data.price
                }
              </td>
              <td>
                {isEdit && editObjId === data.id
                  ?
                  <input
                    className="btn btn-light col-sm-5"
                    type="number"
                    placeholder="GST"
                    value={Math.abs(data.gst)}
                    onChange={(e) => setFormData(e.target.value, "gst", data.id, i)}
                  ></input>
                  :
                  data.gst
                }
              </td>
              <td>{data.subtotal}</td>
              <td>{data.total}</td>
              <Button
                className="btn btn-danger"
                onClick={() => {
                  deleteBill(i);
                }}
              >
                Delete
              </Button>
              {isEdit && editObjId === data.id ? 
                <Button
                className="btn btn-success"
                onClick={() => {
                  submitEditData(data);
                }}
              >
                Submit
              </Button>
              :
              <Button
                className="btn btn-primary"
                onClick={() => {
                  editAction(data);
                }}
              >
                Edit
              </Button>
          }
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PreBillDemo;
