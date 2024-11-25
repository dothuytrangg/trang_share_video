import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

// Tạo ReponsiveContainer với các thuộc tính tương tự SignInContainer
export const ReponsiveContainer = styled(Stack)(({ theme }) => ({
    height: "auto",  // Chiều cao tự động dựa vào nội dung
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))", // Gradient nền
    backgroundRepeat: "no-repeat",  // Không lặp lại nền
    justifyContent: "center",  // Căn giữa nội dung
    alignItems: "center",  // Căn giữa các item theo chiều ngang

    [theme.breakpoints.down(600)]: {
        // Cho màn hình xs (extra-small)
        flexDirection: "column",  // Xếp theo chiều dọc trên điện thoại di động
    },

    [theme.breakpoints.between(600, 900)]: {
        // Cho màn hình sm (small) đến md (medium)
        flexDirection: "row",  // Xếp theo chiều ngang trên các thiết bị như iPad
    },

    [theme.breakpoints.between(900, 1200)]: {
        // Cho màn hình md (medium) đến lg (large)
        flexDirection: "row",  // Xếp theo chiều ngang trên các thiết bị màn hình lớn
    },

    [theme.breakpoints.up(1200)]: {
        // Cho màn hình lg (large) trở lên
        flexDirection: "row",  // Xếp theo chiều ngang trên desktop lớn
    },

    // Chế độ tối
    ...theme.applyStyles("dark", {
        backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))", // Gradient cho chế độ tối
    }),
}));
