import {
  Button,
  Checkbox,
  Form,
  Input,
  Upload,
  message,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { callChangPassword } from "../../services/api";

const ChangePassword = (props) => {
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { currentPassword, newPassword, email } = values;

    const res = await callChangPassword(email, currentPassword, newPassword);

    if (res && res.data) {
      message.success("Đổi mật khẩu thành công!");
      form.setFieldValue("currentPassword", "");
      form.setFieldValue("newPassword", "");
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Form
        form={form}
        name="changePassword"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          email: user.email,
        }}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
          labelCol={{ span: 24 }} //whole column
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          labelCol={{ span: 24 }} //whole column
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          labelCol={{ span: 24 }} //whole column
          rules={[
            { required: true, message: "Please input your new Password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
