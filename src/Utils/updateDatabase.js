import axiosInstance from "../Feature Components/axiosGlobal";

const updateDatabase = async () => {
      const { data } = await axiosInstance.post("/updateDatabase", { token: process.env.REACT_APP_API_TOKEN });
      return data;
};

export default updateDatabase;
