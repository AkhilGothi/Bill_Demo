import React, { useState } from "react";

const AddBill = () => {
  const [billData, setBillData] = useState([{
    id: " ",
    name: "",
    date: "",
    item: "",
    quantity: "",
    price: "",
    gst: "",
    subtotal: "",
    total: ""
  }]);

  const [discountObj, setDiscountObj] = useState({});

  const setFormData = (value, name, arrInd) => {
    billData[arrInd][name] = value;
    setBillData([...billData]);
  };

  const getSubTotal = (quantity = 0, price = 0, gst = 0) => {
    if (gst) {
      return Math.abs((quantity * price + (quantity * price * gst) / 100).toFixed(2))
    } else {
      return Math.abs((quantity * price).toFixed(2))
    }
  }

  const addItem = () => {
    let data = {
      id: " ",
      name: "",
      date: "",
      item: "",
      quantity: "",
      price: "",
      gst: "",
      subtotal: "",
      total: "",
    };
    let tempArr = [...billData];
    tempArr.push(data);
    setBillData([...tempArr]);
  };

  const deleteItem = (id) => {
    let tempData = [...billData];
    tempData.splice(id, 1);
    setBillData([...tempData]);
  };

  const setDiscountData = (name, value) => {
    discountObj[name] = value;
    setDiscountObj({ ...discountObj });
  };

  const getBillDetails = (type) => {
    if (type === 'gst') {
      let gst = 0;
      billData.forEach((ele, i) => {
        gst += Number(ele.gst);
      });
      return gst;
    } else if (type === 'sub-total') {
      let subtotal = 0;
      billData.forEach((ele, i) => {
        subtotal += Number(getSubTotal(ele.quantity, ele.price));
      });
      return subtotal;
    } else if (type === 'total') {
      let total = 0;
      billData.forEach((ele, i) => {
        total += Number(getSubTotal(ele.quantity, ele.price, ele.gst));
      });
      return total;
    }
  }

  const getTotalPayable = () => {
    const type = discountObj['disName'];
    const value = Number(discountObj['disValue']);
    let total = 0;
    billData.forEach((ele, i) => {
      total += Number(getSubTotal(ele.quantity, ele.price, ele.gst));
    });
    if (type === '₹') {
      return total - parseInt(value);
    } else if (type === '%') {
      return total - ((total * value) / 100);
    } else {
      return total;
    }
  }

  return (
    <>
      <table border={1}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>GST</th>
            <th>Sub-total</th>
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
                  type="text"
                  placeholder="Item"
                  value={data.item}
                  onChange={(e) => setFormData(e.target.value, "item", i)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={Math.abs(data.quantity)}
                  onChange={(e) => setFormData(e.target.value, "quantity", i)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Price"
                  value={Math.abs(data.price)}
                  onChange={(e) => setFormData(e.target.value, "price", i)}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  placeholder="GST"
                  value={Math.abs(data.gst)}
                  onChange={(e) => setFormData(e.target.value, "gst", i)}
                ></input>
              </td>
              <td>
                {getSubTotal(data.quantity, data.price)}
              </td>
              <td>
                {getSubTotal(data.quantity, data.price, data.gst)}
              </td>
              <td>
                {billData.length > 1 && <button
                  onClick={(e) => {
                    deleteItem(i);
                  }}
                >
                  Delete
                </button>}
                {billData.length - 1 === i && <button onClick={() => { addItem() }}>Add</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <ul>
        <li>Sub-total : ₹{getBillDetails('sub-total')}</li>
        <li>GST : ₹{getBillDetails('gst')}</li>
        <li>Total : ₹{getBillDetails('total')}</li>
        <li>
          Discount :
          <select
            onChange={(e) => setDiscountData("disName", e.target.value)}
          >
            <option value="">Select Discount Type</option>
            <option value="₹">₹</option>
            <option value="%">%</option>
          </select>

          <input
            disabled={!discountObj['disName']}
            placeholder="Enter Discount Value"
            type={discountObj['disName'] === '%' ? 'range' : 'number'}
            value={discountObj?.disValue || ''}
            onChange={(e) => setDiscountData("disValue", e.target.value)}
          ></input> {discountObj['disName'] === '%' && discountObj['disValue']}
        </li>
        <li>RoundUp : {(getTotalPayable()).toFixed(2)}</li>
        <li>Total Payable: ₹{getTotalPayable()} </li>
      </ul>

      <button type="submit" onClick={() => { }}>submit</button>
    </>
  );
};

export default AddBill;