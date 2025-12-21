import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import React, { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ThemeSettings } from "../components/ThemeSettings";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [themeOpened, setThemeOpened] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header onThemeClick={() => setThemeOpened(true)} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <NavBar />
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "2rem",
            backgroundColor:
              colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
          }}
        >
          <ThemeSettings
            opened={themeOpened}
            onClose={() => setThemeOpened(false)}
          />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
