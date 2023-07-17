import { Avatar, Col, Row, message, notification } from "antd";
import { Button, Checkbox, Form, Input, Upload } from "antd";
import {
  AntDesignOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { callUpdateAvatar, callUpdateUserInfo } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { doUpdateUserInfo } from "../../redux/account/accountSlice";

const UserInfo = (props) => {
  const dispatch = useDispatch();
  const [newAvatar, setNewAvatar] = useState();

  const user = useSelector((state) => state.account.user);

  const onFinish = async (values) => {
    const {  phone, fullName } = values;

    const res = await callUpdateUserInfo(user.id, fullName, phone, newAvatar);

    if (res && res.data) {
      localStorage.removeItem("access_token");
      dispatch(doUpdateUserInfo({ fullName, phone, newAvatar }));
      message.success("Cập nhật thông tin thành công!");
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  const handleUpdateAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUpdateAvatar(file);
    if (res && res.data) {
      setNewAvatar(res.data.fileUploaded);

      onSuccess("ok");
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  const propsUpload = {
    customRequest: handleUpdateAvatar,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Avatar
                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                icon={<AntDesignOutlined />}
                src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                  newAvatar ? newAvatar : user.avatar
                }`}
              />
            </Col>
            <Col span={24}>
              <Upload
                {...propsUpload}
                multiple={false}
                maxCount={1}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload avatar</Button>
              </Upload>
            </Col>
          </Row>
        </Col>

        <Col sm={24} md={12}>
          <Form
            name="basic"
            initialValues={{
              email: user.email,
              fullName: user.fullName,
              phone: user.phone,
            }}
            onFinish={onFinish}
            autoComplete="off"
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
              label="Tên hiển thị"
              name="fullName"
              labelCol={{ span: 24 }} //whole column
              rules={[
                { required: true, message: "Please input your fullName!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              labelCol={{ span: 24 }} //whole column
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UserInfo;
