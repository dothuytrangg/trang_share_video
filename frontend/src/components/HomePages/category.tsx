'use client'
import { Button } from "@mui/material";
import requestApi from "../../../helpers/api";
import { useEffect, useState } from "react";

export default function Category() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    var check = await requestApi("categories", "GET", (res: any) => {
      // if (res.success) {  
      //   console.log('res',res)
      //   console.log('categories:'+ categories);
      // }
      console.log(res);
    });
    console.log('check hompage', check)
    setCategories(check.data);
    // console.log('category',categories)
  };
  const renderCategory = () => {
    // if (categories.length === 0) {
    //   return <p>No categories found.</p>;
    // }

    return categories.map((category: any, index: number) => (
      <Button
        key={index}
        sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained"
        size="small"
      >
        {category.name}
      </Button>
    ));
  };

  return <div>{renderCategory()}</div>; // Hiển thị danh mục
}