'use client'
import { Button } from "@mui/material";
import requestApi from "../../../helpers/api";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";

export default function Category({ onCategorySelect }: { onCategorySelect: (id: string) => void }) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [index, setIndex] = useState("");
  const [indexId, setIndexId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Trạng thái để theo dõi category được chọn
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const theme = useTheme();  // Sử dụng theme để nhận diện chế độ sáng/tối
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
            backgroundColor: selectedCategory === indexId ? 'black' : 'inherit', // Nền đen khi chọn
            color: selectedCategory === indexId ? 'white' : 'inherit', // Chữ trắng khi chọn
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'black' : 'black', // Nền đen khi hover trong cả 2 chế độ
              color: 'white', // Chữ trắng khi hover
            },
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
            backgroundColor: selectedCategory === category.id ? 'black' : 'inherit', // Nền đen khi chọn
            color: selectedCategory === category.id
              ? 'white'
              : theme.palette.mode === 'light'
                ? 'black' // Chữ đen khi chưa chọn trong light mode
                : 'white', // Chữ trắng khi chưa chọn trong dark mode
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'black' : 'black', // Nền đen khi hover trong cả 2 chế độ
              color: 'white', // Chữ trắng khi hover
            },
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
