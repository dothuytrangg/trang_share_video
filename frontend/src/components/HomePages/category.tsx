'use client'
import { Button } from "@mui/material";
import requestApi from "../../../helpers/api";
import { useEffect, useState } from "react";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  useEffect(() => {
    loadCategories(page);
  }, []);
  const loadCategories = async (pageSelected: number) => {
    await requestApi(`categories?page=${pageSelected}&items_per_page=10&search`, "GET").then((res: any) => {
      console.log('res category', res);
      if (res.success) {
        setCategories(res.data);
        setLastPage(res.lastPage);
      }

    }).catch((err: any) => {
      console.error(err);
    })
    // console.log(check)
    // setCategories(check.data);
    // console.log('category hhh',categories);
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