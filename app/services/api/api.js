import xaxios from "./xaxios";

export const registerMe = async (data) => {
  try {
    await xaxios.post("/registerMe", data);
  } catch (error) {
    throw error;
  }
};

export const loginMe = async (data) => {
  try {
    return await xaxios.post("/loginMe", data);
  } catch (error) {
    throw error;
  }
};

export const doSignOut = async () => {
  try {
    return await xaxios.post("/doSignOut", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
  } catch (error) {
    throw error;
  }
};

export const submitManagerInfo = async (data) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== "documents" && key !== "avatar") {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
    }

    const documents = data.documents;
    if (documents && documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        documents[i];
        formData.append(
          "documents",
          documents[i],
          documents[i].description + "." + documents[i].name.split(".").pop()
        );
      }
    }

    const avatar = data.avatar;
    formData.append("avatar", avatar);

    await xaxios.post("/managerSubmitInfo", formData, {
      headers: { "Content-Type": "multipart/formdata" },
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const getManagerInitInfo = async () => {
  try {
    const response = await xaxios.get("/managerLandingInfo");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSelectObjects = async () => {
  try {
    const response = await xaxios.get("/getSelectObjects");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMeOtpCode = async () => {
  try {
    await xaxios.post("/sendMeOtpCode");
    return;
  } catch (error) {
    throw error;
  }
};

export const sendMeChangePassOtpCode = async () => {
  try {
    await xaxios.post("/sendMeChangePassOtp");
    return;
  } catch (error) {
    throw error;
  }
};

export const confirmMyPhone = async (otpCode) => {
  try {
    await xaxios.post("/confirmMyPhone", { otp: otpCode });
    return;
  } catch (error) {
    throw error;
  }
};

export const confirmCanChangePass = async (otpCode) => {
  try {
    await xaxios.post("/confirmCanChangePass", { otp: otpCode });
    return;
  } catch (error) {
    throw error;
  }
};

export const downloadThisFile = async (fileName) => {
  try {
    return await xaxios.get("/docs/" + fileName, {
      responseType: "blob",
    });
  } catch (error) {
    throw error;
  }
};
export const downloadReportFile = async (fileName) => {
  try {
    return await xaxios.get("/repdocs/" + fileName, {
      responseType: "blob",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteThisFile = async (fileName) => {
  try {
    return await xaxios.delete("/docsx/" + fileName);
  } catch (error) {
    throw error;
  }
};

//Admin

export const submitManagerInfoAsAdmin = async (data) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== "documents" && key !== "avatar") {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
    }

    const documents = data.documents;
    if (documents && documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        documents[i];
        formData.append(
          "documents",
          documents[i],
          documents[i].description + "." + documents[i].name.split(".").pop()
        );
      }
    }

    const avatar = data.avatar;
    formData.append("avatar", avatar);

    await xaxios.post("/submitManagerInfoAsAdmin", formData, {
      headers: { "Content-Type": "multipart/formdata" },
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const getManagerInitInfoAsAdmin = async (managerId) => {
  try {
    const response = await xaxios.post("/getManagerInitInfoAsAdmin", {
      userId: managerId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getManagersForAdmin = async () => {
  try {
    return await xaxios.get("/getManagersForAdmin");
  } catch (error) {
    throw error;
  }
};

export const getReportsAdmin = async (managerId) => {
  try {
    return await xaxios.post("/getReportsAdmin", { userId: managerId });
  } catch (error) {
    throw error;
  }
};

export const getManagerDocListAdmin = async (managerId) => {
  try {
    return await xaxios.post("/getManagerDocListAdmin", { userId: managerId });
  } catch (error) {
    throw error;
  }
};

export const submitSelect = async (label, value, selId) => {
  try {
    return await xaxios.post("/submitSelect", {
      label: label,
      value: value,
      selId: selId,
    });
  } catch (error) {
    throw error;
  }
};

// organManager

export const getManagerDocList = async (managerId) => {
  try {
    return await xaxios.post("/getManagerDocList", { userId: managerId });
  } catch (error) {
    throw error;
  }
};

export const getManagersForOrganManager = async () => {
  try {
    return await xaxios.get("/getManagersForOrganManager");
  } catch (error) {
    throw error;
  }
};

export const getManagerInitInfoAsOm = async (managerId) => {
  try {
    const response = await xaxios.post("/getManagerInitInfoAsOm", {
      userId: managerId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitManagerInfoAsOm = async (data) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== "documents" && key !== "avatar") {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
    }

    const documents = data.documents;
    if (documents && documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        documents[i];
        formData.append(
          "documents",
          documents[i],
          documents[i].description + "." + documents[i].name.split(".").pop()
        );
      }
    }

    const avatar = data.avatar;
    formData.append("avatar", avatar);

    await xaxios.post("/submitManagerInfoAsOm", formData, {
      headers: { "Content-Type": "multipart/formdata" },
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const getReports = async (managerId) => {
  try {
    return await xaxios.post("/getReports", { userId: managerId });
  } catch (error) {
    throw error;
  }
};

export const submitReportStatus = async (repId) => {
  try {
    return await xaxios.post("/reportStatus", { reportId: repId });
  } catch (error) {
    throw error;
  }
};

//Home
export const getManagersForHome = async () => {
  try {
    return await xaxios.get("/getManagersForHome");
  } catch (error) {
    throw error;
  }
};

export const submitReport = async (data) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== "reportDocs") {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
    }

    const documents = data.reportDocs;
    if (documents && documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        documents[i];
        formData.append(
          "reportDocs",
          documents[i],
          documents[i].description + "." + documents[i].name.split(".").pop()
        );
      }
    }

    await xaxios.post("/submitReport", formData, {
      headers: { "Content-Type": "multipart/formdata" },
    });
    return;
  } catch (error) {
    throw error;
  }
};
