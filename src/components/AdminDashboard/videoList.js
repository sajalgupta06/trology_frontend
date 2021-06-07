import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./styles.scss";
import { apiRequest } from "../../utils/Api";
const queryString = require('query-string');

const removeItem = (array, item) => {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a === item), 1);

  return newArray;
};

export const AdvancedPaginationTable = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // const [deleted, setDeleted] = useState([]);

  const fetchUsers = async (page, size = perPage) => {
    setLoading(true);

    // const response = await axios.get(
    //   `https://reqres.in/api/users?page=${page}&per_page=${size}&delay=1`
    // );

    let params = {
      page: page,
      size: size,
      astrologer_id: '48c6b5b0-0d98-4e0c-a3dc-29cb07ac1a7f',
      min_views: 0,
      max_views: 1000000,
      // start_date: '2020-12-12 0:0:0',
      // end_date: '2020-12-14 0:0:0',
      full_text: 'test',
    }
    const stringified = queryString.stringify(params);
    console.log("=======stringified", stringified)
    let result = await apiRequest("GET", `/admin/search_videos?${stringified}`)
    let response = JSON.parse(JSON.parse(result).data)
    console.log("++++++++++response", response)

    setData(response.data);
    setTotalRows(response.total);
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchUsers(1);
  // }, []);

  useImperativeHandle(
    ref,
    () => ({
      showAlert() {
        alert("Child Function Called")
      }
    }),
  )

  const handleDelete = useCallback(
    row => async () => {
      await axios.delete(`https://reqres.in/api/users/${row.id}`);
      const response = await axios.get(
        `https://reqres.in/api/users?page=${currentPage}&per_page=${perPage}`
      );

      setData(removeItem(response.data.data, row));
      setTotalRows(totalRows - 1);
    },
    [currentPage, perPage, totalRows]
  );

  const columns = useMemo(
    () => [
      {
        name: "Translated Title",
        selector: "title",
        // sortable: true
      },
      {
        name: "Title",
        selector: "title",
        // sortable: true
      },
      {
        name: "Astrolger",
        selector: "astro_name",
        // sortable: true
      },
      {
        // eslint-disable-next-line react/button-has-type
        cell: row => <button onClick={handleDelete(row)}>View</button>
      }
    ],
    [handleDelete]
  );

  const handlePageChange = page => {
    fetchUsers(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchUsers(page, newPerPage);
    setPerPage(newPerPage);
  };

  return (
    <DataTable
      // title="Users"
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationDefaultPage={currentPage}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
      selectableRows
      onSelectedRowsChange={({ selectedRows }) => console.log(selectedRows)}
    />
  );
});
