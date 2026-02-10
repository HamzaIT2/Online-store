import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { t } from "../i18n";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  return (

    <Box sx={{ mb: 1, direction: "rtl" }}>
      <TextField
        
        variant="standard"
        placeholder={t('search') || 'بحث'}
        value={term}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
