import { View, Text } from 'react-native';
import React from 'react';

const FormatMoney = (amount) => {
  // Định dạng số tiền và thêm "đ" ở trước
  return 'đ' + amount.toLocaleString('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default FormatMoney;
