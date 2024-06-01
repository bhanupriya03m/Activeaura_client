

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(false); // Start with true to show initial loading state
  const [data, setData] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);

  const dashboardData = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getDashboardDetails(token);
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const getTodaysWorkout = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getWorkouts(token, "");
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching today's workouts:", err);
      alert("Failed to load today's workouts.");
    } finally {
      setLoading(false);
    }
  };

  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await addWorkout(token, { workoutString: workout });
      await dashboardData();
      await getTodaysWorkout();
    } catch (err) {
      if (err.code === 11000) {
        alert("Workout with this name already exists.");
      } else {
        console.error("Error adding workout:", err);
        alert("Failed to add workout.");
      }
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        {loading ? (
          <div>Loading...</div> // Simple loading placeholder
        ) : (
          <>
            <FlexWrap>
              {counts.map((item, index) => (
                <CountsCard key={index} item={item} data={data} />
              ))}
            </FlexWrap>

            <FlexWrap>
              <WeeklyStatCard data={data} />
              <CategoryChart data={data} />
              <AddWorkout
                workout={workout}
                setWorkout={setWorkout}
                addNewWorkout={addNewWorkout}
                buttonLoading={buttonLoading}
              />
            </FlexWrap>

            <Section>
              <Title>Today's Workouts</Title>
              <CardWrapper>
                {todaysWorkouts.map((workout, index) => (
                  <WorkoutCard key={index} workout={workout} />
                ))}
              </CardWrapper>
            </Section>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
