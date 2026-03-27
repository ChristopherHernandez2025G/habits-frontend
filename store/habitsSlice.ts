import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Habit {
  name: string;
}

interface HabitsState {
  habits: Habit[];
}

const initialState: HabitsState = {
  habits: [],
};

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
  },
});

export const { setHabits } = habitsSlice.actions;
export default habitsSlice.reducer;