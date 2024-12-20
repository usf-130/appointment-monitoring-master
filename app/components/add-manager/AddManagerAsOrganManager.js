"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  Container,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import FaDatePicker from "../date-picker/FaDatePicker";
import dynamic from 'next/dynamic';
const GeoPick = dynamic(() => import('../maps/GeoPick'), {
  ssr: false, // Disable server-side rendering
});
import {
  getLocationInfo,
  getGeneralizedLocation,
} from "@/app/services/neshanmap/LocToGeoInfo";
import { toast } from "react-toastify";
import Avatar from "../file-uploader/Avatar";
import DocumentUploader from "../file-uploader/DocumentUploader";
import {
  getManagerInitInfoAsOm,
  submitManagerInfoAsOm,
} from "@/app/services/api/api";
import { ValidateNationalCode } from "@/app/utils/ValidateNationalCode";
import { useRouter } from "next/navigation";
import FaMultDatePicker from "../date-picker/FaMultDatePicker";
import ReactSwitch from "react-switch";

const AddManagerAsOrganManager = ({
  managerId,
  updateGridData,
  selectObjs,
}) => {
  const [initValues, setInitValues] = useState([]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorHandler = (router, error, elseError) => {
    if (error.response && error.response.status === 400) {
      if (error.response.data.errors) {
        toast.error("فرم به درستی ارسال نشده است");
      } else {
        toast.error(error.response.data.error);
      }
    } else if (error.response && error.response.status === 403) {
      toast.error("فراخوانی اطلاعات با عدم دسترسی");
      router.replace("/access-denied");
    } else if (error.response && error.response.status === 401) {
      toast.error("توکن شما منقضی شده است. دوباره وارد حساب خود شوید");
      router.replace("/auth/login");
    } else {
      toast.error(elseError);
    }
  };

  useEffect(() => {
    const fetchManagerInfo = async () => {
      try {
        const data = await getManagerInitInfoAsOm(managerId);
        setInitValues(data);
      } catch (error) {
        const elseError = "مشکلی در روند واکشی اطلاعات به وجود آمده است";
        errorHandler(router, error, elseError);
      }
    };
    if (managerId) {
      fetchManagerInfo();
    }
  }, [managerId]);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const openServiceModal = () => setShowServiceModal(true);
  const closeServiceModal = () => setShowServiceModal(false);
  const [setServiceGeoOk, setsetServiceGeoOk] = useState(false);

  const [showResidenceModal, setShowResidenceModal] = useState(false);
  const openResidenceModal = () => setShowResidenceModal(true);
  const closeResidenceModal = () => setShowResidenceModal(false);
  const [setResidenceGeoOk, setSetResidenceGeoOk] = useState(false);

  const [showBirthModal, setShowBirthModal] = useState(false);
  const openBirthModal = () => setShowBirthModal(true);
  const closeBirthModal = () => setShowBirthModal(false);
  const [setBirthGeoOk, setSetBirthGeoOk] = useState(false);

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const openDocumentsModal = () => setShowDocumentsModal(true);
  const closeDocumentsModal = () => setShowDocumentsModal(false);
  const [setsetDocumentsOk, setSetsetDocumentsOk] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const openAvatarModal = () => setShowAvatarModal(true);
  const closeAvatarModal = () => setShowAvatarModal(false);
  const [setsetAvatarOk, setSetsetAvatarOk] = useState(false);

  const serviceMapRef = useRef(null);
  const residenceMapRef = useRef(null);
  const birthMapRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (
      watch("serviceCoordinate") &&
      showServiceModal &&
      watch("serviceCoordinate") != initValues["serviceCoordinate"]
    ) {
      getLocationInfo(
        watch("serviceCoordinate")["lat"],
        watch("serviceCoordinate")["lng"]
      )
        .then((info) => {
          setValue(
            "serviceProvince",
            info.province.replace("استان", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue(
            "serviceCountry",
            info.county.replace("شهرستان", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue("serviceCity", info.city?.trim(), { shouldValidate: true });
          setValue("serviceNeighbourhood", info.neighbourhood, {
            shouldValidate: true,
          });
          setValue(
            "serviceDistinct",
            info.district.replace("بخش", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue("serviceVillage", info.village?.trim(), {
            shouldValidate: true,
          });

          const mant = info.municipality_zone
            ? `منطقه ${info.municipality_zone}`
            : "";

          const mahl = info.neighbourhood
            ? ` محله ی ${info.neighbourhood}`
            : "";
          const roosta = info.village ? `روستا ی ${info.village}` : "";
          const pish = info.district ? info.district : "";
          const count = info.county ? info.county : "";
          const ost = info.province ? info.province : "";

          const adres =
            ost +
            " " +
            count +
            " " +
            pish +
            " " +
            mant +
            " " +
            info.address +
            " " +
            mahl +
            " " +
            roosta;
          setValue("serviceAddress", adres?.trim(), {
            shouldValidate: true,
            shouldDirty: true,
          });
        })
        .catch((error) => {
          console.error("Error fetching location info:", error);
        });
    }
  }, [watch("serviceCoordinate")]);

  useEffect(() => {
    if (watch("residenceCoordinate") && showResidenceModal) {
      getLocationInfo(
        watch("residenceCoordinate")["lat"],
        watch("residenceCoordinate")["lng"]
      )
        .then((info) => {
          setValue(
            "residenceProvince",
            info.province.replace("استان", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue(
            "residenceCountry",
            info.county.replace("شهرستان", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue("residenceCity", info.city?.trim(), {
            shouldValidate: true,
          });
          setValue("residenceNeighbourhood", info.neighbourhood, {
            shouldValidate: true,
          });
          setValue(
            "residenceDistinct",
            info.district.replace("بخش", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue("residenceVillage", info.village?.trim(), {
            shouldValidate: true,
          });

          const mant = info.municipality_zone
            ? `منطقه ${info.municipality_zone}`
            : "";

          const mahl = info.neighbourhood
            ? ` محله ی ${info.neighbourhood}`
            : "";
          const roosta = info.village ? `روستا ی ${info.village}` : "";
          const pish = info.district ? info.district : "";
          const count = info.county ? info.county : "";
          const ost = info.province ? info.province : "";

          const adres =
            ost +
            " " +
            count +
            " " +
            pish +
            " " +
            mant +
            " " +
            info.address +
            " " +
            mahl +
            " " +
            roosta;
          setValue("residenceAddress", adres?.trim(), {
            shouldValidate: true,
            shouldDirty: true,
          });
        })
        .catch((error) => {
          console.error("Error fetching location info:", error);
        });
    }
  }, [watch("residenceCoordinate")]);

  useEffect(() => {
    if (watch("birthCoordinate") && showBirthModal) {
      getLocationInfo(
        watch("birthCoordinate")["lat"],
        watch("birthCoordinate")["lng"]
      )
        .then((info) => {
          setValue(
            "birthProvince",
            info.province.replace("استان", "")?.trim(),
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue("birthCountry", info.county.replace("شهرستان", "")?.trim(), {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("birthCity", info.city?.trim(), { shouldValidate: true });
          setValue("birthNeighbourhood", info.neighbourhood, {
            shouldValidate: true,
          });
          setValue("birthDistinct", info.district.replace("بخش", "")?.trim(), {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("birthVillage", info.village?.trim(), {
            shouldValidate: true,
          });

          const mant = info.municipality_zone
            ? `منطقه ${info.municipality_zone}`
            : "";

          const mahl = info.neighbourhood
            ? ` محله ی ${info.neighbourhood}`
            : "";
          const roosta = info.village ? `روستا ی ${info.village}` : "";
          const pish = info.district ? info.district : "";
          const count = info.county ? info.county : "";
          const ost = info.province ? info.province : "";

          const adres =
            ost +
            " " +
            count +
            " " +
            pish +
            " " +
            mant +
            " " +
            info.address +
            " " +
            mahl +
            " " +
            roosta;
          setValue("birthAddress", adres?.trim(), {
            shouldValidate: true,
            shouldDirty: true,
          });
        })
        .catch((error) => {
          console.error("Error fetching location info:", error);
        });
    }
  }, [watch("birthCoordinate")]);

  useEffect(() => {
    const handlesetDefaultValues = (key, value) => {
      switch (key) {
        case "eduDegreeId":
          const eduDegree = selectObjs.eduDegreeOptions?.find(
            (o) => o.value == value
          );
          return eduDegree;
        case "organUnitId":
          const organUnit = selectObjs.organUnitOptions?.find(
            (o) => o.value == value
          );
          return organUnit;
        case "genderId":
          const gender = selectObjs.genderOptions?.find(
            (o) => o.value == value
          );
          return gender;
        case "selflessStateId":
          const selflessState = selectObjs.selflessStateOptions?.find(
            (o) => o.value == value
          );
          return selflessState;
        case "religionId":
          const religion = selectObjs.religionOptions?.find(
            (o) => o.value == value
          );
          return religion;
          case "employTypeId":
            const employType = selectObjs.employTypeOptions?.find(
              (o) => o.value == value
            );
            return employType;
        case "managerLevelId":
          const managerLevel = selectObjs.managerLevelOptions?.find(
            (o) => o.value == value
          );
          return managerLevel;
        case "organResNameId":
          const organResName = selectObjs.organResNameOptions?.find(
            (o) => o.value == value
          );
          return organResName;
        case "organResTypeId":
          const organResType = selectObjs.organResTypeOptions?.find(
            (o) => o.value == value
          );
          return organResType;

        case "birthCoordinate":
          if (value) {
            setSetBirthGeoOk(true);
            return JSON.parse(value);
          }
          return "";

        case "residenceCoordinate":
          if (value) {
            setSetResidenceGeoOk(true);
            return JSON.parse(value);
          }
          return "";

        case "serviceCoordinate":
          if (value) {
            setsetServiceGeoOk(true);
            return JSON.parse(value);
          }
          return "";

        default:
          return value;
      }
    };

    if (initValues["docs"]?.length > 0) {
      setSetsetDocumentsOk(true);
    }

    if (initValues["avatarName"]) {
      setSetsetAvatarOk(true);
    }

    Object.entries(initValues).forEach(([key, value]) => {
      const mappedValue = handlesetDefaultValues(key, value);
      const formKey = key != "userId" ? key.replace("Id", "") : key;
      if (key !== "docs" && key !== "avatarName") {
        setValue(formKey, mappedValue);
      }
    });

    if (initValues["serviceCoordinate"]) {
    }
  }, [initValues]);

  const coordToString = (coord) => `{"lat":${coord.lat},"lng":${coord.lng}}`;
  const selectToValue = (select) => select.value;

  const onSubmit = async (data) => {
    let publicResidenceCoordinate = initValues["publicResidenceCoordinate"];
    let publicBirthCoordinate = initValues["publicBirthCoordinate"];
    //generalize coordinates
    if (
      data["residenceCoordinate"] != initValues["residenceCoordinate"] ||
      !initValues["publicResidenceCoordinate"]
    ) {
      const addrss =
        "ایران" + " " + data["residenceCountry"] + " " + data["residenceCity"];
      const zoom = data["residenceCountry"] && data["residenceCity"] ? 10 : 8;
      try {
        publicResidenceCoordinate = await getGeneralizedLocation(addrss, zoom);
      } catch (error) {
        toast.warning(
          "توجه: لوکیشن کلی محل سکونت، قابل نمایش برای عموم ثبت نشد"
        );
      }
    }

    //generalize coordinates
    if (data["birthCoordinate"] != initValues["birthCoordinate"] || !initValues["publicBirthCoordinate"]) {
      const addrss =
        "ایران" + " " + data["birthCountry"] + " " + data["birthCity"];
      const zoom = data["birthCountry"] && data["birthCity"] ? 10 : 8;
      try {
        publicBirthCoordinate = await getGeneralizedLocation(addrss, zoom);
      } catch (error) {
        toast.warning(
          "توجه: لوکیشن کلی محل تولد، قابل نمایش برای عموم ثبت نشد"
        );
      }
    }

    const dataToSend = {
      ...data,
      userId: initValues["userId"],
      serviceCoordinate: coordToString(watch("serviceCoordinate")),
      residenceCoordinate: coordToString(watch("residenceCoordinate")),
      birthCoordinate: coordToString(watch("birthCoordinate")),
      organResTypeId: selectToValue(watch("organResType")),
      organResNameId: selectToValue(watch("organResName")),
      publicResidenceCoordinate,
      publicBirthCoordinate,
      organUnitId: selectToValue(watch("organUnit")),
      managerLevelId: selectToValue(watch("managerLevel")),
      employTypeId: selectToValue(watch("employType")),
      eduDegreeId: selectToValue(watch("eduDegree")),
      genderId: selectToValue(watch("gender")),
      selflessStateId: selectToValue(watch("selflessState")),
      religionId: selectToValue(watch("religion")),
      appointmentDates: data["appointmentDates"]?.toString(),
    };

    setIsSubmitting(true);

    try {
      await submitManagerInfoAsOm(dataToSend);
      if (managerId == null) {
        toast.success("ثبت مدیر با موفقیت انجام شد");
        reset();
      } else {
        toast.success("ویرایش مشخصات با موفقیت اعمال شد");
      }
      updateGridData();
    } catch (error) {
      const elseError = "مشکلی در ثبت اطلاعات مدیر رخ داده است";
      errorHandler(router, error, elseError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handelSubmitServiceGeoFileds = () => {
    const drgState = serviceMapRef?.current?.getDraggableState();
    if (drgState) {
      toast.error("لطفا لوکیشن را تایید نمایید");
      return;
    }

    if (
      !watch("serviceCoordinate") ||
      !watch("serviceAddress") ||
      !watch("serviceProvince") ||
      !watch("serviceCountry") ||
      !watch("serviceDistinct")
    ) {
      if (!watch("serviceCoordinate")) {
        toast.error("لطفا لوکیشن را انتخاب و تایید نمایید");
      } else {
        toast.error("لطفا موارد اجباری را وارد نمایید");
      }
      return;
    } else {
      setsetServiceGeoOk(true);
      closeServiceModal();
    }
  };

  const handelSubmitResidenceGeoFields = () => {
    const drgState = residenceMapRef?.current?.getDraggableState();
    if (drgState) {
      toast.error("لطفا لوکیشن را تایید نمایید");
      return;
    }

    if (
      !watch("residenceCoordinate") ||
      !watch("residenceAddress") ||
      !watch("residenceProvince") ||
      !watch("residenceCountry") ||
      !watch("residenceDistinct")
    ) {
      if (!watch("residenceCoordinate")) {
        toast.error("لطفا لوکیشن را انتخاب و تایید نمایید");
      } else {
        toast.error("لطفا موارد اجباری را وارد نمایید");
      }
      return;
    } else {
      setSetResidenceGeoOk(true);
      closeResidenceModal();
    }
  };

  const handelSubmitBirthGeoFields = () => {
    const drgState = birthMapRef?.current?.getDraggableState();
    if (drgState) {
      toast.error("لطفا لوکیشن را تایید نمایید");
      return;
    }

    if (
      !watch("birthCoordinate") ||
      !watch("birthAddress") ||
      !watch("birthProvince") ||
      !watch("birthCountry") ||
      !watch("birthDistinct")
    ) {
      if (!watch("birthCoordinate")) {
        toast.error("لطفا لوکیشن را انتخاب و تایید نمایید");
      } else {
        toast.error("لطفا موارد اجباری را وارد نمایید");
      }
      return;
    } else {
      setSetBirthGeoOk(true);
      closeBirthModal();
    }
  };

  const handelSubmitDocumentsFields = () => {
    if (watch("documents")?.some((file) => !file.description)) {
      toast.error("لطفا برای تمام مستندات آپلود شده، توضیح کوتاه بنویسید");
    } else {
      setSetsetDocumentsOk(true);
      closeDocumentsModal();
    }
  };

  const handelSubmitAvatarField = () => {
    if (!initValues["avatarName"] && !watch("avatar")) {
      toast.error("ثبت تصویر مدیر الزامی است");
    } else {
      setSetsetAvatarOk(true);
      closeAvatarModal();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      noValidate
      style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
    >
      <Row className="my-4">
        <Col md={3}>
          <Form.Group>
            {errors.userName && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نام کاربری</Form.Label>
            <Form.Control
              type="text"
              {...register("userName", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>
              {managerId ? "تغییر رمز عبور مدیر" : "رمز عبور"}
            </Form.Label>
            <Form.Control
              type="text"
              {...register("password", { minLength: 6 })}
            />
            {errors.password && errors.password?.type === "minLength" && (
              <Form.Text className="text-danger mx-1">
                رمز عبور باید حداقل 6 حرفی باشد
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.mobile && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>موبایل</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                isValid={
                  initValues["mobile"] && initValues["phoneConfirmed"] == true
                }
                isInvalid={
                  initValues["mobile"] && initValues["phoneConfirmed"] != true
                }
                {...register("mobile", { required: true })}
              />
              {initValues["mobile"] && (
                <div className="input-group-append mx-1 mt-1">
                  {initValues["phoneConfirmed"] == true ? (
                    <Form.Text className="text-success"> تایید شده</Form.Text>
                  ) : (
                    <Form.Text className="text-danger"> تایید نشده</Form.Text>
                  )}
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={3} className="mt-4 d-flex align-items-center">
          <Form.Label>تایید مشخصات</Form.Label>
          <Controller
            name="isConfirmed"
            control={control}
            render={({ field }) => (
              <ReactSwitch
                onChange={(checked) => field.onChange(checked)}
                checked={field.value || false}
                className="mx-1"
              />
            )}
          />
          <Form.Label style={{ marginRight: 15 }}>نقش مدیر</Form.Label>

          <Controller
            name="isInRole"
            control={control}
            render={({ field }) => (
              <ReactSwitch
                onChange={(checked) => field.onChange(checked)}
                checked={field.value || false}
                className="mx-1"
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group>
            {errors.firstName && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نام</Form.Label>
            <Form.Control
              type="text"
              {...register("firstName", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.lastName && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نام خانوادگی</Form.Label>
            <Form.Control
              type="text"
              {...register("lastName", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.fatherName && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نام پدر</Form.Label>
            <Form.Control
              type="text"
              {...register("fatherName", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.nationalCode && errors.nationalCode.type === "required" && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>کد ملی</Form.Label>
            <Form.Control
              type="text"
              {...register("nationalCode", {
                required: true,
                validate: ValidateNationalCode,
              })}
            />
            {errors.nationalCode && errors.nationalCode.type !== "required" && (
              <Form.Text className="text-danger mx-1">نامعتبر</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={3}>
          <Form.Group>
            {errors.serviceTel && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label> تلفن دفتر </Form.Label>
            <Form.Control
              type="text"
              {...register("serviceTel", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.residenceTel && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>تلفن منزل</Form.Label>
            <Form.Control
              type="text"
              {...register("residenceTel", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.eduField && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>رشته تحصیلی</Form.Label>
            <Form.Control
              type="text"
              {...register("eduField", { required: true })}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.studyUni && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نام دانشگاه</Form.Label>
            <Form.Control
              type="text"
              {...register("studyUni", { required: true })}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group>
            {errors.agentFrom && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label> مامور به خدمت از</Form.Label>
            <Form.Control
              type="text"
              {...register("agentFrom", { required: false })}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            {errors.organResType && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نوع پست سازمانی</Form.Label>

            <Controller
              control={control}
              name="organResType"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.organResTypeOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("organResType")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            {errors.organResName && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>عنوان پست سازمانی</Form.Label>
            <Controller
              control={control}
              name="organResName"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.organResNameOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("organResName")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={3}>
          <Form.Group>
            {errors.organUnit && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>واحد سازمانی </Form.Label>
            <Controller
              control={control}
              name="organUnit"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.organUnitOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("organUnit")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            {errors.employType && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نوع استخدام</Form.Label>
            <Controller
              control={control}
              name="employType"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.employTypeOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("employType")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3">
            {errors.managerLevel && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>نوع مدیر حرفه ای</Form.Label>
            <Controller
              control={control}
              name="managerLevel"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.managerLevelOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("managerLevel")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3">
            {errors.eduDegree && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>مدرک</Form.Label>
            <Controller
              control={control}
              name="eduDegree"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.eduDegreeOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("eduDegree")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3">
            {errors.gender && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>جنسیت</Form.Label>
            <Controller
              control={control}
              name="gender"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.genderOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("gender")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group>
            {errors.selflessState && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label> وضعیت ایثارگری </Form.Label>
            <Controller
              control={control}
              name="selflessState"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.selflessStateOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("selflessState")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            {errors.religion && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>مذهب</Form.Label>
            <Controller
              control={control}
              name="religion"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectObjs.religionOptions}
                  placeholder="انتخاب کنید"
                  isSearchable={true}
                  isClearable={true}
                  isRtl={true}
                  defaultValue={watch("religion")}
                  noOptionsMessage={() => "یافت نشد"}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            {errors.appointmentDates && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>تاریخ انتصاب</Form.Label>
            <Controller
              name="appointmentDates"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FaMultDatePicker
                  onChange={field.onChange}
                  defaultValues={initValues["appointmentDates"]}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            {errors.employmentDate && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>تاریخ استخدام</Form.Label>
            <Controller
              name="employmentDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FaDatePicker
                  onChange={field.onChange}
                  defaultValue={initValues["employmentDate"]}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3">
            {errors.birthDate && (
              <Form.Text className="text-danger mx-1">*</Form.Text>
            )}
            <Form.Label>تاریخ تولد</Form.Label>
            <Controller
              name="birthDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FaDatePicker
                  onChange={field.onChange}
                  defaultValue={initValues["birthDate"]}
                />
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-4">
        {/* //TODO:Create component for these 3  */}
        <Col>
          {(errors.serviceAddress ||
            errors.serviceCoordinate ||
            errors.serviceProvince ||
            errors.serviceCountry ||
            errors.serviceDistinct) && (
            <Form.Text className="text-danger mx-1">*</Form.Text>
          )}

          <Form.Label>اطلاعات محل خدمت</Form.Label>
          <Button
            variant={setServiceGeoOk ? "outline-success" : "outline-primary"}
            onClick={openServiceModal}
            className="mx-1"
          >
            {setServiceGeoOk ? "ویرایش" : "ثبت از نقشه"}
          </Button>
        </Col>
        <Modal
          show={showServiceModal}
          dialogClassName="modal-80w"
          backdrop="static"
          onHide={closeServiceModal}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={6} md={3}>
                  <Row>
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="serviceProvince">استان</Form.Label>
                      <Form.Control
                        {...register("serviceProvince", { required: true })}
                        type="text"
                        id="serviceProvince"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="serviceCountry">شهرستان</Form.Label>
                      <Form.Control
                        {...register("serviceCountry", { required: true })}
                        type="text"
                        id="serviceCountry"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label htmlFor="serviceCity" className="mx-1">
                        شهر
                      </Form.Label>
                      <Form.Control
                        {...register("serviceCity")}
                        type="text"
                        id="serviceCity"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="serviceDistinct">بخش</Form.Label>

                      <Form.Control
                        {...register("serviceDistinct", { required: true })}
                        type="text"
                        id="serviceDistinct"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label
                        htmlFor="serviceNeighbourhood"
                        className="mx-1"
                      >
                        محله
                      </Form.Label>

                      <Form.Control
                        {...register("serviceNeighbourhood")}
                        type="text"
                        id="serviceNeighbourhood"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-2">
                    <Form.Group>
                      <Form.Label htmlFor="serviceVillage" className="mx-1">
                        روستا
                      </Form.Label>

                      <Form.Control
                        {...register("serviceVillage")}
                        type="text"
                        id="serviceVillage"
                      />
                    </Form.Group>
                  </Row>
                </Col>
                <Col xs={12} md={9}>
                  <Controller
                    name="serviceCoordinate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <GeoPick
                        {...field}
                        initLocation={watch("serviceCoordinate")}
                        ref={serviceMapRef}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} md={12}>
                  <InputGroup>
                    <Form.Text className="text-danger mx-1">*</Form.Text>

                    <InputGroup.Text>آدرس</InputGroup.Text>
                    <Form.Control
                      type="text"
                      {...register("serviceAddress", { required: true })}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer style={{ direction: "ltr" }}>
            <Row>
              <Col md="12">
                <Form.Text muted className="mx-3">
                  لطفا تنها لوکیشن را انتخاب و تایید نمایید،سایر فیلدها بر اساس
                  لوکیشن بصورت اتوماتیک پر خواهد شد
                </Form.Text>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeServiceModal}
                  className="mx-1"
                >
                  بستن
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  onClick={handelSubmitServiceGeoFileds}
                  className="mx-1"
                >
                  اعمال تغییر در فرم
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        <Col>
          {(errors.residenceAddress ||
            errors.residenceCoordinate ||
            errors.residenceProvince ||
            errors.residenceCountry ||
            errors.residenceDistinct) && (
            <Form.Text className="text-danger mx-1">*</Form.Text>
          )}

          <Form.Label>اطلاعات محل سکونت</Form.Label>
          <Button
            variant={setResidenceGeoOk ? "outline-success" : "outline-primary"}
            onClick={openResidenceModal}
            className="mx-1"
          >
            {setResidenceGeoOk ? "ویرایش" : "ثبت از نقشه"}
          </Button>
        </Col>
        <Modal
          show={showResidenceModal}
          dialogClassName="modal-80w"
          backdrop="static"
          onHide={closeResidenceModal}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={6} md={3}>
                  <Row>
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="residenceProvince">استان</Form.Label>
                      <Form.Control
                        {...register("residenceProvince", { required: true })}
                        type="text"
                        id="residenceProvince"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="residenceCountry">
                        شهرستان
                      </Form.Label>
                      <Form.Control
                        {...register("residenceCountry", { required: true })}
                        type="text"
                        id="residenceCountry"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label htmlFor="residenceCity" className="mx-1">
                        شهر
                      </Form.Label>
                      <Form.Control
                        {...register("residenceCity")}
                        type="text"
                        id="residenceCity"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="residenceDistinct">بخش</Form.Label>

                      <Form.Control
                        {...register("residenceDistinct", { required: true })}
                        type="text"
                        id="residenceDistinct"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label
                        htmlFor="residenceNeighbourhood"
                        className="mx-1"
                      >
                        محله
                      </Form.Label>

                      <Form.Control
                        {...register("residenceNeighbourhood")}
                        type="text"
                        id="residenceNeighbourhood"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-2">
                    <Form.Group>
                      <Form.Label htmlFor="residenceVillage" className="mx-1">
                        روستا
                      </Form.Label>

                      <Form.Control
                        {...register("residenceVillage")}
                        type="text"
                        id="residenceVillage"
                      />
                    </Form.Group>
                  </Row>
                </Col>
                <Col xs={12} md={9}>
                  <Controller
                    name="residenceCoordinate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <GeoPick
                        {...field}
                        initLocation={watch("residenceCoordinate")}
                        ref={residenceMapRef}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} md={12}>
                  <InputGroup>
                    <Form.Text className="text-danger mx-1">*</Form.Text>

                    <InputGroup.Text>آدرس</InputGroup.Text>
                    <Form.Control
                      type="text"
                      {...register("residenceAddress", { required: true })}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer style={{ direction: "ltr" }}>
            <Row>
              <Col md="12">
                <Form.Text muted className="mx-3">
                  لطفا تنها لوکیشن را انتخاب و تایید نمایید،سایر فیلدها بر اساس
                  لوکیشن بصورت اتوماتیک پر خواهد شد
                </Form.Text>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeResidenceModal}
                  className="mx-1"
                >
                  بستن
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  onClick={handelSubmitResidenceGeoFields}
                  className="mx-1"
                >
                  اعمال تغییر در فرم
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        <Col>
          {(errors.birthAddress ||
            errors.birthCoordinate ||
            errors.birthProvince ||
            errors.birthCountry ||
            errors.birthDistinct) && (
            <Form.Text className="text-danger mx-1">*</Form.Text>
          )}

          <Form.Label>اطلاعات محل تولد</Form.Label>
          <Button
            variant={setBirthGeoOk ? "outline-success" : "outline-primary"}
            onClick={openBirthModal}
            className="mx-1"
          >
            {setBirthGeoOk ? "ویرایش" : "ثبت از نقشه"}
          </Button>
        </Col>
        <Modal
          show={showBirthModal}
          dialogClassName="modal-80w"
          backdrop="static"
          onHide={closeBirthModal}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={6} md={3}>
                  <Row>
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="birthProvince">استان</Form.Label>
                      <Form.Control
                        {...register("birthProvince", { required: true })}
                        type="text"
                        id="birthProvince"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="birthCountry">شهرستان</Form.Label>
                      <Form.Control
                        {...register("birthCountry", { required: true })}
                        type="text"
                        id="birthCountry"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label htmlFor="birthCity" className="mx-1">
                        شهر
                      </Form.Label>
                      <Form.Control
                        {...register("birthCity")}
                        type="text"
                        id="birthCity"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="my-2">
                    <Form.Group>
                      <Form.Text className="text-danger mx-1">*</Form.Text>

                      <Form.Label htmlFor="birthDistinct">بخش</Form.Label>

                      <Form.Control
                        {...register("birthDistinct", { required: true })}
                        type="text"
                        id="birthDistinct"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Form.Label htmlFor="birthNeighbourhood" className="mx-1">
                        محله
                      </Form.Label>

                      <Form.Control
                        {...register("birthNeighbourhood")}
                        type="text"
                        id="birthNeighbourhood"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-2">
                    <Form.Group>
                      <Form.Label htmlFor="birthVillage" className="mx-1">
                        روستا
                      </Form.Label>

                      <Form.Control
                        {...register("birthVillage")}
                        type="text"
                        id="birthVillage"
                      />
                    </Form.Group>
                  </Row>
                </Col>
                <Col xs={12} md={9}>
                  <Controller
                    name="birthCoordinate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <GeoPick
                        {...field}
                        initLocation={watch("birthCoordinate")}
                        ref={birthMapRef}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6} md={12}>
                  <InputGroup>
                    <Form.Text className="text-danger mx-1">*</Form.Text>

                    <InputGroup.Text>آدرس</InputGroup.Text>
                    <Form.Control
                      type="text"
                      {...register("birthAddress", { required: false })}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer style={{ direction: "ltr" }}>
            <Row>
              <Col md="12">
                <Form.Text muted className="mx-3">
                  لطفا تنها لوکیشن را انتخاب و تایید نمایید،سایر فیلدها بر اساس
                  لوکیشن بصورت اتوماتیک پر خواهد شد
                </Form.Text>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeBirthModal}
                  className="mx-1"
                >
                  بستن
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  onClick={handelSubmitBirthGeoFields}
                  className="mx-1"
                >
                  اعمال تغییر در فرم
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        <Col>
          {errors.documents && (
            <Form.Text className="text-danger mx-1">*</Form.Text>
          )}

          <Form.Label>مستندات و مدارک</Form.Label>
          <Button
            variant={setsetDocumentsOk ? "outline-success" : "outline-primary"}
            onClick={openDocumentsModal}
            className="mx-1"
          >
            {setsetDocumentsOk ? " ویرایش" : "بارگذاری"}
          </Button>
        </Col>
        <Modal
          show={showDocumentsModal}
          dialogClassName="modal-80w"
          backdrop="static"
          onHide={closeDocumentsModal}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} md={12}>
                  <Controller
                    name="documents"
                    control={control}
                    render={({ field }) => (
                      <DocumentUploader
                        changedState={() => setChangedDocsState(true)}
                        defaultValue={initValues["docs"] || []}
                        registeredFiles={field.value || []}
                        onFilesChange={(files) => field.onChange(files)}
                        removedPreApload={(fileName) =>
                          setInitValues((preValues) => ({
                            ...preValues,
                            docs: preValues["docs"].filter(
                              (e) => e.name != fileName
                            ),
                          }))
                        }
                      />
                    )}
                  />
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

                <Button
                  variant="primary"
                  type="button"
                  onClick={handelSubmitDocumentsFields}
                  className="mx-1"
                >
                  اعمال تغییر در فرم
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        <Col>
          {errors.avatar && (
            <Form.Text className="text-danger mx-1">*</Form.Text>
          )}

          <Form.Label>تصویر</Form.Label>

          <Button
            variant={setsetAvatarOk ? "outline-success" : "outline-primary"}
            onClick={openAvatarModal}
            className="mx-1"
          >
            {setsetAvatarOk ? "ویرایش" : "بارگذاری"}
          </Button>
        </Col>
        <Modal
          show={showAvatarModal}
          backdrop="static"
          onHide={closeAvatarModal}
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} md={12}>
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <Avatar
                        selectedFile={field.value}
                        initValue={initValues["avatarName"]}
                        onFileChange={(file) => field.onChange(file)}
                      />
                    )}
                  />
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
                  onClick={closeAvatarModal}
                  className="mx-1"
                >
                  بستن
                </Button>

                <Button
                  variant="primary"
                  type="button"
                  onClick={handelSubmitAvatarField}
                  className="mx-1"
                >
                  اعمال تغییر در فرم
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Row>
      <Row className="my-5">
        <Col md="12">
          <Button
            variant="outline-primary"
            type="submit"
            size="lg"
            className="mx-1"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}

            {isSubmitting ? (
              <span className="visually-hidden">در حال ثبت...</span>
            ) : (
              <span>ثبت تغییرات در سرور</span>
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddManagerAsOrganManager;
