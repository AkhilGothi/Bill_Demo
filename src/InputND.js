import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function InputND() {
  const date = new Date().toLocaleDateString();
  const [cname, setCName] = useState('');
 
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text value={cname} onChange={(e)=>{setCName(e.target.value)}}>Name:</InputGroup.Text>
      <Form.Control aria-label="Name:" placeholder="Client's Name" required/> <br/><br/>
      <InputGroup.Text>Bill date:</InputGroup.Text>
      <Form.Control aria-label="Bill date:" defaultValue={date}  required/>
    </InputGroup> 

 );
}

export default InputND;