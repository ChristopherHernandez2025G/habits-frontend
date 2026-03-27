"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setHabits } from "../store/habitsSlice";

export default function Home() {
  const dispatch = useDispatch();
  const habits = useSelector((state: RootState) => state.habits.habits);

  const [newHabit, setNewHabit] = useState("");

  const fetchHabits = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No hay token");
      return;
    }

    fetch("http://localhost:5000/api/habits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          dispatch(setHabits(data));
        } else {
          console.log("Respuesta inválida:", data);
          dispatch(setHabits([]));
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const createHabit = async () => {
    const token = localStorage.getItem("token");

    if (!newHabit.trim()) return;

    try {
      await fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newHabit,
        }),
      });

      setNewHabit("");
      fetchHabits();
    } catch (error) {
      console.error("Error creando hábito:", error);
    }
  };

  const completeHabit = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/habits/${id}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchHabits();
    } catch (error) {
      console.error("Error completando hábito:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Habit Tracker
      </h1>

      {/* AGREGAR HÁBITO */}
      <div className="max-w-xl mx-auto mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nuevo hábito..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="flex-1 p-2 border rounded text-black"
        />

        <button
          onClick={createHabit}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      {!Array.isArray(habits) || habits.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay hábitos registrados
        </p>
      ) : (
        <div className="grid gap-6 max-w-xl mx-auto">
          {habits.map((habit: any) => {
            const progress = Math.min((habit.streak / 66) * 100, 100);

            return (
              <div
                key={habit._id}
                className="bg-white shadow-lg rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-black">
                  {habit.name}
                </h2>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
                  <div
                    className={`h-4 rounded-full ${
                     progress < 33
                    ? "bg-red-500"
                    : progress < 66
                    ? "bg-yellow-500"
                    : "bg-green-500"
                     }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Botón Done */}
                <button
                  onClick={() => completeHabit(habit._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Done
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}