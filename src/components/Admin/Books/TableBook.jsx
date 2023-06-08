import { Button, Col, Popconfirm, Row, Table } from "antd";
import InputSearch from "./InputSearch";
import {
  ExportOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { callGetListBook } from "../../../services/api";
import moment from "moment";

const TableBook = () => {
  let [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [sortField, setSortField] = useState("&sort=-updateAt");
  const [sortField, setSortField] = useState("");
  const [dataFilter, setDataFilter] = useState("");
  listBook = listBook.map((item) => {
    return {
      ...item,
      key: item._id,
      updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    };
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => <a>{text}</a>,
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
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
    {
      title: "Action",
      width: 150,
      render: (text, record) => (
        <>
          <Popconfirm
            title="Xác nhận xóa người dùng"
            placement="leftTop"
            description="Bạn có chắc chắn muốn xóa user này"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
          &nbsp; &nbsp; &nbsp;
          <EditOutlined
            style={{ color: "#facf14", cursor: "pointer" }}
            onClick={() => handleEditUser(record)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    getListBook();
  }, [current, sortField, dataFilter]);

  const getListBook = async () => {
    setIsLoading(true);
    let query = "";
    query += `current=${current}&pageSize=${pageSize}`;

    if (sortField) {
      query += sortField;
    }

    if (dataFilter) {
      query += dataFilter;
    }

    let res = await callGetListBook(query);

    if (res?.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

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

  const headerTable = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>List books</span>
          <span style={{ display: "flex", gap: "8px" }}>
            <Button type="primary">
              <ExportOutlined />
              Export
            </Button>
            <Button type="primary">
              <CloudUploadOutlined />
              Import
            </Button>
            <Button type="primary">
              <PlusOutlined />
              Thêm mới
            </Button>
            <Button type="ghost" onClick={() => setDataFilter("")}>
              <ReloadOutlined />
            </Button>
          </span>
        </div>
      </>
    );
  };

  const handleSearch = (dataFilter) => {
    setDataFilter(dataFilter);
  };
  return (
    <>
      <Row style={{ padding: "24px" }}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24} style={{ paddingTop: "24px" }}>
          <Table
            isLoading={isLoading}
            columns={columns}
            dataSource={listBook}
            onChange={onChange}
            title={headerTable}
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
        </Col>
      </Row>
    </>
  );
};

export default TableBook;
