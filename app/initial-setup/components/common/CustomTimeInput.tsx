import React from "react";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface CustomTimeInputProps {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
}

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#ec4899", // rosa
          },
          "&:hover fieldset": {
            borderColor: "#22c55e", // verde
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6", // azul
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-focused": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#b0b0d8", // fondo del popup (gris oscuro)
          color: "#fff",              // texto dentro del popup
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ec4899", // íconos del reloj
          "&:hover": {
            backgroundColor: "rgba(236,72,153,0.2)", // hover rosa translúcido
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#fff", // números del reloj en blanco
        },
      },
    },
  },
});

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({
  value,
  onChange,
  label,
}) => {
 const handleChange = (newValue: Date | null) => {
  if (newValue) {
    const formatted = newValue.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // fuerza 24h
    });
    onChange(formatted);
  } else {
    onChange("");
  }
};


  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopTimePicker
          label={label}
          value={value ? new Date(`1970-01-01T${value}`) : null}
          onChange={handleChange}
          ampm={false} // formato 24h
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              className:
                "bg-white text-black border rounded focus:ring-2 focus:ring-pink-500",
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomTimeInput;
