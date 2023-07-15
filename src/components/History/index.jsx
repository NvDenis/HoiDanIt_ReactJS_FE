import { Row, Table, Tag } from "antd";
import "./history.scss";
import { callGetHistoryOrder } from "../../services/api";
import { useEffect, useState } from "react";
import moment from "moment";
import ReactJson from "react-json-view";

const index = (props) => {
  const [dataHistory, setDataHistory] = useState();

  console.log("check dataHistory ", dataHistory);
  const FecthHistoryOrder = async () => {
    const res = await callGetHistoryOrder();

    if (res && res.data) {
      setDataHistory(res.data);
    }
  };
  useEffect(() => {
    FecthHistoryOrder();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "ordinalNumber",
    },
    {
      title: "Thời gian",
      dataIndex: "updateAt",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
    },

    {
      title: "Chi tiết",
      dataIndex: "detail",
    },
  ];

  //   const data = [
  //     {
  //       key: "1",
  //       name: "John Brown",
  //       borrow: 10,
  //       repayment: 33,
  //     },
  //     {
  //       key: "2",
  //       name: "Jim Green",
  //       borrow: 100,
  //       repayment: 0,
  //     },
  //     {
  //       key: "3",
  //       name: "Joe Black",
  //       borrow: 10,
  //       repayment: 10,
  //     },
  //     {
  //       key: "4",
  //       name: "Jim Red",
  //       borrow: 75,
  //       repayment: 45,
  //     },
  //   ];

  const data = [];
  dataHistory?.map((item, index) => {
    data.push({
      key: item._id,
      ordinalNumber: index + 1,
      updateAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
      totalPrice: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(item.totalPrice),
      status: <Tag color="green">Thành công</Tag>,
      detail: (
        <ReactJson
          name="Chi tiết đơn mua"
          src={item.detail}
          shouldCollapse={() => true}
          enableClipboard={false}
        />
      ),
    });
  });

  return (
    <div className="history-container">
      <div style={{ padding: "10px 0" }}>Lịch sử đặt hàng</div>
      <Row>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          style={{ width: "100vw" }}
        />
      </Row>
    </div>
  );
};

export default index;
