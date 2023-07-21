import { Card, Row, Table, Tag } from "antd";
import "./history.scss";
import { callGetHistoryOrder } from "../../services/api";
import { useEffect, useState } from "react";
import moment from "moment";
import ReactJson from "react-json-view";

const index = (props) => {
  const [dataHistory, setDataHistory] = useState();

  console.log("check data history ", dataHistory);

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
      <div className="history-table">
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

      <div className="history-list">
        {dataHistory &&
          dataHistory.length > 0 &&
          dataHistory.map((item) => {
            return (
              <div className="history-item" key={item._id}>
                <Card bordered={false}>
                  <div className="history-info">
                    <div className="history-img">
                      <img
                        src="https://picsum.photos/id/1018/1000/600/"
                        alt=""
                        className="img"
                      />
                    </div>
                    <p className="history-maintext">
                      {item.detail[0].bookName}
                    </p>
                    <p className="history-price">300k</p>
                    <div className="history-quantity">
                      x{item.detail[0].quantity}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        ;
      </div>
    </div>
  );
};

export default index;
