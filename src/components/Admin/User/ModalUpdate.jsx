import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  message,
  notification,
} from "antd";
import { useEffect } from "react";
import { callUpdateUser } from "../../../services/api";

const ModalUpdate = (props) => {
  const [form] = Form.useForm();

  const { isShowModalUpdate, setIsShowModalUpdate, fetchListUser, dataUpdate } =
    props;
  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;

    let res = await callUpdateUser(_id, fullName, phone);

    if (res?.data) {
      message.success("Updated user successfully!");
      setIsShowModalUpdate(false);
      await fetchListUser();
    } else {
      notification.error({
        title: "Có lỗi xảy ra!",
        message: res.message,
      });
    }
  };

  const handleCancel = () => {
    setIsShowModalUpdate(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.submit();
  };

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <>
      <Modal
        title="Modal update"
        open={isShowModalUpdate}
        onCancel={() => setIsShowModalUpdate(false)}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        forceRender
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Cập nhật
          </Button>,
        ]}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          //   initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Please input your fullName!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
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

export default ModalUpdate;
