export const mockRequest = (body, params?) => ({
  body,
  params,
});

export const mockResponse = () => {
  const res = {
    status: () => {},
    send: () => {},
    sendStatus: () => {},
  };
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};
