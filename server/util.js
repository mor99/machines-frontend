function formatReturnData(data = {},isError = false,) {
  return {
    code: isError ? 1 : 0,
    data: data,
    message: isError ? "接口错误": "操作成功",
  };
}

exports.formatReturnData = formatReturnData;
