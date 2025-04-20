"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const StageModal = ({ open, onClose, stageName, setStageName, handleSubmit }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(33, 33, 33, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          border: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <span className="font-bold text-lg">Add New Stage</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3, background: "transparent" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Stage Name"
          type="text"
          fullWidth
          variant="outlined"
          value={stageName.name}
          onChange={(e) =>
            setStageName({ ...stageName, name: e.target.value })
          }
          sx={{
            mb: 2,
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 1,
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          background: "transparent",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="secondary"
          sx={{
            textTransform: "none",
            bgcolor: (theme) => theme.palette.grey[500],
            "&:hover": { bgcolor: (theme) => theme.palette.grey[600] },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            bgcolor: (theme) => theme.palette.primary.main,
            "&:hover": { bgcolor: (theme) => theme.palette.primary.dark },
          }}
        >
          Add Stage
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StageModal;