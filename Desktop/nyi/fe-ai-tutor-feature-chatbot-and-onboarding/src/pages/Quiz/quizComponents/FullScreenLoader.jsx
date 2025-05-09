/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import React from "react";
import { Box, Typography, Grow, Fade } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

const FullScreenLoader = ({ message, icon }) => {
  return React.createElement(
    Box,
    {
      sx: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 1300,
        color: "#fff",
        flexDirection: "column",
        overflow: "hidden",
        "@keyframes rotateAnimation": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
    React.createElement(
      Grow,
      { in: true, timeout: 500 },
      React.createElement(
        Box,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "pulseAnimation 2s ease infinite",
          },
        },
        icon ||
          React.createElement(SyncIcon, {
            sx: {
              fontSize: 80,
              color: "white",
              animation: "rotateAnimation 2s linear infinite", // 🔄 Enables rotation
            },
          }),
        React.createElement(
          Fade,
          { in: true, timeout: 750 },
          React.createElement(Typography, {
            variant: "h4",
            sx: {
              mt: 2,
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              color: "white",
            },
            children: message,
          })
        )
      )
    )
  );
};

export default FullScreenLoader;
