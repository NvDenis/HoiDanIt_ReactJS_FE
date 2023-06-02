import {
  Modal,
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import { callCreateUser } from "../../../services/api";

const ModalAddNew = (props) => {
  const { isShowModalAddNew, SetIsShowModalAddNew, fetchListUser } = props;

  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    SetIsShowModalAddNew(false);
  };

  const onFinish = async (values) => {
    const { fullName, password, email, phonenum } = values;

    const res = await callCreateUser(fullName, password, email, phonenum);

    if (res?.statusCode === 201) {
      form.resetFields();
      message.success("Tạo mới người dùng thành công");
      SetIsShowModalAddNew(false);
      fetchListUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={isShowModalAddNew}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Tạo mới
          </Button>,
        ]}
      >
        <Divider />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Số điện thoại"
            name="phonenum"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddNew;
