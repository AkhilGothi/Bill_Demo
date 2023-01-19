import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import uuid from "react-uuid";
import "./example.css";

const AddBill1 = (props) => {
  const [cname, setCName] = useState("");
  const [bdate, setBDate] = useState("");
  const [bnumber, setBNumber] = useState("");
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
  // const date = new Date().toLocaleDateString();
  const [discountObj, setDiscountObj] = useState({});

  const [mainArr, setMainArray] = useState([]);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // console.log(">>>>>> use effect");
    let localData = JSON.parse(localStorage.getItem("dataList"));
    // console.log(localData);
    if (localData !== null) {
      setMainArray(localData);
    }
  }, []);

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
    let tempArr = [...billData];
    tempArr.push(data);
    setBillData([...tempArr]);
  };

  const setFormData = (value, name, arrInd) => {
    billData[arrInd][name] = value;
    setBillData([...billData]);
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

  const storeLocalStorageData = (e) => {
    e.preventDefault();
    if (error) {
      return
    } else {
      let tempbillData = [...billData]
      tempbillData.forEach((ele, i) => {
        if (!ele.item) {
          tempbillData.splice(i, 1)
        }
      })
      let obj = {
        id: uuid(),
        name: cname,
        date: bdate,
        tsubTotal: sub.toFixed(2),
        tgst: gt,
        ttotal: ttl.toFixed(2),
        tpayAmount: totalPayable,
        number: bnumber,
        itemLists: tempbillData,
        discount: discountObj,
        round: rund,
      };
      let tempArr = [...mainArr];
      tempArr.push(obj);
      setMainArray([...tempArr]);
      console.log(obj);
      localStorage.setItem("dataList", JSON.stringify(tempArr));
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
    setTotalPayable();
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
  // // };
  console.log(billData, ">>>>>>billdata")
  console.log(error, ">>>>>>>>>error");
  useEffect(() => {
    if (!cname) {
      setError({ ...error, cname: "Please enter the name" })
    }else if (!bdate){
      setError({ ...error, bdate: "Please enter the date" })
    }else if (!bnumber){
      setError({ ...error, bnumber: "Please enter the billnumber" })
    }else if (!billData[0].item){
      setError({ ...error, item: "Please Enter the item name" })
    }else{
      setError({})
    }

  }, [cname, bdate, bnumber, billData[0].item])

  return (
    <>
      {/* {console.log(">>>>>> return")} */}
      <>
        <Link to="/">
          <Button className="btn btn-info center my-3">Previous Bill</Button>
        </Link>
      </>
      <form onSubmit={(e) => { storeLocalStorageData(e) }}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Name:</InputGroup.Text>
          <Form.Control
            aria-label="Name:"
            placeholder="Client's Name"
            value={cname}
            onChange={(e) => {
              setCName(e.target.value);
            }}
          // required
          />

          {error && error.cname && <div style={{ color: 'red' }}>{error.cname}</div>}
          <br />
          <br />
          <InputGroup.Text>Bill date:</InputGroup.Text>
          <Form.Control
            type="date"
            aria-label="Bill date:"
            value={bdate}
            onChange={(el) => setBDate(el.target.value)}
          // required
          />
          {error && error.bdate && <div style={{ color: 'red' }}>{error.bdate}</div>}
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Bill number:</InputGroup.Text>
          <Form.Control
            type="number"
            aria-label="Bill number:"
            placeholder="Enter bill number"
            value={bnumber}
            onChange={(e) => setBNumber(e.target.value)}
          // required
          />
          {error && error.bnumber && <div style={{ color: 'red' }}>{error.bnumber}</div>}
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
                  // required
                  />
                  {error && error.item && <div style={{ color: 'red' }}>{error.item}</div>}

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
          <li className="list-group-item">Sub-total : ₹{sub.toFixed(2)}</li>
          <li className="list-group-item">GST : ₹{gt}</li>
          <li className="list-group-item">Total : ₹{ttl.toFixed(2)}</li>
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
            Total Payble: ₹ {totalPayable ? Math.round(totalPayable) : Math.round(ttl.toFixed(2))}
          </li>
        </ul>
        <button
          className="btn btn-success"
          type="submit"
          disabled={billData.length === 0}
          onClick={() => {
            setIsSubmitting(true);
            console.log('submit clicked')
          }}
        // onSubmit={validateForm()}
        >
          Submit
        </button>
        {/* {cname && bdate && bnumber ? (
          <Link to="/">
            <button
              className="btn btn-success"
              type="submit"
              disabled={billData.length === 0}
              onClick={() => {
                // storeLocalStorageData();
                // alert("Your Data successfully submited");
                // AddNewBill();
              }}
            // onSubmit={validateForm()}
            >
              Submit
            </button>
          </Link>
        ) : (
          
        )} */}
      </form>

    </>
  );
};

export default AddBill1;
