import { useState } from "react";
import Table from "react-bootstrap/Table";

const TableCom = () => {
    // const [no,setNo] = useState(1);
    const [price, setPrice] = useState(0);
    const [gst, setGST] = useState(0);
    const [quantity, setQuantity] = useState(0);
    // const[subtotal, setSubTotal] = useState('0');

    // useEffect(()=>{
    //     const asubtotal = () => {
    //         setSubTotal(price * quantity)
    //     }
    //     asubtotal();
    // },[]);

    const [items, setItems] = useState([]);
    const addItem = () => {
        setItems([...items, (quantity, price, gst)]);
        // setPrice();
        // setGST();
        // setQuantity();
    };

    const deleteItem = (ind) => {
        const updateitems = items.filter((ele, id) => {
            return id !== ind;
        });
        setItems(updateitems);
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>GST</th>
                    <th>Sub-total</th>
                    <th>Total</th>
                </tr>
            </thead>
            {console.log(items)}
            <tbody>
                {items.map((ele, id) => {
                    // const {quantity,price,gst} = elem;
                    return (
                        <>
                            <tr key={id}>
                                <td>{id + 1}</td>
                                <td>
                                    <input type="text"></input>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={ele.quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    ></input>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={ele.price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    ></input>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={ele.gst}
                                        onChange={(e) => setGST(e.target.value)}
                                    ></input>
                                </td>
                                {console.log(ele.price, ele.quantity)}
                                <td>{ele.price * ele.quantity}</td>
                                <td>
                                    {ele.price * ele.quantity +
                                        (ele.price * ele.quantity * ele.gst) / 100}
                                </td>
                                <button onClick={() => deleteItem(id)}>Delete</button>
                            </tr>
                        </>
                    );
                })}
            </tbody>
            
            <button onClick={addItem}>Add</button>
        </Table>
    );
};

export default TableCom;

// if (!(quantity,price,gst)) {

// } else {
//     setItems([...items, (quantity,price,gst)]);
//     setPrice(price);
//     setGST(gst);
//     setQuantity(quantity);
// }
// return ev.prevent();

// }
