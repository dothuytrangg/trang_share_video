'use client'
import { Button } from "@mui/material";
import requestApi from "../../../helpers/api";
import { useEffect, useState } from "react";

export default function Category({ onCategorySelect }: { onCategorySelect: (id: string) => void }) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1);
  const [index, setIndex] = useState("");
  const [indexId, setIndexId] = useState("");
  
  useEffect(() => {
    loadCategories(page);
  }, []);
  const loadCategories = async (pageSelected: number) => {
    await requestApi(`categories?page=${pageSelected}&items_per_page=10&search`, "GET").then((res: any) => {
      console.log('res category homePage', res);
      if (res.success) {
        setCategories(res.data);
        setLastPage(res.lastPage);
        setIndex(res.pinnedCategory.name)
        setIndexId(res.pinnedCategory.id)
        // setIndex(res.pinnedCategory);
      }

    }).catch((err: any) => {
      console.error(err);
    })
    // console.log(check)
    // setCategories(check.data);
    // console.log('category hhh',categories);
  };

//   const setPositionCategory = (categoryId: string) => {
//     requestApi(`categories/${categoryId}`, "GET")
//       .then((res: any) => {
//         console.log(res);
          
//       })
// }

  


  const renderPinnedCategory = () => {

    // if (categories.length === 0) {
    //   return <p>No categories found.</p>;
    // }
    if(index){
      console.log(index)
      return (
        <Button
     
        sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained"
        size="small"
        onClick={()=>onCategorySelect(indexId)}
      >
        {index }
      </Button>
      
     
        

      )

    }
 

  };

  return( 
    
       <div>
        {renderPinnedCategory()}
        {categories.map((category: any, id: number) => (
      
        category.status !==2 && 
        <Button
        key={id}
        sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained"
        size="small"
        onClick={()=>onCategorySelect(category.id)}
      >
        {category.name}
      </Button>
      ))}
       </div>
       ); 
}