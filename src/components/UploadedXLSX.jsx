import React, { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = (e) => {
          const text = e.target.result;
          processFile(text);
        };
      } else {
        setTypeError("Please select only excel or csv file types");  
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // Función para procesar archivo de texto (sin XLSX)
  const processFile = (content) => {
    const rows = content.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      return {
        periodo: row[headers.indexOf("periodo")] || "N/A",
        transacciones: row[headers.indexOf("transacciones")] || "N/A",
        amount: row[headers.indexOf("amount")] || "N/A",
        notasCredito: row[headers.indexOf("creditNotes")] || "N/A",
      };
    });
    setExcelData(data.slice(0, 1)); // Limitar a 4 filas
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Upload & View CSV Sheets
      </Typography>

      {/* Formulario */}
      <form style={{ marginBottom: "20px" }}>
        <TextField
          type="file"
          fullWidth
          required
          onChange={handleFile}
          inputProps={{ accept: ".csv, .xls, .xlsx" }}
          variant="outlined"
          margin="normal"
        />
        {typeError && (
          <Alert severity="error" style={{ marginTop: "10px" }}>
            {typeError}
          </Alert>
        )}
      </form>

      {/* Ver datos */}
      <div>
        {excelData ? (
          <Box component={Paper} sx={{ padding: 2 }}>
            {excelData.map((row, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column", // Cambia a columna para un diseño más detallado
                  padding: "10px",
                  marginBottom: "10px", // Espacio entre filas
                  borderRadius: "4px", // Opcional: bordes redondeados
                }}
              >
                <Typography variant="subtitle1"><strong>Periodo:</strong> {row.periodo}</Typography>
                <Typography variant="subtitle1"><strong>Transacciones:</strong> {row.transacciones}</Typography>
                <Typography variant="subtitle1"><strong>Cantidad:</strong> {row.amount}</Typography>
                <Typography variant="subtitle1"><strong>Notas de Crédito:</strong> {row.notasCredito}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="subtitle1">No file is uploaded yet!</Typography>
        )}
      </div>
    </div>
  );
}

export default App;
