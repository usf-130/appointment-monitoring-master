"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AG_GRID_LOCALE_FA } from "../lib/agGridLocal";
import { LicenseManager } from "ag-grid-enterprise";
import ColumnChartJs from "../components/charts/ColumnChartJs";
import PieChartJs from "../components/charts/PieChartJs";
import dynamic from "next/dynamic";
import ImageCellRenderer from "../components/actions/ImageCellRenderer";
import VerticalBarChart from "../components/charts/VerticalBarChart";
import {
  doSignOut,
  getManagersForOrganManager,
  getSelectObjects,
} from "@/app/services/api/api";
import AuthHOC from "../components/hoc/AuthHOC";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const GeoShow = dynamic(() => import("../components/maps/GeoShow"), {
  ssr: false,
});
import DocShow from "../components/file-uploader/DocShow";
import styles from "./page.module.css";
import { Button, Col, Modal, Row, Container, Dropdown } from "react-bootstrap";
import GeoInfoAgGridButton from "../components/actions/GeoInfoAgGridButton";
import DocAgGridBtn from "../components/actions/DocAgGridBtn";
import AddManagerAsOrganManager from "../components/add-manager/AddManagerAsOrganManager";
import EditManagerGridBtn from "../components/actions/EditManagerGridBtn";
import { CSSTransition } from "react-transition-group";
import ReactSwitch from "react-switch";
import ReportShowGridBtn from "../components/actions/ReportShowGridBtn";
import ReportsShow from "../components/report-manager/ReportsShow";
import Loadingx from "../components/ui/Loadingx";
import Hamburger from "hamburger-react";
import ContentLoading from "../components/ui/ContentLoading";
const ManagersClusterMap = dynamic(
  () => import(`../components/maps/ManagersClusterMap.js`),
  {
    ssr: false,
  }
);

LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_API_KEY);

