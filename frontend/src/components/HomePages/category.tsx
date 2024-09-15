'use client'
import { Button } from "@mui/material";

export default function Category() {
  const renderCategory = () => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      result.push(
        <Button
          key={i}
          sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
          color="inherit"
          variant="contained"
          size="small"
        >
          Gaming - {i + 1}
        </Button>
      );
    }
    return result;
  };
  return <div> {renderCategory()}</div>;
}
