import { Button, Col, Row, Table } from "antd";
import InputSearch from "./InputSearch";
import { useEffect, useState } from "react";
import { callFetchListUser } from "../../../services/api";
import {
  ExportOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ModalAddNew from "./ModalAddNew";
import DrawerDetailUser from "./DrawerDetailUser";
import UserImport from "./UserImport";

const TableUser = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [listUser, setListUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [detailUser, setDetailUser] = useState("");
  const [isShowModalAddNew, SetIsShowModalAddNew] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);

  useEffect(() => {
    fetchListUser();
  }, [current, pageSize, searchFilter, sortField]);

  const fetchListUser = async () => {
    setIsLoading(true);

    let query = `current=${current}&pageSize=${pageSize}`;

    if (searchFilter) {
      query += searchFilter;
    }

    if (sortField) {
      query += sortField;
    }

    let res = await callFetchListUser(query);

    // console.log('check res', res);

    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => (
        <a onClick={() => handleViewDetail(text, record)}>{text}</a>
      ),
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.math - b.math,
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: {
        compare: (a, b) => a.english - b.english,
      },
    },
    {
      title: "Action",
      render: function (text, record, index) {
        return (
          <>
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (sorter && sorter.field) {
      let q =
        sorter.order === "descend"
          ? `&sort=-${sorter.field}`
          : `&sort=${sorter.field}`;
      setSortField(q);
    }

    console.log("check sorter >>>", sorter);
  };

  const handleSearch = (query) => {
    setSearchFilter(query);
  };

  const onClose = () => {
    setIsOpenDrawer(false);
  };

  const handleViewDetail = (text, record) => {
    setIsOpenDrawer(true);
    setDetailUser(record);
  };

  const titleTable = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Table List Users</span>
          <div>
            <Button type="primary" style={{ margin: "0 4px" }}>
              <ExportOutlined />
              Export
            </Button>

            <Button
              type="primary"
              style={{ margin: "0 4px" }}
              onClick={() => setIsModalImportOpen(true)}
            >
              <CloudUploadOutlined />
              Import
            </Button>

            <Button
              type="primary"
              style={{ margin: "0 4px" }}
              onClick={() => SetIsShowModalAddNew(true)}
            >
              <PlusOutlined />
              Thêm mới
            </Button>

            <Button
              type="ghost"
              onClick={() => fetchListUser()}
              style={{ margin: "0 4px" }}
            >
              <ReloadOutlined />
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Row style={{ padding: "24px" }}>
        <Col span={24} className="table-user">
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24} className="table-user" style={{ paddingTop: "24px" }}>
          <Table
            title={titleTable}
            loading={isLoading}
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total, range) => {
                return (
                  <>
                    {range[0]} - {range[1]} trên {total} rows
                  </>
                );
              },
            }}
          />
          ;
        </Col>
      </Row>
      // drawer detail user
      <DrawerDetailUser
        onClose={onClose}
        isOpenDrawer={isOpenDrawer}
        handleViewDetail={handleViewDetail}
        detailUser={detailUser}
      />
      // Modal add new user
      <ModalAddNew
        isShowModalAddNew={isShowModalAddNew}
        SetIsShowModalAddNew={SetIsShowModalAddNew}
        fetchListUser={fetchListUser}
      />
      // User Import
      <UserImport
        isModalImportOpen={isModalImportOpen}
        setIsModalImportOpen={setIsModalImportOpen}
      />
    </>
  );
};

export default TableUser;
