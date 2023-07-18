import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  message,
  notification,
} from "antd";
import InputSearch from "./InputSearch";
import { useEffect, useState } from "react";
import { callDeleteUser, callFetchListUser } from "../../../services/api";
import {
  ExportOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ModalAddNew from "./ModalAddNew";
import DrawerDetailUser from "./DrawerDetailUser";
import UserImport from "./data/UserImport";
import * as XLSX from "xlsx";
import ModalUpdate from "./ModalUpdate";
import moment from "moment/moment";

const TableUser = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  let [listUser, setListUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [detailUser, setDetailUser] = useState("");
  const [dataUpdate, setDataUpdate] = useState("");
  const [isShowModalAddNew, SetIsShowModalAddNew] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);

  listUser = listUser.map((item) => {
    return {
      ...item,
      updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    };
  });

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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: {
        compare: (a, b) => a.english - b.english,
      },
    },

    {
      title: "Action",
      render: function (text, record, index) {
        return (
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
        );
      },
    },
  ];

  const handleDeleteUser = async (_id) => {
    let res = await callDeleteUser(_id);

    if (res?.data) {
      message.success("Xóa người dùng thành công!");
      await fetchListUser();
    } else {
      notification.error({
        title: "Có lỗi xảy ra!",
        message: res.message,
      });
    }
  };

  const handleEditUser = (record) => {
    setIsShowModalUpdate(true);
    setDataUpdate(record);
  };

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

  const handeExport = () => {
    const workbook = XLSX.utils.book_new();
    let dataMatrix = listUser.map((user) => [
      user._id,
      user.fullName,
      user.email,
      user.phone,
      user.updatedAt,
      user.createdAt,
    ]);

    dataMatrix.unshift([
      "ID",
      "Tên hiển thị",
      "Email",
      "Số điện thoại",
      "Ngày cập nhật",
      "Ngày tạo",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(dataMatrix);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "myfile.xlsx");
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
            <Button
              type="primary"
              style={{ margin: "0 4px" }}
              onClick={() => handeExport()}
            >
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
              onClick={() => setSearchFilter("")}
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
      {/* // drawer detail user */}
      <DrawerDetailUser
        onClose={onClose}
        isOpenDrawer={isOpenDrawer}
        handleViewDetail={handleViewDetail}
        detailUser={detailUser}
      />
      {/* // Modal add new user */}
      <ModalAddNew
        isShowModalAddNew={isShowModalAddNew}
        SetIsShowModalAddNew={SetIsShowModalAddNew}
        fetchListUser={fetchListUser}
      />
      {/* // User Import */}
      <UserImport
        isModalImportOpen={isModalImportOpen}
        setIsModalImportOpen={setIsModalImportOpen}
      />

      {/* Modal Update  */}
      <ModalUpdate
        isShowModalUpdate={isShowModalUpdate}
        setIsShowModalUpdate={setIsShowModalUpdate}
        fetchListUser={fetchListUser}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
