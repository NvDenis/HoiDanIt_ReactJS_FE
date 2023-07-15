import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { callCreateOrder } from "../../services/api";
import { doResetCartsAction } from "../../redux/order/orderSlice";

const OrderPreview = (props) => {
  const { totalCost, carts, setCurrentPage } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  const onFinish = async (values) => {
    const { username, phone, address } = values;

    console.log("check values", values);

    let detail = [];
    carts.map((item) => {
      detail.push({
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      });
    });

    const res = await callCreateOrder(
      username,
      address,
      phone,
      totalCost,
      detail
    );

    if (res && res.data) {
      message.success("Đặt hàng thành công!");
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: res.message,
      });
    }

    dispatch(doResetCartsAction());
    setCurrentPage(3);
  };

  return (
    <>
      <div className="order-right">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          initialValues={{ username: user.fullName, phone: user.phone }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên người nhận"
            name="username"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Hãy nhập tên người nhận!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Hãy nhập địa chỉ!" }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item
            label="Hình thức thanh toán"
            name="payment"
            labelCol={{ span: 24 }}
          >
            <Radio defaultChecked>Nhận hàng khi thanh toán</Radio>
          </Form.Item>

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
          <Form.Item>
            <Button htmlType="submit" className="btnBuyItem">
              Đặt hàng({carts.length})
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default OrderPreview;
