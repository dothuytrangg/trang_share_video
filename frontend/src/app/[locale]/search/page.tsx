'use client';
import { Grid } from "@mui/material";
import { useState } from "react";
import SearchPage from "@/components/search";

export default function Page() {
    const [selectedCategoryId, setSelectedCategoryId] = useState("1");

    return (
        <Grid>
            <Grid sx={{ mt: 1 }} container spacing={2}>
                <SearchPage categoryId={selectedCategoryId} />
            </Grid>
        </Grid>
    );
}
