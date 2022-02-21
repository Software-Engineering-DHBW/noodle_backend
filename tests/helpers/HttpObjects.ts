export const mockRequest = (body) => ({
  body,
})

export const mockResponse = () => {
  const res = { status: () => {}, send: () => {}};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
