import { publicRequest, authRequest } from "./axiosPage";

export const signupAPI = async (data) => {
  try {
    const response = await publicRequest.post("/auth/signup", data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const loginAPI = async (data) => {
  try {
    const response = await publicRequest.post("/auth/login", data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const createPersonalTransaction = async (data) => {
  try {
    const response = await authRequest.post("/transactions", data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const getAllPersonalTransactions = async () => {
  try {
    const response = await authRequest.get("/transactions");
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await authRequest.get(`/transactions/${id}`);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await authRequest.put(`/transactions/${id}`, data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await authRequest.delete(`/transactions/${id}`);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};



export const setMonthlyBudgetAPI = async (data) => {
  try {
    const response = await authRequest.post("/budget/monthly", data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getMonthlyBudgetAPI = async () => {
  try {
    const response = await authRequest.get("/budget/monthly");
    return response.data;
  } catch (err) {
    return null;
  }
};

export const deleteMonthlyBudgetAPI = async () => {
  try {
    const response = await authRequest.delete("/budget/monthly");
    return response.data;
  } catch (err) {
    return null;
  }
};

export const setCategoryBudgetAPI = async (data) => {
  try {
    const response = await authRequest.post("/budget/category", data);
    return response.data;
  } catch (err) {
     alert(err.response?.data?.message);
    return null;
  }
};

export const updateCategoryBudgetAPI = async (category, data) => {
  try {
    const response = await authRequest.put(`/budget/category/${category}`, data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const deleteCategoryBudgetAPI = async (category,month) => {
  try {
    const response = await authRequest.delete(`/budget/category/${month}/${category}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getAllGroupsAPI = async () => {
  try {
    const response = await authRequest.get("/group");
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getGroupByIdAPI = async (id) => {
  try {
    const response = await authRequest.get(`/group/${id}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const createGroupAPI = async (data) => {
  try {
    const response = await authRequest.post("/group", data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const addMembersToGroupAPI = async (data) => {
  try {
    const response = await authRequest.put("/group/add-members", data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const removeMembersFromGroupAPI = async (data) => {
  try {
    const response = await authRequest.put("/group/remove-members", data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const deleteGroupAPI = async (groupId) => {
  try {
    const response = await authRequest.delete(`/group/${groupId}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const createGroupTransactionAPI = async (groupId, data) => {
  try {
    const response = await authRequest.post(`/group-transactions/${groupId}/split`, data);
    return response.data;
  } catch (err) {
    return null;
  }
};


export const markSplitPaidAPI = async (expenseId) => {
  try {
    const response = await authRequest.post(`/group-transactions/${expenseId}/mark-paid`);
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return null;
  }
};

export const confirmPaymentAPI = async (expenseId, data) => {
  try {
    const response = await authRequest.put(
      `/group-transactions/confirm/${expenseId}`,
      data 
    );
    return response.data;
  } catch (err) {
    console.error("CONFIRM PAYMENT API ERROR:", err.response?.data || err);
    return null;
  }
};


export const getMonthlySummaryAPI = async (params) => {
  try {
    const response = await authRequest.get("/monthly-summary", { params });
    return response.data;
  } catch (err) {
    return null;
  }
};


export const addGroupMessageAPI = async (groupId, data) => {
  try {
    const response = await authRequest.post(`/group/${groupId}/messages`, data);
    return response.data;
  } catch (err) {
    console.error("API ADD GROUP MESSAGE ERROR:", err);
    return null;
  }
};

export const setUpiApi = async (data) => {
  try {
    const response = await authRequest.post("/upi", data);
    return response.data;
  } catch (err) {
    return null;
  }
};


export const updateUpiApi = async (data) => {
  try {
    const response = await authRequest.put("/upi", data);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getGroupSplitSummaryApi = async()=>{
  try{
    const response = await authRequest.get("group-transactions/summary")
    return response.data
  }catch(err){

  }
}




