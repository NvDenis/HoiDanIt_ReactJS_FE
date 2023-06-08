import { Button, Col, Input } from "antd";
import { useState } from "react";

const InputSearch = ({ handleSearch }) => {
  const [mainText, setMainText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchInput = () => {
    let params = ``;
    if (mainText) {
      params += `&mainText=/${mainText}/i`;
    }
    if (author) {
      params += `&author=/${author}/i`;
    }
    if (category) {
      params += `&category=/${category}/i`;
    }

    if (params) {
      handleSearch(params);
    }
  };

  const handleSearchClear = () => {
    setMainText("");
    setAuthor("");
    setCategory("");
  };

  return (
    <>
      <div style={{ padding: "24px", background: "#eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Tên sách</p>
            <Input
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
            />
          </Col>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Tác giả</p>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </Col>
          <Col span={7}>
            <p style={{ paddingBottom: "15px" }}>Thể loại</p>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
