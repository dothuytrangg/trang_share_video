'use client'
import { Button } from "@mui/material";
import requestApi from "../../../helpers/api";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

export default function Category({ onCategorySelect }: { onCategorySelect: (id: string) => void }) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1);
  const [index, setIndex] = useState("");
  const [indexId, setIndexId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Trạng thái để theo dõi category được chọn
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const theme = useSelector((state: any) => state.master.theme);
  var ranonce = false;

  useEffect(() => {
    if (!ranonce) {
      loadCategories(page);
      ranonce = true;
    }
  }, []);

  const loadCategories = async (pageSelected: number) => {
    await requestApi(`categories?page=${pageSelected}&items_per_page=10&search`, "GET").then((res: any) => {
      console.log('res category homePage', res);
      if (res.success) {
        setCategories(res.data);
        setLastPage(res.lastPage);
        setIndex(res.pinnedCategory.name);
        setIndexId(res.pinnedCategory.id);
         // Chọn mặc định nút đầu tiên
         if (res.data.length > 0) {
          setSelectedCategory(res.pinnedCategory.id);
          onCategorySelect(res.pinnedCategory.id); // Gửi callback với danh mục đầu tiên
        }
      }
    }).catch((err: any) => {
      console.error(err);
    });
  };

  const renderPinnedCategory = () => {
    if (index) {
      return (
        <Button
          sx={{
            ml: 1, pr: 1, textTransform: "none", mt: 2,
            backgroundColor: selectedCategory === indexId  ? (theme === "light"?'#121212' : '#fff'):'', // Màu khi chọn
            // '&:hover': {
            //   backgroundColor: selectedCategory === indexId ? 'primary.dark' : 'lightgray', // Màu khi hover
            // },
            color:selectedCategory === indexId  ? (theme === "light"?'#fff' : '#121212'):'',
          }}
          color="inherit"
          variant="contained"
          size="small"
          onClick={() => {
            setSelectedCategory(indexId); // Cập nhật category được chọn
            onCategorySelect(indexId);
          }}
        >
          {t('all')}
        </Button>
      )
    }
  };

  return (
    <div>
      {renderPinnedCategory()}
      {categories.map((category: any, id: number) => (
        category.status !== 2 &&
        <Button
          key={id}
          sx={{
            ml: 1, pr: 1, textTransform: "none", mt: 2,
            backgroundColor: selectedCategory === category.id  ? (theme === "light"?'#121212' : '#fff'):'', // Màu khi chọn
            // '&:hover': {
            //   backgroundColor: selectedCategory === category.id ? 'primary.dark' : 'Gray', // Màu khi hover
            // },
            color:selectedCategory ===  category.id  ? (theme === "light"?'#fff' : '#121212'):'',
          }}
          color="inherit"
          variant="contained"
          size="small"
          onClick={() => {
            setSelectedCategory(category.id); // Cập nhật category được chọn
            onCategorySelect(category.id);
          }}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
