const sleep = (delay: number = 1000) => {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
};
export default sleep;
