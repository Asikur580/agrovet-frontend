import { useContext, useEffect, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  Page,
  Text,
  Font,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";

//=>>> Register font
import BlippoBlack from "../../assets/fonts/tt0511m.ttf";
import DMSansRegular from "../../assets/fonts/DM_Sans/DMSans-Regular.ttf";
import DMSansSemiBold from "../../assets/fonts/DM_Sans/DMSans-SemiBold.ttf";
Font.register({ family: "BlippoBlack", src: BlippoBlack });
Font.register({ family: "DMSansRegular", src: DMSansRegular });
Font.register({ family: "DMSansSemiBold", src: DMSansSemiBold });

//=>>> Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "DMSansSemiBold",
    color: "#000",
    backgroundColor: "#fff",
    padding: "100px",
  },

  //=>>> Header start
  compName: {
    fontFamily: "BlippoBlack",
    fontSize: "1.5rem",
    textAlign: "center",
    letterSpacing: "-3px",
  },
  address: {
    fontSize: "0.65rem",
    textAlign: "center",
    marginTop: "10px",
  },
  invoiceTitle: {
    textAlign: "center",
    fontSize: "0.9rem",
    marginTop: "25px",
    marginBottom: "60px",
  },
  //=>>> Header end

  //=>>> Customer details start
  customerDetails: {
    fontSize: "0.68rem",
    flexDirection: "row",
    lineHeight: "1rem",
    marginBottom: "50px",
  },
  customerDetailsLeft: { width: "65%" },
  customerDetailsRight: { width: "35%" },
  customerDetailsVal: { fontFamily: "DMSansRegular" },
  //=>>> Customer details end

  //=>>> Table start
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    fontSize: "0.6rem",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: "10px",
    paddingHorizontal: "10px",
    backgroundColor: "#ebebeb",
  },
  tableCol: {
    fontSize: "0.6rem",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    width: "100%",
    paddingVertical: "10px",
    paddingHorizontal: "10px",
  },
  tableCellHeader: {
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    textAlign: "center",
  },
  tableSlNo: { width: "60%" },
  tableProdName: { width: "170%" },
  tableNetAmmount: { width: "130%" },
  tableQty: { width: "45%" },
  tableBonusQty: { width: "110%" },
  //=>>> Table end

  //=>>> Total section start
  totalSection: {
    marginTop: "80px",
    marginBottom: "40px",
    flexDirection: "row",
  },
  totalSectionLeft: { width: "65%" },
  totalSectionRight: { width: "35%" },
  totalSectionRow: {
    flexDirection: "row",
    marginBottom: 5,
    fontSize: "0.65rem",
  },
  totalSectionLabel: { width: "500px" },
  totalSectionValBox: { flexDirection: "row" },
  totalSectionColon: { marginRight: "30px" },
  totalSectionValue: {},
  //=>>> Total section end

  //=>>> Footer start
  footer: { marginTop: "auto" },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    fontSize: "0.7rem",
  },
  note: { fontSize: "0.5rem", textAlign: "center", marginTop: "80px" },
  //=>>> Footer end
});

