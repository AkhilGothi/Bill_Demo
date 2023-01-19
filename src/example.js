import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import "./example.css";
import { useFormik } from "formik";
import { signUpSchema } from "./Reg";

const AddBill = (props) => {
  const [cname, setCName] = useState("");
  const [bdate, setBDate] = useState("");
  // const [bnumber, setBNumber] = useState("");
  const [totalPayable, setTotalPayable] = useState();
  const [sub, setSub] = useState(0);
  const [ttl, setTtl] = useState(0);
  const [rund, setRund] = useState(0);
  const [gt, setGt] = useState(0);
  const [billData, setBillData] = useState([
    {
      id: uuid(),
      name: cname,
      date: bdate,
      item: "",
      quantity: 0,
      price: 0,
      gst: 0,
      subtotal: "",
      total: "",
    },
  ]);
  const [errArray, setErrArr] = useState([
    {
      item: true,
      quantity: true,
      price: true,
    },
  ]);
  const [requiredData, setRequiredData] = useState(true);
  const [submited, setSubmitted] = useState(false);
  // const date = new Date().toLocaleDateString();
  const [discountObj, setDiscountObj] = useState({});

  const [mainArr, setMainArray] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // console.log(">>>>>> use effect");
    let localData = JSON.parse(localStorage.getItem("dataList"));
    // console.log(localData);
    if (localData !== null) {
      setMainArray(localData);
    }
  }, []);

  useEffect(()=>{
    errArray.forEach(element => {
      if (element.item === false && element.quantity === false && element.price === false) {
        setRequiredData(false);
      } else {
        setRequiredData(true);
        return 
      }
    });
  },[errArray])

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
    setErrArr([...tempErrArr]);
    setBillData([...tempArr]);    
  };

  const setFormData = (value, name, arrInd) => {
    billData[arrInd][name] = value;
    setBillData([...billData]);
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
    
    // Promise.all(errArray.map(element => {
    //   if (element.item === false && element.quantity === false && element.price === false) {
    //     return tempVar = false;
    //   } else {
    //     return tempVar = true;
    //   }
    // })).then(()=>{
    //   console.log(tempVar);
    //   setRequiredData(tempVar)
    // })
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

  // const initialValues = {
  //   cname1: "",
  //   bdate: ""
  // }
  const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
    initialValues: {
      cname1: "",
      bdate1: "",
      bnumber1: "",
    },
    validationSchema: signUpSchema,
    onSubmit: () => { storeLocalStorageData() }
  })
  // console.log(values);

  const storeLocalStorageData = () => {
    setSubmitted(true);
    billData.forEach(element => {
      if (!element.item || !element.quantity || !element.price) {
        setRequiredData(true);
        return;
      } else {
        setRequiredData(false);
      }
    });

    if (!requiredData) {
      setSubmitted(false);
      let tempbillData = [...billData]
      tempbillData.forEach((ele, i) => {
        if (!ele.item) {
          tempbillData.splice(i, 1)
        }
      })
      let obj = {
        id: uuid(),
        name: values.cname1,
        date: values.bdate1,
        tsubTotal: sub.toFixed(2),
        tgst: gt,
        ttotal: ttl.toFixed(2),
        tpayAmount: totalPayable,
        number: values.bnumber1,
        itemLists: tempbillData,
        discount: discountObj,
        round: rund,
      };
      let tempArr = [...mainArr];
      tempArr.push(obj);
      setMainArray([...tempArr]);
      localStorage.setItem("dataList", JSON.stringify(tempArr));
    AddNewBill();
    
    navigate('/');
    // window.location.replace('/')
    }

    // let data = [...mainArr, ...tempData];
    // let data2 = [];
    // data.forEach((element) => {
    //   let x = data2.filter(
    //     (i) =>
    //       i.item === element.item &&
    //       i.price === element.price &&
    //       i.quantity === element.quantity &&
    //       i.name === cname &&
    //       i.date  === bdate
    //   );
    //   if (x.length === 0) {
    //     data2.push(element);
    //   }
    // });
    // setMainArray([...data2]);
  };

  // const storeLocalStorageData = () => {
  //   // const allitem = [...billData];
  //   const otherdata = {
  //     name : cname ,
  //     date : bdate ,
  //     number : bnumber ,
  //     subTotal : sub ,
  //     ttotal : ttl ,
  //     totalPayable : totalPayable
  //   }
  //   const final = Object.assign(...billData,otherdata)

  //   setBillData([...final]);
  //   let data = [...mainArr, ...final];
  //    let data2 = [];
  //    data.forEach((element) => {
  //      let x = data2.filter(
  //        (i) =>
  //          i.item === element.item &&
  //          i.price === element.price &&
  //          i.quantity === element.quantity &&
  //          i.name === cname &&
  //          i.date  === bdate
  //      );
  //      if (x.length === 0) {
  //        data2.push(element);
  //      }
  //    });
  //    setMainArray([...data2]);
  //    localStorage.setItem("dataList", JSON.stringify(data2));
  // };

  const AddNewBill = () => {
    setBillData([
      {
        id: uuid(),
        name: cname,
        date: bdate,
        item: "",
        quantity: 0,
        price: 0,
        gst: 0,
        subtotal: "",
        total: "",
      },
    ]);
    setCName("");
    setBDate("");
    setTotalPayable(0);
    setSub(0);
    setTtl(0);
    setRund(0);
    setGt(0);
    setDiscountObj({});
  };
  // const validateForm = () => {
  //   if (!(cname && bdate && bnumber)) {
  //     alert("Name must be filled out");
  //   } else {
  //     storeLocalStorageData();
  //   }
  // };

  return (
    <>
      {/* {console.log(">>>>>> return")} */}
      <>
        <Link to="/">
          <Button className="btn btn-info center my-3">Previous Bill</Button>
        </Link>
      </>
      <form onSubmit={handleSubmit} action='formsubmit'>
        <InputGroup className="mb-3">
          <InputGroup.Text>Name:</InputGroup.Text>
          <Form.Control
            aria-label="Name:"
            placeholder="Client's Name"
            name="cname1"
            id="cname1"
            value={values.cname1}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete='off'
          />
          {errors.cname1 && touched.cname1 ? (
            <p style={{ color: "red" }}>{errors.cname1}</p>
          ) : null}
          <br />
          <br />
          <InputGroup.Text>Bill date:</InputGroup.Text>
          <Form.Control
            type="date"
            aria-label="Bill date:"
            name="bdate1"
            value={values.bdate1}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          
          {errors.bdate1 && touched.bdate1 ? (
            <p style={{ color: "red" }}>{errors.bdate1}</p>
          ) : null}
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Bill number:</InputGroup.Text>
          <Form.Control
            type="number"
            aria-label="Bill number:"
            placeholder="Enter bill number"
            name="bnumber1"
            value={values.bnumber1}
            onChange={handleChange}
          />
          {errors.bnumber1 && touched.bnumber1 ? (
            <p style={{ color: "red" }}>{errors.bnumber1}</p>
          ) : null}
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
                  {submited && !billData[i]['item'] && <div style={{ color: 'red' }}>*Item is required</div>}
                </td>
                <td>
                  <input
                    className="btn btn-light col-sm-5"
                    size="4"
                    type="number"
                    placeholder="Quantity"
                    value={Math.abs(data?.quantity)}
                    onChange={(e) => setFormData(e.target.value, "quantity", i)}
                    required
                  ></input>
                  {submited && !billData[i]['quantity'] && <div style={{ color: 'red' }}>*Quantity is required</div>}
                </td>
                <td>
                  <input
                    className="btn btn-light col-sm-5"
                    type="number"
                    placeholder="Price"
                    value={Math.abs(data?.price)}
                    onChange={(e) => setFormData(e.target.value, "price", i)}
                    required
                  ></input>
                  {submited && !billData[i]['price'] && <div style={{ color: 'red' }}>*Price is required</div>}
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
                  {billData.length > 1 && (
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        deleteItem(i);
                      }}
                    >
                      Delete
                    </button>
                  )}

                  {billData.length - 1 === i && (
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
          <li className="list-group-item">Sub-total : ₹{Number(sub).toFixed(2)}</li>
          <li className="list-group-item">GST : ₹{gt}</li>
          <li className="list-group-item">Total : ₹{Number(ttl).toFixed(2)}</li>
          <li className="list-group-item">
            Discount :
            <div>
              <select
                className="btn btn-secondary"
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

              {discountObj?.disType && (
                <input
                  className="btn btn-light"
                  placeholder="Enter Discount Value"
                  value={discountObj?.disValue}
                  defaultValue={0}
                  onChange={(e) => setDiscountData("disValue", e.target.value)}
                ></input>
              )}
            </div>
          </li>
          <li className="list-group-item">
            Total Discount Ruppes : {ttl && totalPayable ? (ttl - totalPayable).toFixed(2) : 0}
          </li>

          <li className="list-group-item">RoundUp : {rund}</li>
          <li className="list-group-item">
            Total Payble: ₹ {totalPayable ? Math.round(totalPayable) : Math.round(Number(ttl).toFixed(2))}
          </li>
        </ul>

        {values.cname1 && values.bdate1 && values.bnumber1  ? (
          // <Link to="/">
            <button
              className="btn btn-success"
              type="submit"
              disabled={billData.length === 0}
              onClick={() => {
                storeLocalStorageData();
                // alert("Your Data successfully submited");
                // AddNewBill();
              }}
            // onSubmit={validateForm()}
            >
              Submit
            </button>
          // </Link>
        ) : (
          <button
            className="btn btn-success"
            // type="submit"
            // disabled 
            onClick={() => {
              alert("please fill all data");  
            }}
          // onSubmit={validateForm()}
          >
            Submit
          </button>
        )}
      </form>
    </>
  );
};

export default AddBill;
