import React, { useEffect, useState } from "react";
import "./example.css";

const Users = () => {
    const [list, setList] = useState([]);
    const [singleUser, setSingleUser] = useState({});

    useEffect(() => {
        const users = [
            {
                firstName: "Demo",
                age: 20,
                email: "demo@gmail.com",
            },
            {
                firstName: "john",
                age: 22,
                email: "john@gmail.com",
            },
            {
                firstName: "doe",
                age: 25,
                email: "doe@gmail.com",
            },
        ];
        setList(users);
    }, []);

    const setData = (value, name) => {
        singleUser[name] = value;
        setSingleUser(singleUser);
    }

    const addUser = () => {
        list.push(singleUser);
        setList(list);
        setSingleUser({});
    };

    const editAction = (ele) => {
        setSingleUser(ele);
    }

    const deleteAction = (id) => {
        const tempob = [...list];
        tempob.splice(id,1);
        setList(tempob);
    }



    return (
        <div>
            <h1>users</h1>
            <h4 className="action">Add user</h4>
            <div>
                <div>
                    Name:<input type="text" value={singleUser.firstName} onChange={(e) => setData(e.target.value, "firstName")}></input>
                </div>
                <div>
                    Age:<input type="text" value={singleUser.age} onChange={(e) => setData(e.target.value, "age")}></input>
                </div>
                <div>
                    Email:<input type="text" value={singleUser.email} onChange={(e) => setData(e.target.value, "email")}></input>
                </div>
                <div>
                    <button onClick={() => addUser()}>Add</button>
                </div>
            </div>
            <div>
                {list.map((ele, i) => (
                    <div className="record" key={i}>
                        <span>{ele.firstName}</span>
                        <span>{ele.age}</span>
                        <span>{ele.email}</span>
                        <span>
                            <span className="action" onClick={()=> deleteAction(i)}>Delete</span>
                            <span className="action" onClick={() => editAction(ele)}>Edit</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;
