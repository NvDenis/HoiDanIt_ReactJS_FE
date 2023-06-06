import { Button, Col, Input } from "antd";
import { useState } from "react";

const InputSearch = ({ handleSearch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSearchInput = () => {
    let params = ``;
    if (name) {
      params += `&fullName=/${name}/i`;
    }
    if (email) {
      params += `&email=/${email}/i`;
    }
    if (phone) {
      params += `&phone=/${phone}/i`;
    }

    if (params) {
      handleSearch(params);
    }
  };

  const handleSearchClear = () => {
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <>
      <div style={{ padding: "24px", background: "#eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Name</p>
            <Input
              placeholder="placeholder"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Email</p>
            <Input
              placeholder="placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Phone number</p>
            <Input
              placeholder="placeholder"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Col>
        </div>

        <div
          style={{ display: "flex", justifyContent: "end", paddingTop: "24px" }}
        >
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={handleSearchInput}
          >
            Search
          </Button>
          <Button onClick={handleSearchClear}>Clear</Button>
        </div>
      </div>
    </>
  );
};

export default InputSearch;
