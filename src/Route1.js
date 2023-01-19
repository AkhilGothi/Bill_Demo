import React, {useContext} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddBill from "./example";
import EditBill from "./EditBill";
// import Look from "./Look";
import PreBill from "./PreBill";
import DataContext from "./DataContext";
// import Look from "./Look";
// import PreBillDemo from "./PriBillDemo";
const Route1 = () => {
  const value = useContext(DataContext);
  console.log(value)
  return (
    <>
      <BrowserRouter>
        {/* <Look /> */}
        <Routes>
          <Route path="/add" element={<AddBill />}></Route>
          <Route path="/" element={<PreBill />}></Route>
          <Route path="/edit" element={<EditBill />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Route1;
