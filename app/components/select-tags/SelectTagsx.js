import { submitSelect } from "@/app/services/api/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Form, Spinner, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";

const SelectTagsx = ({ selectTags, selectTypeId, updateSels }) => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;
  const [newTag, setNewTag] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [errorMesge, setErrorMesge] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTags(selectTags);

   

    setNewTag("");
    setSelectedTag("");
    setSearchInput("");
  }, [selectTags]);

  useEffect(() => {
    setFilteredTags(
      tags?.filter((e) =>
        e.label.includes(searchInput ? searchInput.trim() : newTag?.trim())
      )
    );
    setCurrentPage(1);
  }, [searchInput, newTag, tags]);

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

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setNewTag(tag.label);
  };

  const handleAddTag = async (del) => {
    if (tags.some((e) => e.label == newTag.trim()) && !selectedTag) {
      setIsInputValid(false);
      setErrorMesge("این مورد از قبل موجود است");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitSelect(
        del === "delete" ? "" : newTag,
        selectedTag?.value,
        selectTypeId
      );
      if (del === "delete") {
        toast.success("حذف شد");
      } else {
        toast.success("ثبت شد");
      }

      updateSels();
    } catch (error) {
      const elseError = "مشکلی در انجام درخواست رخ داده است";
      errorHandler(router, error, elseError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelTag = () => {
    setSelectedTag("");
    setNewTag("");
    setIsInputValid(true);
    setErrorMesge("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (!selectTypeId) {
    return <></>;
  }

  return (
    <div className="mx-1 mt-3">
      <Row>
        <Col md={2}>
          <div className="mt-5">
            <Col>
              <Form.Control
                type="text"
                placeholder="ایجاد یا ویرایش "
                value={newTag || ""}
                size="lg"
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setErrorMesge("");
                  setIsInputValid(true);
                  setSearchInput("");
                  setCurrentPage(1);
                }}
                isInvalid={!isInputValid}
              />
              <Form.Text className="text-danger">
                {errorMesge && errorMesge}
              </Form.Text>
              <div>
                <Button
                  variant="outline-primary"
                  className="mx-1 my-2"
                  type="button"
                  size="sm"
                  onClick={handleAddTag}
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
                    <span className="visually-hidden"> ...</span>
                  ) : (
                    <span> {selectedTag ? "ویرایش" : "ثبت"}</span>
                  )}
                </Button>

                <Button
                  variant="outline-info"
                  className="mx-1 my-2"
                  type="button"
                  size="sm"
                  onClick={handleCancelTag}
                >
                  صرف نظر
                </Button>
                {selectedTag && (
                  <Button
                    variant="outline-danger"
                    className="mx-1 my-2"
                    type="button"
                    size="sm"
                    onClick={() => handleAddTag("delete")}
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
                      <span className="visually-hidden"> ...</span>
                    ) : (
                      <span>حذف</span>
                    )}
                  </Button>
                )}
              </div>
              <Form.Control
                className="mt-4"
                type="text"
                placeholder=" جست و جو"
                value={searchInput || ""}
                size="lg"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setNewTag("");
                  setSelectedTag("");
                  setCurrentPage(1);
                }}
              />
            </Col>
          </div>
        </Col>
        <Col md={10}>
          <div className="card m-card shadow border-1 ">
            <div className="card-body" style={{ minHeight: "520px" }}>
              {filteredTags?.length > 0 &&
                filteredTags?.map(
                  (tag, index) =>
                    index >= indexOfFirstItem &&
                    index < indexOfLastItem && (
                      <Button
                        key={index}
                        variant="outline-success"
                        className="m-2"
                        size="sm"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag?.label}
                      </Button>
                    )
                )}
              {filteredTags?.length == 0 && newTag && (
                <strong>
                  <span className="text-success">" {newTag?.trim()} "</span>{" "}
                  وجود ندارد، می توانید آن را ثبت نمایید
                </strong>
              )}
              {filteredTags?.length == 0 && searchInput && (
                <strong>
                  <span className="text-danger">" {searchInput} "</span> یافت
                  نشد
                </strong>
              )}
            </div>
          </div>
          <div className="overflow-auto">
            {filteredTags?.length > 0 && (
              <Pagination>
                {[...Array(Math.ceil(filteredTags?.length / itemsPerPage))].map(
                  (_, i) => (
                    <Button
                      variant="outline-info"
                      className="my-3 mx-1"
                      size="sm"
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}
              </Pagination>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SelectTagsx;
