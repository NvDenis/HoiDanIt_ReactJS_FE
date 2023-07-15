import { Modal, Tabs } from "antd";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";

const ManageAccount = (props) => {
  const { isShowModalManageAccount, setIsShowModalManageAccount } = props;

  const items = [
    {
      key: "1",
      label: `Cập nhật thông tin`,
      children: <UserInfo />,
    },
    {
      key: "2",
      label: `Đổi mật khẩu`,
      children: <ChangePassword />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Modal
      open={isShowModalManageAccount}
      title="Quản lý tài khoản"
      width={"50vw"}
      footer={false}
      onCancel={() => setIsShowModalManageAccount(false)}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange}  />;
    </Modal>
  );
};

export default ManageAccount;
