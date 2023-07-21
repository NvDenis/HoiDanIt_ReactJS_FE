import { DeleteOutlined, SmileOutlined } from "@ant-design/icons";
import "./order.scss";
import {
  Button,
  Col,
  Divider,
  Empty,
  Input,
  InputNumber,
  Result,
  Row,
  Steps,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  doDeleteBookAction,
  doUpdateBookAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import OrderPreview from "../../components/Order/OrderPreview";
import { useNavigate } from "react-router-dom";

const index = (props) => {
  const carts = useSelector((state) => state.order.carts);
  const dispatch = useDispatch();
  const [totalCost, setTotalCost] = useState(() => {
    let total = 0;
    carts.forEach((item) => {
      total += item.quantity * item.detail.price;
    });
    return total;
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const handeChangeQuantity = (_id, quantity) => {
    let itemIndex = carts.findIndex((c) => c._id === _id);

    if (!isNaN(quantity) && quantity <= carts[itemIndex].detail.quantity) {
      dispatch(doUpdateBookAction({ _id, quantity }));
      setTotalCost(calculateTotalCost());
    }
  };

  const handleDeleteBook = (_id) => {
    dispatch(doDeleteBookAction({ _id }));
    setTotalCost(calculateTotalCost());
  };

  const calculateTotalCost = () => {
    let total = 0;
    carts.forEach((item) => {
      total += item.quantity * item.detail.price;
    });
    return total;
  };

  useEffect(() => {
    setTotalCost(calculateTotalCost());
  }, [carts]);

  const handleViewHistory = () => {
    navigate("/history");
  };

  return (
    <div className="order-container">
      <Row className="order-top">
        <Steps
          size="small"
          current={currentPage}
          items={[
            {
              title: "Đơn hàng",
            },
            {
              title: "Đặt hàng",
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </Row>

      {carts.length === 0 && currentPage === 1 ? (
        <Empty />
      ) : (
        <div className="order-body">
          {currentPage !== 3 && (
            <div className="order-left">
              {carts &&
                carts.map((item) => {
                  return (
                    <div className="orderLeft-item" key={item._id}>
                      <div className="order-img">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.detail.thumbnail}`}
                          alt=""
                          className="img"
                        />
                      </div>

                      <div className="order-info">
                        <div className="order-maintext">
                          {item.detail.mainText}
                        </div>

                        <p className="order-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.detail.price)}
                        </p>

                        <InputNumber
                          defaultValue={item.quantity}
                          className="order-quantity"
                          onChange={(value) =>
                            handeChangeQuantity(item._id, value)
                          }
                          min={1}
                          max={item.detail.quantity}
                        />

                        <div className="order-total">
                          Tổng:
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.quantity * item.detail.price)}
                          </span>
                        </div>
                      </div>

                      <div
                        className="order-delete"
                        onClick={() => handleDeleteBook(item._id)}
                      >
                        <DeleteOutlined
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {currentPage === 1 && (
            <div className="order-right">
              <div className="provisional">
                <span>Tạm tính: </span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalCost)}
                </span>
              </div>

              <Divider />
              <div className="total-cost">
                <span>Tổng tiền: </span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalCost)}
                </span>
              </div>
              <Divider />

              <button onClick={() => setCurrentPage(2)} className="btnBuyItem">
                Mua hàng({carts.length})
              </button>
            </div>
          )}

          {currentPage === 2 && (
            <OrderPreview
              totalCost={totalCost}
              carts={carts}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 3 && (
            <Result
              style={{ width: "100%" }}
              icon={<SmileOutlined />}
              title="Đơn hàng đã được đặt thành công!"
              extra={
                <Button onClick={handleViewHistory} type="primary">
                  Xem lịch sử
                </Button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default index;
