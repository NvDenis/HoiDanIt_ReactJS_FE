import { Col, Row, Skeleton } from "antd";
import React from "react";

const BookLoader = (props) => {
  return (
    <Row gutter={[20, 20]}>
      <Col md={10} sm={0} xs={0}>
        <Skeleton.Input
          active={true}
          block={true}
          style={{ height: 350, width: "100%" }}
        />
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <Skeleton.Image active={true} />
          <Skeleton.Image active={true} />
          <Skeleton.Image active={true} />
        </div>
      </Col>
      <Col md={14} sm={24} xs={24}>
        <Skeleton active={true} paragraph={{ rows: 3 }} />
        <br /> <br />
        <Skeleton active={true} paragraph={{ rows: 2}} />
        <br /> <br />

        <div style={{display: 'flex', gap: 20}}>
            <Skeleton.Button active={true} style={{width: 100}} />
            <Skeleton.Button active={true} style={{width: 100}} />
        </div>
      </Col>
    </Row>
  );
};

export default BookLoader;
