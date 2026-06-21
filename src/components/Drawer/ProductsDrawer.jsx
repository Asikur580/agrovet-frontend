import React, {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useState,
} from "react";
import { Button, Drawer, Radio, Space } from "antd";

//=>>> Utility
import { AuthContext } from "../../context/AuthContext";

//=>>> Components
const ProductsTable = lazy(() => import("../../pages/Products/ProductsTable"));

const ProductsDrawer = ({ slug, setLoader }) => {
  //=>>> States/functions for drawer
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("top");
  const [size, setSize] = useState(256);
  //=>>> States/functions for drawer

  //=>>> States/datas/functions for products table
  const { headers, userRole, userDesignationSlug } = useContext(AuthContext);
  const [reloadTable, setReloadTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  // Print section
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = useCallback(
    () => setToggleClearRows((prev) => !prev),
    []
  );

  // Debounced search input
  const handleSearch = useCallback((e) => {
    const value = e.target.value.toLowerCase();
    setSearchData(value);
  }, []);

  const AddProduct = () => {
    const existingData =
      JSON.parse(sessionStorage.getItem("OrdersApi/AddedData")) || [];
    existingData.push(...selectedRows);
    sessionStorage.setItem("OrdersApi/AddedData", JSON.stringify(existingData));
  };

  //=>>> States/datas/functions for products table

  return (
    <>
      <Space>
        {/* <Radio.Group
          value={placement}
          onChange={onChange}
          options={["top", "right", "bottom", "left"].map((pos) => ({
            label: pos,
            value: pos,
          }))}
        /> */}
        <Button type="primary" onClick={() => setOpen(true)}>
          {slug}
        </Button>
      </Space>

      <Drawer
        title={slug}
        placement={placement}
        onClose={() => setOpen(false)}
        open={open}
        key={placement}
        size={size}
        // resizable={{
        //   onResize: (newSize) => setSize(newSize),
        // }}
      >
        <div className="Products content animated fadeInDown">
          <div className="flex gap-5 mb-3">
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search product"
                value={searchData}
                onChange={handleSearch}
              />
            </div>
            <button
              type="button"
              className="button py-0 px-5"
              onClick={AddProduct}
            >
              Add <span className="text-[0.8rem]">({selectedRows.length})</span>
            </button>
          </div>

          <Suspense fallback={<p>Loading...</p>}>
            <ProductsTable
              headers={headers}
              userRole={userRole}
              userDesignationSlug={userDesignationSlug}
              relodeTable={reloadTable}
              setRelodeTable={setReloadTable}
              setLoader={setLoader}
              data={[]}
              categoryData={[]}
              brandData={[]}
              inputFields={[]}
              inputFieldsForStockIn={[]}
              inputFieldsForStockOut={[]}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              toggledClearRows={toggledClearRows}
              handleClearRows={handleClearRows}
              searchData={searchData}
              identifier="ProductsDrawer"
            />
          </Suspense>
        </div>
      </Drawer>
    </>
  );
};
export default ProductsDrawer;