const InvoicePdf = ({ setLoader }) => {
  const { id } = useParams();
  const { headers } = useContext(AuthContext);

  const [apiData, setApiData] = useState([]);
  const [custData, setCustData] = useState({});
  const [empData, setEmpData] = useState({});
  const [dateOfInvoice, setDateOfInvoice] = useState();
  const [salesCount, setSalesCount] = useState();

  const GetApiData = async () => {
    setLoader(true);
    await ApiConfig.get(`/invoiceShow/${id}`, { headers })
      .then((response) => {
        if (response.data.status == true) {
          setApiData(response.data.data);
          setCustData(response.data.data.customer);
          setEmpData(response.data.data.employee);
          localStorage.setItem(
            "invoice-data",
            JSON.stringify(response.data.data)
          );
          setDateOfInvoice(
            new Date(response.data.data.created_at).toISOString().split("T")[0]
          );
          setSalesCount(response.data.data.sale_date);
          setLoader(false);
          // console.log(response.data.data);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };
  useEffect(() => {
    GetApiData();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`Invoice-${custData.customer_name || "Invoice"}`}</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <Document title={`Invoice-${custData.customer_name || "Invoice"}`}>
          <Page size={[9.5 * 72, 11 * 72]} dpi={300} style={styles.page}>
            {/*=>>> Header start */}
            <View fixed>
              <Text style={styles.compName}>RADIANT AGROVET</Text>
              <Text style={styles.address}>
                House # 37, Road # 01, Dhaka Uddyan, Mohammadpur, Dhaka-1207
              </Text>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
            </View>
            {/*=>>> Header end */}

            {/*=>>> Customer details start */}
            <View style={styles.customerDetails}>
              <View style={styles.customerDetailsLeft}>
                  <Text>
                  Customer Id:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {custData.customer_id}
                  </Text>
                </Text>
                <Text style={styles.cName}>
                  Customer Name:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {custData.customer_name}
                  </Text>
                </Text>              
                <Text>
                  Proprietor Name:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {custData.proprietor_name}
                  </Text>
                </Text>
                <Text>
                  Address:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {custData.address}
                  </Text>
                </Text>
                <Text>
                  Cell:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {custData.phone}
                  </Text>
                </Text>
                 <Text>
                  Offer:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {apiData.offer}
                  </Text>
                </Text>
              </View>
              <View style={styles.customerDetailsRight}>
                <Text>
                  Invoice Id:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {apiData.invoiceId}
                  </Text>
                </Text>
                <Text>
                  Date of Invoice:{" "}
                  <Text style={styles.customerDetailsVal}>{dateOfInvoice}</Text>
                </Text>
                <Text>
                  Sales Count:{" "}
                  <Text style={styles.customerDetailsVal}>{salesCount}</Text>
                </Text>
                <Text>
                  Sales Ref:{" "}
                  <Text style={styles.customerDetailsVal}>{empData.name}</Text>
                </Text>
                <Text>
                  Territory:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {empData.territory}
                  </Text>
                </Text>
                <Text>
                  Mode of Sales:{" "}
                  <Text style={styles.customerDetailsVal}>
                    {apiData.sale_type}
                  </Text>
                </Text>
              </View>
            </View>
            {/*=>>> Customer details end */}

            {/*=>>> Table start */}
            <View style={styles.table}>
              {/* Table header */}
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, styles.tableSlNo]}>
                  <Text style={styles.tableCellHeader}>Sl No</Text>
                </View>
                <View style={[styles.tableColHeader, styles.tableProdName]}>
                  <Text style={styles.tableCellHeader}>Product Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Pack Size</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>TP/Flat</Text>
                </View>
                <View style={[styles.tableColHeader, styles.tableQty]}>
                  <Text style={styles.tableCellHeader}>Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Due qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Total TP</Text>
                </View>
                <View style={[styles.tableColHeader, styles.tableBonusQty]}>
                  <Text style={styles.tableCellHeader}>Bonus Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Net Qty</Text>
                </View>
                <View style={[styles.tableColHeader, styles.tableNetAmmount]}>
                  <Text style={styles.tableCellHeader}>Net Amount</Text>
                </View>
              </View>

              {/*=>>> Table row data */}
              {Array.isArray(apiData.products) &&
                apiData.products.map((item, index) => {
                  return (
                    <View style={styles.tableRow} key={index}>
                      <View style={[styles.tableCol, styles.tableSlNo]}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                      </View>
                      <View style={[styles.tableCol, styles.tableProdName]}>
                        <Text style={styles.tableCell}>
                          {item.product.name}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {item.product.pack_size}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {item.unit_price}/-
                          <Text style={{ fontSize: "0.5rem" }}>
                            ({item.price_type})
                          </Text>
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.tableQty]}>
                        <Text style={styles.tableCell}>{item.quantity}</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {item.due_quantity}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {item.quantity * item.unit_price}/-
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.tableBonusQty]}>
                        <Text style={styles.tableCell}>{item.bonus_qty}</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {item.quantity + item.bonus_qty}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.tableNetAmmount]}>
                        <Text style={styles.tableCell}>
                          {item.unit_price * item.quantity}/-
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
            {/*=>>> Table end */}

            {/* //=>>> Total section start */}
            <View style={styles.totalSection}>
              <View style={styles.totalSectionLeft}></View>
              <View style={styles.totalSectionRight}>
                <View style={styles.totalSectionRow}>
                  <Text style={styles.totalSectionLabel}>Total</Text>
                  <View style={styles.totalSectionValBox}>
                    <Text style={styles.totalSectionColon}>:</Text>
                    <Text style={styles.totalSectionValue}>
                      {Number(apiData.total_price).toFixed(2)}/-
                    </Text>
                  </View>
                </View>
                <View style={styles.totalSectionRow}>
                  <Text style={styles.totalSectionLabel}>
                    Discount -{" "}
                    {Number(
                      1 /
                        (Number(apiData.total_price).toFixed(2) /
                          (Number(apiData.discount).toFixed(2) * 100))
                    ).toFixed(0)}
                    %
                  </Text>
                  <View style={styles.totalSectionValBox}>
                    <Text style={styles.totalSectionColon}>:</Text>{" "}
                    <Text style={styles.totalSectionValue}>
                      {Number(apiData.discount).toFixed(2)}/-
                    </Text>
                  </View>
                </View>
                <View style={styles.totalSectionRow}>
                  <Text style={styles.totalSectionLabel}>Less</Text>
                  <View style={styles.totalSectionValBox}>
                    <Text style={styles.totalSectionColon}>:</Text>{" "}
                    <Text style={styles.totalSectionValue}>
                      {Number(apiData.less).toFixed(2)}/-
                    </Text>
                  </View>
                </View>
                <View style={styles.totalSectionRow}>
                  <Text style={styles.totalSectionLabel}>
                    Net Payable Amount
                  </Text>
                  <View style={styles.totalSectionValBox}>
                    <Text style={styles.totalSectionColon}>:</Text>
                    <Text style={styles.totalSectionValue}>
                      {(
                        Number(apiData.total_price).toFixed(2) -
                        Number(apiData.discount).toFixed(2) -
                        Number(apiData.less).toFixed(2)
                      ).toFixed(2)}
                      /-
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* //=>>> Total section end */}

            {/* //=>>> Footer start */}
            <View style={styles.footer} fixed>
              <View style={styles.signatureSection}>
                <Text style={styles.signature}>Prepared By</Text>
                <Text style={styles.signature}>Delivered By</Text>
                <Text style={styles.signature}>Received By</Text>
              </View>

              <Text style={styles.note}>
                PRODUCT SOLD ARE NOT RETURNABLE OR RETRUDABLE
              </Text>
            </View>
            {/* //=>>> Footer end */}
          </Page>
        </Document>
      </PDFViewer>
    </HelmetProvider>
  );
};

export default InvoicePdf;