const Home = () => {
  const gridRef = useRef();
  const router = useRouter();
  const formRef = useRef(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const gridStyle = useMemo(
    () => ({ height: "100vh", width: "100%", padding: "0.5rem" }),
    []
  );

  const errorHandler = (router, error, elseError) => {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error);
    } else if (error.response && error.response.status === 403) {
      toast.error("فراخوانی اطلاعات با عدم دسترسی");
      router.push("/access-denied");
    } else if (error.response && error.response.status === 401) {
      toast.error("توکن شما منقضی شده است. دوباره وارد حساب خود شوید");
      router.push("/auth/login");
    } else {
      toast.error(elseError);
    }
  };

  const [rowData, setRowData] = useState([]);
  const [gridRowData, setGridRowData] = useState([]);
  const memoizedData = useMemo(() => [...gridRowData], [gridRowData]);
  const memoizedRowData = useMemo(() => [...rowData], [rowData]);

  const [ageMed, setAgeMed] = useState({ years: "", months: "", days: "" });
  const [appMed, setAppMed] = useState({ years: "", months: "", days: "" });

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const openAvatarModal = () => setShowAvatarModal(true);
  const closeAvatarModal = () => setShowAvatarModal(false);
  const [modalAvatarPhoto, setModalAvatarPhoto] = useState("");

  const [showGeoShowModal, setShowGeoShowModal] = useState(false);
  const openGeoShowModal = () => setShowGeoShowModal(true);
  const closeGeoShowModal = () => setShowGeoShowModal(false);
  const [modalGeoShowInfo, setModalGeoShowInfo] = useState();

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const openDocumentsModal = () => setShowDocumentsModal(true);
  const closeDocumentsModal = () => setShowDocumentsModal(false);
  const [managerId, setManagerId] = useState();
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [editSelManId, setEditSelManId] = useState("");

  const [showReportsModal, setShowReportsModal] = useState(false);
  const openReportsModal = () => setShowReportsModal(true);
  const closeReportsModal = () => setShowReportsModal(false);

  const [openCollapse, setOpenCollapse] = useState(false);
  const [resMapCollapse, setResMapCollapse] = useState(false);
  const [serMapCollapse, setSerMapCollapse] = useState(false);
  const [eduDegreeColpse, setEduDegreeColpse] = useState(false);
  const [ageColpse, setAgeColpse] = useState(false);
  const [manTypeColpse, setManTypeColpse] = useState(false);
  const [birthProvColpse, setBirthProvColpse] = useState(false);
  const [serProvColpse, setSerProvColpse] = useState(false);
  const [resProvColpse, setResProvColpse] = useState(false);
  const [cityBirthColpse, setCityBirthColpse] = useState(false);
  const [cityServColpse, setCityServColpse] = useState(false);
  const [cityResColpse, setCityResColpse] = useState(false);
  const [genderColpse, setGenderColpse] = useState(false);
  const [appDaysColpse, setAppDaysColpse] = useState(false);
  const [empStatColpse, setEmpStatColpse] = useState(false);
  const [seflessColpse, setSefLessColpse] = useState(false);
  const [religionColpse, setReligionColpse] = useState(false);
  const [employColpse, setEmployColpse] = useState(false);
  const [orgNameColpse, setOrgNameColpse] = useState(false);
  const [isLoading, setIsLoading] = useState( true);

  const [allColapse, setAllColapse] = useState(false);

  const [selectObjs, setSelectObjs] = useState([]);

  useEffect(() => {
    if (openCollapse) {
      formRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [openCollapse, editSelManId]);

  useEffect(() => {
    const getSelectObjectsFromServer = async () => {
      try {
        const data = await getSelectObjects();
        setSelectObjs(data);
      } catch (error) {
        const elseError = "مشکلی در دریافت مقادیر انتخابی به وجود امده است";
        errorHandler(router, error, elseError);
      }
    };

    getSelectObjectsFromServer();
  }, []);

  useEffect(() => {
    setResMapCollapse(allColapse);
    setSerMapCollapse(allColapse);
    setEduDegreeColpse(allColapse);
    setAgeColpse(allColapse);
    setManTypeColpse(allColapse);
    setBirthProvColpse(allColapse);
    setSerProvColpse(allColapse);
    setResProvColpse(allColapse);
    setCityBirthColpse(allColapse);
    setCityServColpse(allColapse);
    setCityResColpse(allColapse);
    setGenderColpse(allColapse);
    setAppDaysColpse(allColapse);
    setEmpStatColpse(allColapse);
    setSefLessColpse(allColapse);
    setReligionColpse(allColapse);
    setEmployColpse(allColapse);
    setOrgNameColpse(allColapse);
  }, [allColapse]);

  const onModelUpdated = useCallback(() => {
    let rowDatax = [];
    gridRef.current.api?.forEachNodeAfterFilterAndSort((node, index) => {
      rowDatax.push(node.data);
    });

    setGridRowData(rowDatax);
  }, []);

  useEffect(() => {
    const ageDays = memoizedData.map((e) => e.age * 365);

    if (memoizedRowData) {
      let sum = 0;

      ageDays.forEach((ageDays) => {
        sum += ageDays;
      });

      const avgDaysMed = sum / ageDays.length;

      const yearsx = Math.floor(avgDaysMed / 365);
      let remainingDaysx = avgDaysMed % 365;
      const monthsx = Math.floor(remainingDaysx / 30);
      remainingDaysx %= 30;
      remainingDaysx = Math.floor(remainingDaysx);

      setAgeMed({ years: yearsx, months: monthsx, days: remainingDaysx });
    }
  }, [memoizedData]);

  useEffect(() => {
    const appDays = memoizedData.map((e) => e.appCounts);

    if (memoizedRowData) {
      let sumx = 0;

      appDays.forEach((appDay) => {
        sumx += appDay;
      });

      const appDaysMed = sumx / appDays.length;

      let years = Math.floor(appDaysMed / 365);
      let remainingDays = appDaysMed % 365;
      let months = Math.floor(remainingDays / 30);
      remainingDays %= 30;
      remainingDays = Math.floor(remainingDays);

      setAppMed({ years, months, days: remainingDays });
    }
  }, [memoizedData]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "شماره",
      minWidth: 100,
      width: 100,
      field: "number",
      sortable: false,
      filter: false,
      valueGetter: "node.rowIndex + 1",
    },
    {
      headerName: "گزارشات",
      minWidth: 100,
      width: 100,
      field: "reportsIcon",
      sortable: false,
      filter: false,
      cellRenderer: memo(ReportShowGridBtn),
      cellRendererParams: (params) => ({
        reports: params.data["reports"],
      }),
      onCellClicked: (params) => {
        setSelectedManagerId(params.data["managerId"]);
        openReportsModal(true);
      },
    },
    {
      headerName: "ویرایش",
      field: "editManager",
      minWidth: 100,
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: memo(EditManagerGridBtn),
      onCellClicked: (params) => {
        setEditSelManId(params.data["managerId"]);
        setOpenCollapse(true);
      },
    },
    {
      headerName: "شناسه",
      minWidth: 100,
      width: 100,
      field: "managerId",
      sortable: false,
      editable: false,
      hide: true,
    },

    {
      headerName: "تصویر",
      field: "avatar",
      minWidth: 100,
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: memo(ImageCellRenderer),
      onCellClicked: (params) => {
        setModalAvatarPhoto(params.data.avatar);
        openAvatarModal();
      },
    },
    {
      headerName: "تایید شده؟",
      field: "isConfirmed",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نقش مدیر دارد؟",
      field: "isManager",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نام",
      field: "firstName",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نام خانوادگی",
      field: "lastName",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "موبایل",
      field: "mobile",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "مدارک و مستندات",
      field: "documents",
      sortable: false,
      filter: false,
      cellRenderer: memo(DocAgGridBtn),
      onCellClicked: (params) => {
        setManagerId(params.data["managerId"]);
        openDocumentsModal();
      },
    },
    {
      headerName: "نوع پست سازمانی",
      field: "organResType",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "عنوان پست سازمانی",
      field: "organResName",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "واحد  سازمانی",
      field: "organUnit",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "تلفن دفتر",
      field: "serviceTel",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "استان محل خدمت",
      field: "serviceProvince",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " شهرستان محل خدمت",
      field: "serviceCountry",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " بخش محل خدمت",
      field: "serviceDistinct",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "اطلاعات محل خدمت",
      field: "serviceGeoInfo",
      sortable: false,
      filter: false,
      cellRenderer: memo(GeoInfoAgGridButton),
      onCellClicked: (params) => {
        setModalGeoShowInfo({
          location: params.data["serviceCoordinate"],
          province: params.data["serviceProvince"],
          country: params.data["serviceCountry"],
          city: params.data["serviceCity"],
          distinct: params.data["serviceDistinct"],
          neighborhood: params.data["serviceNeighborhood"],
          village: params.data["serviceVillage"],
          address: params.data["serviceAddress"],
        });
        openGeoShowModal();
      },
    },
    {
      headerName: "تلفن محل سکونت",
      field: "residenceTel",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "استان محل سکونت",
      field: "residenceProvince",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " شهرستان محل سکونت",
      field: "residenceCountry",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " بخش محل سکونت",
      field: "residenceDistinct",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "اطلاعات محل سکونت",
      field: "residenceGeoInfo",
      sortable: false,
      filter: false,
      cellRenderer: memo(GeoInfoAgGridButton),
      onCellClicked: (params) => {
        setModalGeoShowInfo({
          location: params.data["residenceCoordinate"],
          province: params.data["residenceProvince"],
          country: params.data["residenceCountry"],
          city: params.data["residenceCity"],
          distinct: params.data["residenceDistinct"],
          neighborhood: params.data["residenceNeighborhood"],
          village: params.data["residenceVillage"],
          address: params.data["residenceAddress"],
        });
        openGeoShowModal();
      },
    },
    {
      headerName: "تاریخ تولد",
      field: "birthDate",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "استان محل تولد",
      field: "birthProvince",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " شهرستان محل تولد",
      field: "birthCountry",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: " بخش محل تولد",
      field: "birthDistinct",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },

    {
      headerName: "اطلاعات محل تولد",
      field: "birthGeoInfo",
      sortable: false,
      filter: false,
      cellRenderer: memo(GeoInfoAgGridButton),
      onCellClicked: (params) => {
        setModalGeoShowInfo({
          location: params.data["birthCoordinate"],
          province: params.data["birthProvince"],
          country: params.data["birthCountry"],
          city: params.data["birthCity"],
          distinct: params.data["birthDistinct"],
          neighborhood: params.data["birthNeighborhood"],
          village: params.data["birthVillage"],
          address: params.data["birthAddress"],
        });
        openGeoShowModal();
      },
    },
    {
      headerName: "کد ملی",
      field: "nationalCode",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نوع مدیر حرفه ای",
      field: "managerLevel",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "سن مدیر",
      field: "age",
      chartDataType: "series",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "مدرک تحصیلی",
      field: "eduDegree",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "رشته تحصیلی",
      field: "eduField",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "جنسیت",
      field: "gender",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "وضعیت ایثارگری",
      field: "selflessState",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "دانشگاه محل تحصیل",
      field: "studyUni",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "مذهب",
      field: "religion",
      filter: "agMultiColumnFilter",
      chartDataType: "category",
    },
    {
      headerName: "نام پدر",
      field: "fatherName",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "تاریخ آخرین انتصاب",
      field: "lastAppointmentDate",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "تعداد روز های انتصاب",
      field: "appCounts",
      chartDataType: "series",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "تاریخ استخدام",
      field: "employmentDate",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نوع استخدام",
      field: "employType",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "وضعیت استخدام",
      chartDataType: "category",
      field: "isEmployNow",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "سابقه خدمت",
      field: "employmentDuration",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "مامور به خدمت از",
      field: "agentFrom",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "نام دستگاه",
      field: "organName",
      chartDataType: "category",
      filter: "agMultiColumnFilter",
    },
    {
      headerName: "گزارش ها",
      minWidth: 100,
      width: 100,
      field: "reports",
      sortable: false,
      editable: false,
      hide: true,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      enableRowGroup: false,
      filter: true,
      resizable: true,
      floatingFilter: true,
      cellStyle: {
        textAlign: "center",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      },
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const popupParent = useMemo(() => {
    if (typeof window !== "undefined") {
      return document.body;
    }
  }, []);

  const onGridReady = useCallback(async () => {
    try {
      const response = await getManagersForOrganManager();
      setRowData(response.data);
      setIsLoading(false);
    } catch (error) {
      setAllColapse(false);
      const elseError = "مشکلی در روند دریافت مدیران دستگاه ایجاد شده است";
      errorHandler(router, error, elseError);
    }
  }, []);

  const onFirstDataRendered = useCallback((event) => {}, []);

  const chartThemeOverrides = useMemo(() => {
    return {};
  }, []);

  const gridOptions = {
    chartToolPanelsDef: {
      panels: [],
    },
  };

  const signOut = async () => {
    try {
      await doSignOut();
      
      toast.success("از حساب خود خارج شدید");
      setIsSigningOut(true);
      router.push("/");
    } catch (error) {
      const elseError = "مشکلی در خروج از حساب ایجاد شده است";
      errorHandler(router, error, elseError);
    }finally{
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpire");
      localStorage.removeItem("roles");
    }
  };

  const [isOpen, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  if (isSigningOut) {
    return <Loadingx variant={"primary"} />;
  }

  if (isLoading === true) {
    onGridReady();
    return (
      <ContentLoading/>
    );
  }

  return (
    <>
      <div className="wrapper">
        <div className="header-title-p"></div>
        <div className="main">
          <nav className="navbar navbar-expand navbar-theme mx-2">
            <Dropdown show={isOpen} onToggle={toggleMenu}>
              <Hamburger
                size={25}
                color="#ffffff"
                toggled={isOpen}
                toggle={toggleMenu}
              />
              <Dropdown.Menu
                style={{
                  direction: "rtl",
                  textAlign: "right",
                  fontFamily: "__iransans_7c92e5",
                }}
              >
                <>
                  <Dropdown.Item href="/">صفحه اصلی</Dropdown.Item>

                  <Dropdown.Item href="/manager">ویرایش مشخصات</Dropdown.Item>

                  <Dropdown.Item onClick={signOut}>خروج از حساب</Dropdown.Item>
                </>
              </Dropdown.Menu>
            </Dropdown>
          </nav>
          <div className="content">
            <div className="container-fluid">
              <div className="header text-left">
                <h1 className="header-title"></h1>
                <p className="header-subtitle"></p>
              </div>

              <div className="row">
                <div className=" d-flex">
                  <div className="w-100">
                    <div className="row">
                      <div className="col-6 col-lg-3 px-2 mb-3">
                        <div
                          className="card shadow border-0 card-counter mt-4"
                          style={{ height: "150px" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col mt-0">
                                <h5 className="card-title">تعداد کل مدیران</h5>
                              </div>
                            </div>
                            <div className="display-5 mt-1">
                              {memoizedData?.length}
                            </div>

                           
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3 px-2 mb-3">
                        <div
                          className="card shadow border-0 card-counter mt-4"
                          style={{ height: "150px" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col mt-0">
                                <h5 className="card-title">
                                  میانگین سنی مدیران
                                </h5>
                              </div>
                            </div>
                            <div className="pt-3 time-content">
                              <small className="mt-1 fs-4 fw-bold mb-3 text-primary">{`${
                                ageMed?.years || "0"
                              }
                              سال `}</small>
                              <small className="mt-1 fs-4 fw-bold mb-3 text-secondary">{`${
                                ageMed?.months || "0"
                              } ماه `}</small>
                              <small className="mt-1 fs-4 fw-bold mb-3 text-primary">{`${
                                ageMed?.days || "0"
                              } روز `}</small>
                            </div>
                           
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3 px-2 mb-3">
                        <div
                          className="card shadow border-0 card-counter mt-4"
                          style={{ height: "150px" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col mt-0">
                                <h5 className="card-title">
                                  تعداد مدیران کردستانی{" "}
                                </h5>
                              </div>
                            </div>
                            <div className="display-5 mt-1">
                              {[
                                memoizedData?.filter(
                                  (c) => c?.birthProvince === "کردستان"
                                ).length,
                              ]}
                            </div>
                           
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3 px-2 mb-3">
                        <div
                          className="card shadow border-0 card-counter mt-4"
                          style={{ height: "150px" }}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col mt-0">
                                <h5 className="card-title">
                                  میانگین زمان تصدی
                                </h5>
                              </div>
                            </div>
                            <div className="pt-3 time-content">
                              <small className="mt-1 fs-4 fw-bold mb-3 text-primary">{`${
                                appMed?.years || "0"
                              } سال `}</small>
                              <small className="mt-1 fs-4 fw-bold mb-3 text-secondary">{`${
                                appMed?.months || "0"
                              } ماه `}</small>
                              <small className="mt-1 fs-4 fw-bold mb-3 text-primary">{`${
                                appMed?.days || "0"
                              } روز `}</small>
                            </div>
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="px-4">
                  <div className="card shadow border-1 flex-fill w-100">
                    <div className="card-header bg-white">
                      <h5 className="card-title pt-1">
                        محل دفاتر مدیران روی نقشه
                      </h5>
                    </div>
                    <div className="card-body pt-1">
                      <div
                        style={{
                          height: "30rem",
                          width: "100%",
                        }}
                      >
                        <ManagersClusterMap
                          gridData={memoizedData}
                          whichCoord={"serviceCoordinate"}
                          heightx={"30rem"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-xl-12">
                  <div className="card m-card shadow border-1 flex-fill">
                    <div className="card-header bg-white">
                      <h5 className="card-title">پنل کنترل نمایش نمودارها</h5>
                    </div>

                    <div className="card-body p-2 mt-3 mb-3 d-flex flex-row flex-wrap">
                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">نمایش همه</label>
                        <ReactSwitch
                          onColor="#6bff00"
                          onChange={setAllColapse}
                          checked={allColapse}
                          className="mx-2"
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">مدرک تحصیلی</label>
                        <ReactSwitch
                          onChange={setEduDegreeColpse}
                          checked={eduDegreeColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">سن مدیران</label>
                        <ReactSwitch
                          onChange={setAgeColpse}
                          checked={ageColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">نوع مدیریت</label>
                        <ReactSwitch
                          onChange={setManTypeColpse}
                          checked={manTypeColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">استان تولد</label>
                        <ReactSwitch
                          onChange={setBirthProvColpse}
                          checked={birthProvColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start  my-2">
                        <label className="form-check-label">استان خدمت</label>
                        <ReactSwitch
                          onChange={setSerProvColpse}
                          checked={serProvColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">استان سکونت</label>
                        <ReactSwitch
                          onChange={setResProvColpse}
                          checked={resProvColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">شهر تولد</label>
                        <ReactSwitch
                          onChange={setCityBirthColpse}
                          checked={cityBirthColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">شهر خدمت</label>
                        <ReactSwitch
                          onChange={setCityServColpse}
                          checked={cityServColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">شهر سکونت</label>
                        <ReactSwitch
                          onChange={setCityResColpse}
                          checked={cityResColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">جنسیت</label>
                        <ReactSwitch
                          onChange={setGenderColpse}
                          checked={genderColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">
                          تعداد ماه انتصاب
                        </label>
                        <ReactSwitch
                          onChange={setAppDaysColpse}
                          checked={appDaysColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">
                          وضعیت استخدام
                        </label>
                        <ReactSwitch
                          onChange={setEmpStatColpse}
                          checked={empStatColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">ایثارگری</label>
                        <ReactSwitch
                          onChange={setSefLessColpse}
                          checked={seflessColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">مذهب</label>
                        <ReactSwitch
                          onChange={setReligionColpse}
                          checked={religionColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">نوع استخدام</label>
                        <ReactSwitch
                          onChange={setEmployColpse}
                          checked={employColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">دستگاه ها</label>
                        <ReactSwitch
                          onChange={setOrgNameColpse}
                          checked={orgNameColpse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">
                          نقشه محل تولد
                        </label>
                        <ReactSwitch
                          onChange={setSerMapCollapse}
                          checked={serMapCollapse}
                          className="mx-2"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-start my-2">
                        <label className="form-check-label">
                          نقشه محل سکونت
                        </label>
                        <ReactSwitch
                          onChange={setResMapCollapse}
                          checked={resMapCollapse}
                          className="mx-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row mt-4">
                <CSSTransition
                  in={eduDegreeColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">مدرک تحصیلی</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="eduDegree"
                          valueKey="percentage"
                          legPosition="left"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={ageColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">سن مدیران</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <VerticalBarChart
                          gridData={memoizedData}
                          buckets={8}
                          colName={"age"}
                          fixN={10}
                          titlex={" بازه سنی"}
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={manTypeColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">نوع مدیر</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="managerLevel"
                          valueKey="percentage"
                          legPosition="right"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={birthProvColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title"> استان محل تولد </h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="birthProvince"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={serProvColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title"> استان محل خدمت </h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="serviceProvince"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={resProvColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title"> استان محل سکونت </h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="residenceProvince"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={cityBirthColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">شهرستان محل تولد</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="birthCountry"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={cityServColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">شهرستان محل خدمت</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="serviceCountry"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={cityServColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">شهرستان محل سکونت</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <ColumnChartJs
                          gridData={memoizedData}
                          xKey="residenceCountry"
                          yKey="percentage"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={genderColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">جنسیت</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="gender"
                          valueKey="percentage"
                          legPosition="left"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={appDaysColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">
                          تعداد روز های تصدی مدیریت
                        </h5>
                      </div>
                      <div className="card-body p-0 " style={{ height: 300 }}>
                        <VerticalBarChart
                          gridData={memoizedData}
                          buckets={6}
                          colName={"appCounts"}
                          fixN={10}
                          titlex={"بازه روز تصدی خدمت"}
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={empStatColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">وضعیت استخدام</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="isEmployNow"
                          valueKey="percentage"
                          legPosition="right"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={seflessColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">وضعیت ایثارگری</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="selflessState"
                          valueKey="percentage"
                          legPosition="left"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={religionColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">مذهب</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="religion"
                          valueKey="percentage"
                          legPosition="bottom"
                          legDirection="horizontal"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={employColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-4 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">نوع استخدام</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="employType"
                          valueKey="percentage"
                          legPosition="left"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
               
                <CSSTransition
                  in={orgNameColpse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-12 d-flex  mb-4">
                    <div className="card m-card shadow-lg border-0 flex-fill">
                      <div className="card-header bg-white">
                        <h5 className="card-title">نام دستگاه</h5>
                      </div>
                      <div className="card-body p-0" style={{ height: 300 }}>
                        <PieChartJs
                          gridData={memoizedData}
                          labelKey="organName"
                          valueKey="percentage"
                          legPosition="left"
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>

                
                <CSSTransition
                  in={serMapCollapse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-12 mb-4 px-5">
                    <div className="card m-card shadow-lg p-0 m-0">
                      <div className="card-header bg-white">
                        <h5
                          className="card-title"
                          onClick={() => setSerMapCollapse((e) => !e)}
                        >
                          محل تولد مدیران روی نقشه
                        </h5>
                      </div>

                      <div className="card-body p-0 m-0">
                        <div
                          style={{
                            height: "28rem",
                            width: "100%",
                            padding: "0.5rem",
                          }}
                        >
                          <ManagersClusterMap
                            gridData={memoizedData}
                            whichCoord={"publicBirthCoordinate"}
                            heightx={"28rem"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                
                <CSSTransition
                  in={resMapCollapse}
                  timeout={400}
                  classNames={{ ...styles }}
                  unmountOnExit
                >
                  <div className="col-xl-12 mb-4 px-5">
                    <div className="card m-card shadow-lg p-0 m-0">
                      <div className="card-header bg-white">
                        <h5
                          className="card-title"
                          onClick={() => setResMapCollapse((e) => !e)}
                        >
                          محل سکونت مدیران روی نقشه
                        </h5>
                      </div>

                      <div className="card-body p-0 m-0">
                        <div
                          style={{
                            height: "28rem",
                            width: "100%",
                            padding: "0.5rem",
                          }}
                        >
                          <ManagersClusterMap
                            gridData={memoizedData}
                            whichCoord={"residenceCoordinate"}
                            heightx={"27rem"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                <div className="col-xl-12 mb-2">
                  <Button
                    variant="outline-primary"
                    type="button"
                    onClick={() => {
                      setOpenCollapse((e) => !e);
                      setEditSelManId("");
                    }}
                    size="lg"
                    className="mx-1"
                  >
                    {openCollapse ? (
                      <span>بستن فرم</span>
                    ) : (
                      <span>ثبت مدیر جدید</span>
                    )}
                  </Button>

                  <CSSTransition
                    in={openCollapse}
                    timeout={400}
                    classNames={{ ...styles }}
                    unmountOnExit
                  >
                    <div ref={formRef} className="col-xl-12 mt-2">
                      <div className="card m-card shadow-lg p-0 m-0">
                        <div className="card-header bg-white">
                          <h5 className="card-title">
                            ویرایش یا ثبت مدیر جدید
                          </h5>
                        </div>

                        <div className="card-body p-2 mt-3 mb-3">
                          <AddManagerAsOrganManager
                            managerId={editSelManId}
                            selectObjs={selectObjs}
                            updateGridData={() => {
                              onGridReady();
                              setOpenCollapse(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CSSTransition>
                </div>

                <div className="col-xl-12">
                  <div className="card m-card shadow-lg p-0 m-0">
                    <div className="card-body p-0 m-0">
                      <div
                        id="myGrid"
                        className="ag-theme-alpine"
                        style={gridStyle}
                      >
                        <AgGridReact
                          ref={gridRef}
                          pagination={true}
                          paginationAutoPageSize={true}
                          rowData={memoizedRowData}
                          columnDefs={columnDefs}
                          enableRtl={true}
                          defaultColDef={defaultColDef}
                          autoGroupColumnDef={autoGroupColumnDef}
                          rowGroupPanelShow="never"
                          enableCharts={true}
                          enableRangeSelection={true}
                          animateRows={true}
                          chartThemeOverrides={chartThemeOverrides}
                          popupParent={popupParent}
                          gridOptions={gridOptions}
                          onGridReady={onGridReady}
                          onModelUpdated={onModelUpdated}
                          onFirstDataRendered={onFirstDataRendered}
                          localeText={AG_GRID_LOCALE_FA}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="footer mt-5">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 text-center pt-4">
                  <p className="text-white fs-6">
                    کلیه حقوق مادی و معنوی برای استانداری کردستان محفوظ است
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Modal show={showAvatarModal} onHide={closeAvatarModal} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ marginRight: 70 }}>
          <img
            src={
              modalAvatarPhoto
                ? process.env.NEXT_PUBLIC_API_ROOT +
                  "/AvatarImage/" +
                  modalAvatarPhoto
                : "/img/noPhoto.png"
            }
            style={{ width: "300px", height: "300px", borderRadius: "50%" }}
          />
        </Modal.Body>
        <Modal.Footer style={{ direction: "ltr" }}>
          <Row>
            <Col md="12">
              <Button
                type="button"
                variant="secondary"
                onClick={closeAvatarModal}
                className="mx-1"
              >
                بستن
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showGeoShowModal}
        onHide={closeGeoShowModal}
        dialogClassName="modal-80w"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <GeoShow geoData={modalGeoShowInfo} />
        </Modal.Body>
        <Modal.Footer style={{ direction: "ltr" }}>
          <Row>
            <Col md="12">
              <Button
                type="button"
                variant="secondary"
                onClick={closeGeoShowModal}
                className="mx-1"
              >
                بستن
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDocumentsModal}
        dialogClassName="modal-80w"
        onHide={closeDocumentsModal}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={12}>
                <DocShow managerId={managerId} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{ direction: "ltr" }}>
          <Row>
            <Col md="12">
              <Button
                type="button"
                variant="secondary"
                onClick={closeDocumentsModal}
                className="mx-1"
              >
                بستن
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showReportsModal}
        dialogClassName="modal-80w"
        onHide={closeReportsModal}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={12}>
                <ReportsShow managerId={selectedManagerId} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{ direction: "ltr" }}>
          <Row>
            <Col md="12">
              <Button
                type="button"
                variant="secondary"
                onClick={closeReportsModal}
                className="mx-1"
              >
                بستن
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthHOC(Home);
