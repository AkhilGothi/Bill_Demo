import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import "./example.css";

const AddBill = (props) => {
  // const {testvalue} = useParams();
  // console.log(testvalue);
  const [cname, setCName] = useState("");
  const [bdate, setBDate] = useState("");
  const [bnumber, setBNumber] = useState("");
  const [totalPayable, setTotalPayable] = useState(0);
  const [sub, setSub] = useState(0);
  const [ttl, setTtl] = useState(0);
  const [rund, setRund] = useState(0);
  const [gt, setGt] = useState(0);
  const [billData, setBillData] = useState([]);
  const [error, setError] = useState({});
  // console.log(billData,">>>>>bill data");
  // const date = new Date().toLocaleDateString();
  const [discountObj, setDiscountObj] = useState({});
  const [mainArr, setMainArray] = useState([]);
  // console.log(mainArr);
  const navigate = useNavigate();
  const [errArray, setErrArr] = useState([
    {
      item: true,
      quantity: true,
      price: true,
    },
  ]);
  const [requiredData, setRequiredData] = useState(true);
  const [submited, setSubmitted] = useState(false);
  useEffect(() => {
    // console.log(">>>>>> use effect");
    // JSON.parse(localStorage.getItem('edit'))
    let localData = JSON.parse(localStorage.getItem("edit"));
    // console.log(localData,">>>>localdata");
    setCName(localData.name);
    setBNumber(localData.number);
    setBDate(localData.date);
    setTotalPayable(localData.tpayAmount);
    setSub(Number(localData.tsubTotal));
    setBillData(localData.itemLists);
    setGt(Number(localData.tgst));
    setDiscountObj({ ...localData.discount });
    setTtl(Number(localData.ttotal));
    setRund(localData.rund);
    if (localData !== null) {
      setMainArray(localData);
    }

    // console.log(mainDetails);
  }, []);
  useEffect(() => {
    errArray.forEach((element) => {
      if (
        element.item === false &&
        element.quantity === false &&
        element.price === false
      ) {
        setRequiredData(false);
      } else {
        setRequiredData(true);
        return;
      }
    });
  }, [errArray]);

  // const alldata = [...billData];
  // alldata.push(update, namedate);
  // let alldata = Object.assign({},namedate, billData, update);
  // console.log(alldata);

  const onCalculatedTotal = () => {
    let subTotal = 0;
    let total = 0;
    billData.forEach((ele, i) => {
      subTotal = subTotal + ele.subtotal;
      total = total + ele.total;
    });
    setSub(subTotal);
    setTtl(total);
    setTotalPayable(Number(total) - Number(discountObj?.disValue));
    setRund((Math.round(total) - total).toFixed(2));
    setGt((total - subTotal).toFixed(2));
  };

  const clickRowInTable = () => {
    let data = {
      id: uuid(),
      name: "",
      date: "",
      item: "",
      quantity: 0,
      price: 0,
      gst: 0,
      subtotal: "",
      total: "",
    };
    let errData = {
      item: true,
      quantity: true,
      price: true,
    };
    let tempArr = [...billData];
    let tempErrArr = [...errArray];
    tempArr.push(data);
    tempErrArr.push(errData);
    console.log(tempArr);
    setErrArr([...tempErrArr]);
    setBillData([...tempArr]);
  };

  const setFormData = (value, name, arrInd) => {
    billData[arrInd][name] = value;
    setBillData([...billData]);
    console.log(value);
    if (value) {
      errArray[arrInd][name] = false;
      setErrArr([...errArray]);
    } else {
      errArray[arrInd][name] = true;
      setErrArr([...errArray]);
    }
    if (name === "price" || name === "quantity") {
      billData[arrInd]["subtotal"] =
        billData[arrInd]["price"] * billData[arrInd]["quantity"];
      setBillData([...billData]);
      onCalculatedTotal();
    }
    if (name === "price" || name === "quantity" || name === "gst") {
      billData[arrInd]["total"] =
        billData[arrInd]["price"] * billData[arrInd]["quantity"] +
        (billData[arrInd]["price"] *
          billData[arrInd]["quantity"] *
          billData[arrInd]["gst"]) /
          100;
      setBillData([...billData]);
      onCalculatedTotal();
    }
  };
  const deleteItem = (id) => {
    let tempData = [...billData];
    tempData.splice(id, 1);
    setBillData([...tempData]);

    // console.log(billData.id)
    // console.log(e.target.value, typeof (e.target.value), ">>>>>>>>>>>>")
    // console.log(billData, ">>>>>billData>>>")
    // const updateitems = billData.filter((item) => item.id !== Number(e.target.value));
    // // const updateitems = billData.splice(e.target.id, 1);
    // setBillData(updateitems);
    // return
  };

  // var rund = (Math.round(totalPayable) - totalPayable).toFixed(2);

  const setDiscountData = (name, value) => {
    discountObj[name] = value;
    setDiscountObj({ ...discountObj });
    if (name === "disValue") {
      if (discountObj?.disType === "₹") {
        setTotalPayable(ttl - parseInt(value).toFixed(2));
      } else if (discountObj?.disType === "%") {
        let x = (ttl * parseInt(value)) / 100;
        setTotalPayable(ttl - x.toFixed(2));
      }
    } else if (name === "disType") {
      if (discountObj?.disValue && value === "₹") {
        setTotalPayable(ttl - parseInt(discountObj?.disValue).toFixed(2));
      } else {
        let x = (ttl * parseInt(discountObj?.disValue)) / 100;
        setTotalPayable(ttl - x.toFixed(2));
      }
    }
  };

  const updateData = (e) => {
    e.preventDefault();
    setSubmitted(true);
    billData.forEach((element, i) => {
      if (!element.item || element.quantity === 0 || element.price === 0) {
        setRequiredData(true);
        return;
      } else {
        setRequiredData(false);
      }
    });
    if (!requiredData) {
      setSubmitted(false);
      let localData1 = JSON.parse(localStorage.getItem("edit"));
      let mainDetails = JSON.parse(localStorage.getItem("dataList"));
      let mainId = mainDetails.findIndex((x) => x.id === localData1.id);
      // let justArr = [...billData]
      let localData2 = {
        ...localData1,
        name: cname,
        date: bdate,
        number: bnumber,
        itemLists: billData,
        tpayAmount: totalPayable,
        discount: discountObj,
      };
      if (mainId !== -1) {
        mainDetails.splice(mainId, 1, localData2);
        // console.log(mainDetails);
      }
      localStorage.setItem("dataList", JSON.stringify(mainDetails));
      localStorage.removeItem("edit");
      // storeLocalStorageData();
      // localStorage.removeItem('edit');
      alert("Your data successfully Updated");
      navigate("/");
    }
  };
  useEffect(() => {
    if (!cname) {
      setError({ ...error, cname: "Please enter the name" });
    } else if (!bdate) {
      setError({ ...error, bdate: "Please enter the date" });
    } else if (!bnumber) {
      setError({ ...error, bnumber: "Please enter the billnumber" });
    } else {
      setError({});
    }
  }, [cname, bdate, bnumber]);

  return (
    <>
      {/* {console.log(">>>>>> return")} */}
      <>
        <Link to="/">
          <Button className="btn btn-info center my-3">Previous Bill</Button>
        </Link>
      </>
      <form onSubmit={updateData}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Name:</InputGroup.Text>
          <Form.Control
            aria-label="Name:"
            placeholder="Client's Name"
            value={cname}
            onChange={(e) => setCName(e.target.value)}
            required
          />
          {error && error.cname && (
            <div style={{ color: "red" }}>{error.cname}</div>
          )}
          <br />
          <br />
          <InputGroup.Text>Bill date:</InputGroup.Text>
          <Form.Control
            type="date"
            aria-label="Bill date:"
            value={bdate}
            onChange={(el) => setBDate(el.target.value)}
            required
          />
          {error && error.bdate && (
            <div style={{ color: "red" }}>{error.bdate}</div>
          )}
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Bill number:</InputGroup.Text>
          <Form.Control
            type="number"
            aria-label="Bill number:"
            placeholder="Enter bill number"
            value={bnumber}
            onChange={(e) => setBNumber(e.target.value)}
            required
          />
          {error && error.bnumber && (
            <div style={{ color: "red" }}>{error.bnumber}</div>
          )}
        </InputGroup>

        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>No.</th>
              <th className="constth">Item</th>
              <th style={{ paddingLeft: "25px" }}>Quantity</th>
              <th style={{ paddingLeft: "35px" }}>Price</th>
              <th style={{ paddingLeft: "40px" }}>GST</th>
              <th style={{ paddingRight: "40px" }}>Sub-total</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {billData?.map((data, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    className="btn btn-light col-sm-10"
                    type="text"
                    placeholder="Item"
                    value={data.item}
                    onChange={(e) => setFormData(e.target.value, "item", i)}
                  ></input>
                  {submited && !billData[i]["item"] && (
                    <div style={{ color: "red" }}>*Item is required</div>
                  )}
                </td>
                <td>
                  <input
                    className="btn btn-light col-sm-5"
                    size="4"
                    type="number"
                    placeholder="Quantity"
                    value={Math.abs(data.quantity)}
                    onChange={(e) => setFormData(e.target.value, "quantity", i)}
                  ></input>
                  {submited && !billData[i]["quantity"] && (
                    <div style={{ color: "red" }}>*Quantity is required</div>
                  )}
                </td>
                <td>
                  <input
                    className="btn btn-light col-sm-5"
                    type="number"
                    placeholder="Price"
                    value={Math.abs(data.price)}
                    onChange={(e) => setFormData(e.target.value, "price", i)}
                  ></input>
                  {submited && !billData[i]["price"] && (
                    <div style={{ color: "red" }}>*Price is required</div>
                  )}
                </td>
                <td>
                  <input
                    className="btn btn-light col-sm-5"
                    type="number"
                    placeholder="GST"
                    value={Math.abs(data.gst)}
                    onChange={(e) => setFormData(e.target.value, "gst", i)}
                  ></input>
                </td>
                <td
                  value={data.sub_total}
                  onChange={(e) => setFormData(e.target.value, "sub_total", i)}
                  className="px-2"
                >
                  {Math.abs((data.quantity * data.price).toFixed(2))}
                  {/* {data?.subtotal} */}
                </td>
                <td
                  value={data?.total}
                  onChange={(e) => setFormData(e.target.value, "total", i)}
                >
                  {Math.abs(
                    (
                      data.quantity * data.price +
                      (data.quantity * data.price * data.gst) / 100
                    ).toFixed(2)
                  )}
                  {/* {data?.total} */}
                </td>

                <td>
                  {billData?.length > 1 && (
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        deleteItem(i);
                      }}
                    >
                      Delete
                    </button>
                  )}

                  {billData?.length - 1 === i && (
                    <Button
                      className="small"
                      variant="primary"
                      onClick={() => {
                        clickRowInTable();
                      }}
                    >
                      Add
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <button onClick={() => { handlePrintArray() }}>Print Array</button> */}

        <ul>
          <li className="list-group-item">Sub-total : ₹{sub.toFixed(2)}</li>
          <li className="list-group-item">GST : ₹{gt}</li>
          <li className="list-group-item">Total : ₹{ttl.toFixed(2)}</li>
          <li className="list-group-item">
            Discount :
            <div>
              <select
                className="btn btn-secondary"
                value={discountObj.disType}
                onChange={(e) => setDiscountData("disType", e.target.value)}
              >
                <option className="btn btn-secondary" value="">
                  Select Discount Type
                </option>
                <option className="btn btn-secondary" value="₹">
                  ₹
                </option>
                <option className="btn btn-secondary" value="%">
                  %
                </option>
              </select>

              <input
                className="btn btn-light"
                placeholder="Enter Discount Value"
                value={discountObj.disValue}
                defaultValue={0}
                onChange={(e) => setDiscountData("disValue", e.target.value)}
              ></input>
              {/* {discountObj?.disType && (
              
            )} */}
            </div>
          </li>
          <li className="list-group-item">
            Total Discount Ruppes :{" "}
            {ttl && totalPayable ? (ttl - totalPayable).toFixed(2) : 0}
          </li>

          <li className="list-group-item">RoundUp : {rund}</li>
          <li className="list-group-item">
            Total Payble: ₹
            {totalPayable
              ? Math.round(totalPayable)
              : Math.round(ttl.toFixed(2))}
          </li>
        </ul>

        {/* {!error ? <button
          className="btn btn-success"
          type="submit"
          onClick={() => {
            updateData();
          }}
        >
          update
        </button> : <button
          className="btn btn-success"
          onClick={() => {
            // alert("Error")
          }}
        >
          update
        </button>} */}
        <button
          className="btn btn-success"
          type="submit"
          // onClick={() => {
          //   updateData();
          //   // alert("Your data successfully Updated")
          // }}
        >
          update
        </button>
      </form>
    </>
  );
};

export default AddBill;
