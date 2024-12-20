const headers = {
  "Api-Key": process.env.NEXT_PUBLIC_NESHAN_API_KEY,
};

export const getLocationInfo = async (latitude, longitude) => {
  const apiUrl = `https://api.neshan.org/v5/reverse?lat=${latitude}&lng=${longitude}`;
  try {
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Neshan reverse API. Status: ${response.status}`
      );
    }

    const data = await response.json();

    const province = data.state;
    const county = data.county;
    const district = data.district;
    const address = data.formatted_address;

    const city = data.city;
    const neighbourhood = data.neighbourhood;
    const village = data.village;
    const municipality_zone = data.municipality_zone;

    return {
      province,
      city,
      county,
      district,
      neighbourhood,
      village,
      address,
      municipality_zone,
    };
  } catch (error) {
    try {
      const resp = await getLocationInfoOpenStreet(latitude, longitude);
      return resp;
    } catch (error) {
      throw error;
    }
  }
};

export const getGeneralizedLocation = async (address, zoom) => {
  const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&zoom=${zoom}`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from openstreetmap API. Status: ${response.status}`
      );
    }
    const data = await response.json();
    return `{"lat":${data[0]?.lat},"lng":${data[0]?.lon}}`;
  } catch (error) {
    try {
      const res = await NeshanGenGeo(address);
      return res;
    } catch (error) {
      throw error;
    }
  }
};

export const NeshanGenGeo = async (address) => {
  const apiUrl = `https://api.neshan.org/v4/geocoding?address=${encodeURIComponent(
    address
  )}}`;
  try {
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Neshan Geo API. Status: ${response.status}`
      );
    }

    const data = await response.json();

    const location = data?.location;

    return `{"lat":${location?.x},"lng":${location?.y}}`;
  } catch (error) {
    throw error;
  }
};

export const getLocationInfoOpenStreet = async (latitude, longitude) => {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=fa`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Nominatim reverse API. Status: ${response.status}`
      );
    }

    const data = await response.json();
    const address = data?.display_name;
    const city =
      data?.address?.city ||
      data.address?.city_district ||
      data.address?.hamlet;
    const county = data?.address?.county;
    const province =
      data?.address?.state || data?.address?.region || data?.address?.province;
    const neighbourhood =
      data?.address?.neighbourhood ||
      data?.address?.suburb ||
      data?.address?.village;

    return {
      province: province || "",
      city: city || "",
      county: county || "",
      neighbourhood: neighbourhood || "",
      address: address || "",
      district: data.address?.city_district || "",
      village: data?.address?.village || " ",
      municipality_zone: "",
    };
  } catch (fallbackError) {
    throw new Error("Both Neshan and Nominatim APIs failed");
  }
};
