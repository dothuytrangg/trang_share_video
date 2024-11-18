import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
export const formatDate = (date: Date): string => {
    if (!date) return '';  
    const zonedDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
    console.log('Converted Date (VN):', zonedDate);  // Kiểm tra thời gian sau khi chuyển đổi


    // Định dạng lại ngày, tháng, năm, giờ, phút, giây theo yêu cầu
    const day = format(zonedDate, 'dd');
    const month = format(zonedDate, 'MM');
    const year = format(zonedDate, 'yyyy');
    const hour = format(zonedDate, 'HH');
    const minute = format(zonedDate, 'mm');
    const second = format(zonedDate, 'ss');

    // Trả về chuỗi định dạng như dd/mm/yyyy HH:mm:ss
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};
export const formatEntityDates = (entity: any): any => {
    if (!entity) return entity;

    // Định dạng lại created_at và updated_at
    if (entity.created_at) {
        entity.created_at = formatDate(entity.created_at);  // Chuyển đổi thời gian về UTC+7
    }
    if (entity.updated_at) {
        entity.updated_at = formatDate(entity.updated_at);  // Chuyển đổi thời gian về UTC+7
    }

    return entity;
};

