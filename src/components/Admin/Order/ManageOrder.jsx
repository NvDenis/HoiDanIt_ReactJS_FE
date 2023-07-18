import { Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { callGetListOrder } from "../../../services/api";
import moment from "moment";

const ManageOrder = (props) => {
  const isLoading = useSelector((state) => state.account.isLoading);
  const [listOrder, setListOrder] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchListOrder();
  }, [current, pageSize]);

  const fetchListOrder = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;

    let res = await callGetListOrder(query);

    if (res && res.data) {
      let listTemp = res.data.result;
      listTemp = listTemp.map((item) => {
        return {
          ...item,
          updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
          totalPrice: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.totalPrice),
        };
      });
      setListOrder(listTemp);
      setTotal(res.data.meta.total);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: "Giá",
      dataIndex: "totalPrice",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },

    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
  ];

  const onChange = async (pagination, filters, sorter, extra) => {
    // const { current, pageSize } = pagination;
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    // console.log("check sort ", sorter);
    if (sorter?.field) {
      let query =
        sorter.order === "ascend"
          ? `&sort=${sorter.field}`
          : `&sort=-${sorter.field}`;

      setSortField(query);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Table
        title={() => <span>List order</span>}
        isLoading={isLoading}
        columns={columns}
        dataSource={listOrder}
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
          showTotal: (total, range) => {
            return (
              <>
                {range[0]} - {range[1]} trên {total} rows
              </>
            );
          },
        }}
      />
    </div>
  );
};

export default ManageOrder;
