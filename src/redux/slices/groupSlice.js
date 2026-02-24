import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addMembersToGroupAPI,
  createGroupAPI,
  deleteGroupAPI,
  getAllGroupsAPI,
  getGroupByIdAPI,
  removeMembersFromGroupAPI,
  createGroupTransactionAPI,
  addGroupMessageAPI
} from "../../api/api";
import { authRequest } from "../../api/axiosPage";

export const fetchAllGroups = createAsyncThunk(
  "groups/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllGroupsAPI();
      return res.groups;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  "groups/fetchById",
  async (groupId, thunkAPI) => {
    try {
      return await getGroupByIdAPI(groupId);
    } catch {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/create",
  async (groupData, thunkAPI) => {
    try {
      const data = await createGroupAPI(groupData);
      return data.group;
    } catch {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const addMembersToGroup = createAsyncThunk(
  "groups/addMembers",
  async ({ groupId, newMembers }, thunkAPI) => {
    await addMembersToGroupAPI({ groupId, newMembers });
    thunkAPI.dispatch(fetchGroupById(groupId));
  }
);

export const removeMembersFromGroup = createAsyncThunk(
  "groups/removeMembers",
  async ({ groupId, removeMembers }, thunkAPI) => {
    await removeMembersFromGroupAPI({ groupId, removeMembers });
    thunkAPI.dispatch(fetchGroupById(groupId));
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/delete",
  async (groupId) => {
    await deleteGroupAPI(groupId);
    return groupId;
  }
);

export const createGroupSplit = createAsyncThunk(
  "group/createSplit",
  async ({ groupId, data }, thunkAPI) => {
    const res = await createGroupTransactionAPI(groupId, data);
    thunkAPI.dispatch(fetchGroupById(groupId));
    thunkAPI.dispatch(fetchAllGroups());
    return res;
  }
);

export const addGroupMessage = createAsyncThunk(
  "groups/addMessage",
  async ({ groupId, message }, thunkAPI) => {
    const res = await addGroupMessageAPI(groupId, { message: message.text });
    thunkAPI.dispatch(fetchGroupById(groupId));
    return res;
  }
);

export const markSplitPaidAPI = async ({ expenseId, groupId }) => {
  try {
    const response = await authRequest.post(
      `/group-transactions/${expenseId}/mark-paid`,
      { groupId }
    );
    return response.data;
  } catch (err) {
    console.error("MARK PAID API ERROR:", err.response?.data || err);
    return null;
  }
};

export const confirmPaymentAPI = async (expenseId, memberId) => {
  try {
    const response = await authRequest.put(
      `/group-transactions/confirm/${expenseId}`,
      { memberId }
    );
    return response.data;
  } catch (err) {
    console.error("CONFIRM PAYMENT API ERROR:", err.response?.data || err);
    throw err;
  }
};



export const markSplitPaid = createAsyncThunk(
  "groups/markSplitPaid",
  async (data, { rejectWithValue }) => {
    try {
      const res = await markSplitPaidAPI(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Request failed");
    }
  }
);
export const confirmSplitPayment = createAsyncThunk(
  "group/confirmPayment",
  async ({ expenseId, memberId, groupId }, thunkAPI) => {
    try {
      const res = await confirmPaymentAPI(expenseId, memberId);

  
      if (groupId) {
        thunkAPI.dispatch(fetchAllGroups());
        thunkAPI.dispatch(fetchGroupById(groupId));
      }

      return res; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    currentGroup: null,
    status: "idle",
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      .addCase(createGroupSplit.fulfilled, (state, action) => {
        const updatedGroup = action.payload?.group;
        if (!updatedGroup) return;
        const index = state.groups.findIndex(g => g._id === updatedGroup._id);
        if (index !== -1) state.groups[index] = updatedGroup;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g._id !== action.payload);
        if (state.currentGroup?._id === action.payload) {
          state.currentGroup = null;
        }
      })
      .addCase(markSplitPaid.fulfilled, () => {})
      .addCase(markSplitPaid.rejected, (state, action) => {
        console.error("MARK PAID FAILED:", action.payload);
      })
      .addCase(confirmSplitPayment.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { expense, group } = action.payload;

        if (group) {
          const index = state.groups.findIndex(g => g._id === group._id);
          if (index !== -1) state.groups[index] = group;

          if (state.currentGroup?._id === group._id) {
            state.currentGroup = group;
          }
        }

        if (expense) {
          state.groups.forEach(g => {
            g.messages?.forEach(msg => {
              if (msg.expense === expense._id) {
                msg.splits = expense.splits;
              }
            });
          });

          state.currentGroup?.messages?.forEach(msg => {
            if (msg.expense === expense._id) {
              msg.splits = expense.splits;
            }
          });
        }
      })
      .addCase(addGroupMessage.fulfilled, (state, action) => {
        state.currentGroup.messages = action.payload.messages;
      });
  }
});

export default groupSlice.reducer;