import { Card, Space, Statistic } from "antd";
import { callGetDashboard } from "../../services/api";
import { useEffect } from "react";
import { useState } from "react";
import CountUp from "react-countup";

const AdminPage = () => {
  const [countUser, setCounterUser] = useState();
  const [countOrder, setCounterOrder] = useState();

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    const res = await callGetDashboard();

    console.log("check res ", res.data);

    if (res && res?.data) {
      setCounterUser(res.data.countUser);
      setCounterOrder(res.data.countOrder);
    }
  };
  return (
    <Space direction="horizontal" size={16} style={{ padding: "10px" }}>
      <Card style={{ width: 600 }}>
        <Statistic
          title="Tổng người dùng"
          value={countUser}
          formatter={() => <CountUp end={countUser} />}
        />
      </Card>
      <Card style={{ width: 600 }}>
        <Statistic
          title="Tổng đơn hàng"
          value={countOrder}
          formatter={() => <CountUp end={countUser} />}
        />
      </Card>
    </Space>
  );
};

export default AdminPage;
