import { Badge, Button, Descriptions, Drawer, Space } from "antd";
import moment from "moment/moment";

const DrawerDetailUser = (props) => {
  const { onClose, isOpenDrawer, detailUser } = props;
                                      
  return (
    <>
      <Drawer
        title="Detail user"
        width={"50vw"}
        placement="right"
        onClose={onClose}
        open={isOpenDrawer}
        size={"large"}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <Descriptions title="User Info" layout="vertical" bordered column={2}>
          <Descriptions.Item label="Id">{detailUser?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {detailUser?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {detailUser?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {detailUser?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={detailUser?.role} />
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {moment(detailUser?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(detailUser?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default DrawerDetailUser;
